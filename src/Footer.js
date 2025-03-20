import React, { useEffect } from "react";
import { Grid, Slider } from "@mui/material";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";

// * Icons
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleFilledOutlined";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";

function Footer({ spotify }) {

    // * Pull song data from spotify
    const [{ item, playing, playback_state, currently_playing }, dispatch] = useDataLayerValue();

    const handlePlayPause = () => {

        if (playing === true) {

            spotify.pause().then(() => {
                dispatch({
                    type: "SET_PLAYING",
                    playing: false,
                });
            });

        } else {

            spotify.play().then(() => dispatch({
                type: "SET_PLAYING",
                playing: true,
            }));

        };

    };


    const skipToNextSong = () => {

        if (isEmpty(playback_state) === false && isEmpty(playback_state.device) === false && isEmpty(playback_state.device.id) === false) {
            // console.log("playback_state.device.id", playback_state.device.id)
            let deviceID = playback_state.device.id;
            // console.log("deviceID", deviceID)
            spotify.skipToNext({ "device_id": deviceID });
        };

    };

    const displayCurrentlyPlaying = () => {

        spotify.getMyCurrentPlayingTrack().then((response) => {
            console.log("playing", response)
        });

    }

    useEffect(() => {

        console.log("currently_playing", currently_playing)

    }, [currently_playing, dispatch]);


    return (
        <div className="footer">

            <div className="footer__left">

                {isEmpty(item) === false && isEmpty(item.name) === false && isEmpty(item.album) === false && isEmpty(item.album.images[0]) === false && isEmpty(item.album.images[0].url) === false ? <img className="footer__albumCover" src={item.album.images[0].url} alt={item.name} /> : null}

                {isEmpty(item) === false ?

                    (<div className="footer__songInfo">
                        <h4>{item.name}</h4>
                        <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
                    </div>)

                    :
                    (<div className="footer__songInfo">
                        <h4>No song is playing</h4>
                        <p>...</p>
                    </div>)}

            </div>

            <div className="footer__center">

                <ShuffleIcon className="footer__green" />

                <SkipPreviousIcon className="footer__icon" onClick={() => { isEmpty(item) === false ? spotify.skipToPrevious(item) : null }} />

                {isEmpty(playing) === false && playing === true ?
                    (<PauseCircleOutlineIcon onClick={handlePlayPause} fontSize="large" className="footer__icon" />)
                    :
                    (<PlayCircleOutlineIcon onClick={handlePlayPause} fontSize="large" className="footer__icon" />)}

                <SkipNextIcon className="footer__icon" onClick={() => skipToNextSong()} />

                <RepeatIcon className="footer__green" />

            </div>

            <div className="footer__right">

                <Grid container spacing={2}>

                    <Grid item>
                        <PlaylistPlayIcon />
                    </Grid>

                    <Grid item>
                        <VolumeDownIcon />
                    </Grid>

                    <Grid item xs>
                        <Slider aria-labelledby="continuous-slider" />
                    </Grid>

                </Grid>

            </div>

        </div>
    );
}

export default Footer;
