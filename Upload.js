import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css';

function UploadTrack({ onUpload }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [artworkFile, setArtworkFile] = useState(null);
    const [artworkPreview, setArtworkPreview] = useState('');

    const handleAudioFileChange = (e) => {
        setAudioFile(e.target.files[0]);
    };

    const handleArtworkChange = (e) => {
        const file = e.target.files[0];
        setArtworkFile(file);
        setArtworkPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (title && artist && audioFile && artworkFile) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('artist', artist);
            formData.append('file', audioFile);
            formData.append('artwork', artworkFile);

            try {
                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('File uploaded:', response.data);
                onUpload({
                    id: Date.now(),
                    title,
                    artist,
                    artworkUrl: response.data.track.artwork_path,
                    audioURL: response.data.file_path,
                });
                setTitle('');
                setArtist('');
                setArtworkFile(null);
                setArtworkPreview('');
                setAudioFile(null);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div className="upload-page">
            <h2>Upload New Track</h2>
            <div className="upload-form">
                <input
                    type="text"
                    placeholder="Track Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Artist Name"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                />
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleArtworkChange}
                />
                {artworkPreview && (
                    <div className="artwork-preview">
                        <img src={artworkPreview} alt="Artwork Preview" />
                    </div>
                )}
                <button onClick={handleUpload}>Upload Track</button>
            </div>
        </div>
    );
}

export default UploadTrack;
