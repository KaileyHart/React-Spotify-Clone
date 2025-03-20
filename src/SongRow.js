import React, { useState } from "react";
import './SongRow.css';
import { isEmpty, convertDate, millisecondsToMinutesAndSeconds } from "../utilities";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

function SongRow({ trackNumber, track, playSong }) {

    trackNumber = trackNumber + 1;
    let trackName = "";
    let trackImage = "";
    let trackArtists = []
    let trackAlbumName = "";
    let trackReleaseDate = "";
    let trackDuration = "";

    const [isHovering, setIsHovering] = useState(false);

    if (isEmpty(track) === false && isEmpty(track.track) === false) {

        // console.log(track.track, "track.track");

        trackName = track.track.name;
        trackImage = track.track.album.images[0].url;
        trackArtists = track.track.artists;
        trackAlbumName = track.track.album.name;
        trackReleaseDate = convertDate(track.track.album.release_date);
        trackDuration = millisecondsToMinutesAndSeconds(track.track.duration_ms);

    } else {

        // console.log(track, "track");

        trackName = track.name;
        trackImage = track.album.images[0].url;
        trackArtists = track.artists;
        trackAlbumName = track.album.name;
        trackReleaseDate = convertDate(track.album.release_date);
        trackDuration = millisecondsToMinutesAndSeconds(track.duration_ms);

    };


    return (
        <div className="songRow" onMouseOver={(event) => { setIsHovering(true) }} onMouseOut={(event) => { setIsHovering(false) }} onClick={() => playSong(track)}>

            <div className="songRow__info">

                <div className="songRow__number">
                    {isHovering === true ? <PlayArrowRoundedIcon /> : trackNumber}
                </div>

                <div className="songRow__title">

                    <img className="songRow__album" src={trackImage} alt="Album Cover" />

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
