import React from "react";
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
    const [{ item, playing }, dispatch] = useDataLayerValue();

    // const [albumCover, setAlbumCover] = useState("");
    // const [albumName, setAlbumName] = useState("");

    // const [currentPlaybackState, setCurrentPlaybackState] = useState({});

    const handlePlayPause = () => {

        if (playing === true) {

            spotify.pause();

            dispatch({
                type: "SET_PLAYING",
                playing: false,
            });

        } else {

            spotify.play();

            dispatch({
                type: "SET_PLAYING",
                playing: true,
            });

        };

    };


    // TODO: The footer current playing track is one behind. 
    // const updatePreview = (currentPlaybackState) => {

    //   if (isEmpty(currentPlaybackState) === false) {

    //     console.log("currentPlaybackState", currentPlaybackState)

    //     if (isEmpty(currentPlaybackState.album) === false && isEmpty(currentPlaybackState.album.images[0]) === false && isEmpty(currentPlaybackState.album.images[0].url) === false) {

    //       setAlbumCover(currentPlaybackState.album.images[0].url);

    //     };

    //     if (isEmpty(currentPlaybackState.name) === false) {

    //       setAlbumName(currentPlaybackState.name);

    //     };

    //   };

    // };


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

                <SkipNextIcon className="footer__icon" onClick={() => spotify.skipToNext()} />

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
