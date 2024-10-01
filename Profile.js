import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SignUp from './SignUp';
import Login from './Login';

const ProfilePage = () => {
    const [tracks, setTracks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Fetch tracks to determine if there are any
        axios.get('/tracks', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(response => {
                setTracks(response.data.tracks);
                setIsLoggedIn(true); // Assume user is logged in for simplicity
            })
            .catch(error => {
                console.error('Error fetching tracks:', error);
                setIsLoggedIn(false); // Assume user is not logged in if there's an error
            });
    }, []);

    return (
        <div className="profile-page">
            {tracks.length === 0 ? (
                <div className="auth-options">
                    <SignUp />
                    <Login />
                </div>
            ) : (
                <div className="track-list">
                    {tracks.map(track => (
                        <div key={track.id} className="track">
                            <h2>{track.title}</h2>
                            <p>{track.artist}</p>
                            <img src={track.artwork_url} alt={track.title} />
                            {/* Additional track details */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

