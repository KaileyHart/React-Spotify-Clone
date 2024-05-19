import React, { useEffect } from "react";
import Header from "./Header";
import SongRow from "./SongRow";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";
import PlayCircleIcon from "@mui/icons-material/PlayCircleFilled";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PauseCircleIcon from "@mui/icons-material/PauseCircleFilledOutlined";

function Body({ spotify }) {

  // * Pulls discover weekly playlist info from data layer -> reducer.js
  const [{ discover_weekly, user, playing }, dispatch] = useDataLayerValue();

  const playPlaylist = (id) => {

    spotify
      .play({
        context_uri: `spotify:playlist:37i9dQZEVXcRhI3EF1Nhfw`,
      })
      .then((res) => {
        
        spotify.getMyCurrentPlayingTrack().then((r) => {

          dispatch({
            type: "SET_ITEM",
            item: r.item,
          });

          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });

        });

      });
  };


  // * Play and Pause Toggles
  const handlePlayPause = () => {

    if (isEmpty(playing) === false) {

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


  // * https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback
  const playSong = (id) => {

    console.log("id:", id);
    console.log("click", id);
    spotify
      .play({
        uris: [`spotify:track:${id}`],
      })
      .then((res) => {

        spotify.getMyCurrentPlayingTrack().then((r) => {

          dispatch({
            type: "SET_ITEM",
            item: r.item,
          });

          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });

        });

      });

  };


  return (
    <div className="body">

      <Header spotify={spotify} />

      <div className="body__info">

        {isEmpty(discover_weekly) === false && isEmpty(discover_weekly.images[0].url) === false ? <img src={discover_weekly.images[0].url} alt="Album" /> : null}

        <div className="body__infoText">
          <h2>
            <strong>PLAYLIST</strong>
          </h2>
           <h2>{isEmpty(discover_weekly) === false && isEmpty(discover_weekly.description) === false  ? discover_weekly.name : null}</h2>
          <p>{isEmpty(discover_weekly) === false && isEmpty(discover_weekly.description) === false  ? discover_weekly.description : null}</p>
        </div>
      </div>

      <div className="body__songs">

        <div className="body__icons">

          {playing === true ? ( <PauseCircleIcon onClick={handlePlayPause} fontSize="large" className="body__shuffle"/>) : ( <PlayCircleIcon onClick={playPlaylist} fontSize="large" className="body__shuffle"/>)}

          <FavoriteIcon fontSize="large" className="body__favorite" />
          <MoreHorizIcon className="body__more" />

        </div>

        {isEmpty(discover_weekly) === false && isEmpty(discover_weekly.tracks) === false && isEmpty(discover_weekly.tracks.items) === false ? 

          discover_weekly.tracks.items.map((item, index) => (

              <SongRow key={item.track.id} playSong={playSong} track={item.track} />

          )) 

        : null}

      </div>

    </div>
  );
}

export default Body;
