import React from "react";
import './SongRow.css';

function SongRow({ playSong, track }) {

  return (
    /*{ <button onClick={()=> playSong(track.id)}>}*/
    <div onClick={()=> playSong(track.id)} key={track.id} className="songRow">

      <img className="songRow__album" src={track.album.images[0].url} alt="Album Cover"/>

      <div className="songRow__info">

        <h1>{track.name}</h1>

        <p>
            {track.artists.map((artist) => artist.name).join(", ")}
            {track.album.name}
        </p>

      </div>

    </div>
    /* </button> */
  );

};

export default SongRow;
