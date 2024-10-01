import React from 'react';

function TrackList({tracks = []}) {
    return (
        <div className='track-list'>
            {tracks.length > 0 ? (
                tracks.map((track) => (
                    <div className='track' key={track.id}>
                       <img src={track.artworkUrl} alt={track.title} />
                       <div>
                        <h3>{track.title}</h3>
                        <p>{track.artist}</p>
                       </div>
                    </div>
                ))
            ) : (
                <p>No tracks available</p>
            
            )}
        </div>
    );
}

export default TrackList;