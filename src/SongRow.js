import React, {useState} from "react";
import './SongRow.css';
import { isEmpty } from "../utilities";

function SongRow({ trackNumber, track }) {

  trackNumber = trackNumber + 1;
  let trackName = "";
  let trackImage = "";
  let trackArtists = []
  let trackAlbumName = "";
  let trackReleaseDate = "";
  let trackDuration = "";

  if (isEmpty(track)=== false && isEmpty(track.track) === false) {
    console.log(track.track, "track.track");

    trackName = track.track.name;
    trackImage = track.track.album.images[0].url;
    trackArtists = track.track.artists;
    trackAlbumName = track.track.album.name;
    trackReleaseDate = track.track.album.release_date;
    trackDuration = track.track.duration_ms;

  } else {

    console.log(track, "track");

    trackName = track.name;
    trackImage = track.album.images[0].url;
    trackArtists = track.artists;
    trackAlbumName = track.album.name;
    trackReleaseDate = track.album.release_date;
    trackDuration = track.duration_ms;

  };

  return (
    <div className="songRow">
      
      <div className="songRow__info">
        <p className="songRow__number"> {trackNumber} </p>
        <div className="songRow__title">
          <img className="songRow__album" src={trackImage} alt="Album Cover"/>
          <div>
            <h1>{trackName}</h1>
            <p> {trackArtists.map((artist) => artist.name).join(", ")}</p>
          </div>
        </div>
        <p className="songRow__album">
            {trackAlbumName}
        </p>
        <p className="songRow__date_added">
            {trackReleaseDate}
        </p>
        <p className="songRow__duration">
            {trackDuration}
        </p>
      </div>
    </div>
  );
}

export default SongRow;
