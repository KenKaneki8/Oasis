from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ARTWORK_FOLDER = 'artworks'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ARTWORK_FOLDER, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres@localhost/icarus'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', '774abc45bb313c8d40f29033')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ARTWORK_FOLDER'] = ARTWORK_FOLDER

db = SQLAlchemy(app)
jwt = JWTManager(app)

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    file_path = db.Column(db.Text)
    artwork_path = db.Column(db.Text)
    genre = db.Column(db.String(50))
    release_date = db.Column(db.Date)
    album = db.Column(db.String(100))

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    profile_picture = db.Column(db.String(150), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@app.before_first_request
def create_tables():
    db.create_all()

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 400
    
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user is None or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@app.route('/update-profile', methods=['POST'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    bio = request.form.get('bio')
    profile_picture = request.files.get('profilePicture')

    if bio:
        user.bio = bio
    
    if profile_picture:
        if not allowed_file(profile_picture.filename, ALLOWED_IMAGE_EXTENSIONS):
            return jsonify({"error": "Image file type not allowed"}), 400
        
        filename = secure_filename(profile_picture.filename)
        profile_picture_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        profile_picture.save(profile_picture_path)
        user.profile_picture = profile_picture_path

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200

@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_track():
    if 'file' not in request.files or 'artwork' not in request.files:
        return jsonify({"error": "No file or artwork uploaded"}), 400
    
    file = request.files['file']
    artwork = request.files['artwork']
    title = request.form.get('title')
    artist = request.form.get('artist')
    genre = request.form.get('genre')
    release_date = request.form.get('release_date')
    album = request.form.get('album')
    
    if file and allowed_file(file.filename, ALLOWED_EXTENSIONS):
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
    else:
        return jsonify({"error": "Audio file type not allowed"}), 400

    if artwork and allowed_file(artwork.filename, ALLOWED_IMAGE_EXTENSIONS):
        artwork_filename = artwork.filename
        artwork_path = os.path.join(app.config['ARTWORK_FOLDER'], artwork_filename)
        artwork.save(artwork_path)
    else:
        return jsonify({"error": "Artwork file type not allowed"}), 400
    
    new_track = Track(
        title=title,
        artist=artist,
        file_path=file_path,
        artwork_path=artwork_path,
        genre=genre,
        release_date=datetime.strptime(release_date, '%Y-%m-%d').date() if release_date else None,
        album=album
    )
    
    db.session.add(new_track)
    db.session.commit()

    return jsonify({"message": "Track uploaded successfully", 
                    "file_path": file_path,
                    "title": title,
                    "artist": artist,
                    "artworkURL": artwork_path}), 200

@app.route('/tracks', methods=['GET'])
@jwt_required()
def list_tracks():
    tracks = Track.query.all()
    tracks_list = [
        {
            "id": track.id,
            "title": track.title,
            "artist": track.artist,
            "file_path": track.file_path,
            "artwork_url": track.artwork_path,
            "genre": track.genre,
            "release_date": track.release_date,
            "album": track.album
        }
        for track in tracks
    ]
    return jsonify({"tracks": tracks_list})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
