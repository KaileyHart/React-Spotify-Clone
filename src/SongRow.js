import React, {useState} from "react";
import './SongRow.css';
import { isEmpty } from "../utilities";

function SongRow({ track }) {

  let trackName = "";
  let trackImage = "";
  let trackArtists = []
  let trackAlbumName = "";

  if (isEmpty(track)=== false && isEmpty(track.track) === false) {

    trackName = track.track.name;
    trackImage = track.track.album.images[0].url;
    trackArtists = track.track.artists;
    trackAlbumName = track.track.album.name;

  } else {

    trackName = track.name;
    trackImage = track.album.images[0].url;
    trackArtists = track.artists;
    trackAlbumName = track.album.name;

  };

  return (
    <div className="songRow">
      <img className="songRow__album" src={trackImage} alt="Album Cover"/>
      <div className="songRow__info">
        <h1>{trackName}</h1>
        <p>
            {trackArtists.map((artist) => artist.name).join(", ")}
            {trackAlbumName}
        </p>
      </div>
    </div>
  );
}

export default SongRow;
