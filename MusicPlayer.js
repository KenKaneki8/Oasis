import React, {useState} from 'react';

function MusicPlayer({track}) {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePay = () => {
        setIsPlaying(!isPlaying);
    };

    if(!track) {
        return <div>No track selected</div>
    }

    return(
        <div className='music-player'>
            <img src={track.artworkUrl} alt={track.title} />
            <h3>{track.title}</h3>
            <p>{track.artist}</p>
            <button onClick={togglePay}>
                {isPlaying ? 'Pause': 'Play'}
            </button>
        </div>
    );
}

export default MusicPlayer;