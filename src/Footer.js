import React, { useEffect, useState } from "react";
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
  const [{ token, item, playing }, dispatch] = useDataLayerValue();
  const [albumCover, setAlbumCover] = useState("");
  const [albumName, setAlbumName] = useState("");


  // TODO: item is null
  useEffect(() => {

    

    if (isEmpty(item) === false) {

      if (isEmpty(item.album) === false && isEmpty(item.album.images[0]) === false && isEmpty(item.album.images[0].url) === false) {

        setAlbumCover(item.album.images[0].url);

      };

      if (isEmpty(item.name) === false) {

        setAlbumName(item.name);

      };

    };

  }, [item]);


  useEffect(() => {
    
    spotify.getMyCurrentPlaybackState().then((response) => {

      dispatch({
        type: "SET_PLAYING",
        playing: response.is_playing,
      });

      dispatch({
        type: "SET_ITEM",
        item: response.item,
      });

    });

  }, [spotify]);


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


  const skipNext = () => {

    spotify.skipToNext();

    spotify.getMyCurrentPlayingTrack().then((response) => {

      dispatch({
        type: "SET_ITEM",
        item: response.item,
      });

      dispatch({
        type: "SET_PLAYING",
        playing: true,
      });

    });

  };


  const skipPrevious = () => {

    spotify.skipToPrevious();

    spotify.getMyCurrentPlayingTrack().then((response) => {

      dispatch({
        type: "SET_ITEM",
        item: response.item,
      });

      dispatch({
        type: "SET_PLAYING",
        playing: true,
      });

    });

  };


  return (
    <div className="footer">

      <div className="footer__left">

        {/* // TODO: item is null */}
        {/* <img className="footer__albumCover" src={albumCover} alt={albumName} /> */}

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

        <SkipPreviousIcon className="footer__icon" onClick={skipNext}/>

        {playing === true ? 
          (<PauseCircleOutlineIcon onClick={handlePlayPause} fontSize="large" className="footer__icon"/>) 
          : 
          (<PlayCircleOutlineIcon onClick={handlePlayPause} fontSize="large" className="footer__icon"/>)}

        <SkipNextIcon className="footer__icon" onClick={skipPrevious}/>

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
