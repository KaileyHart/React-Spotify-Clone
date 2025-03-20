import React from "react";
import Header from "./Header";
import SongRow from "./SongRow";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";
import PlayCircleIcon from "@mui/icons-material/PlayCircleFilled";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PauseCircleIcon from "@mui/icons-material/PauseCircleFilledOutlined";

// ! This isn't being used. 

function Playlist({ spotify, playlist }) {

  // * Pulls discover weekly playlist info from data layer -> reducer.js
  const [{ playing, top_tracks, playback_state }, dispatch] = useDataLayerValue();
  // console.log("playback_state",playback_state)

  // const playPlaylist = (id) => {

  //   spotify
  //     .play({
  //       context_uri: `spotify:playlist:37i9dQZEVXcRhI3EF1Nhfw`,
  //     })
  //     .then((res) => {

  //       spotify.getMyCurrentPlayingTrack().then((r) => {

  //         dispatch({
  //           type: "SET_ITEM",
  //           item: r.item,
  //         });

  //         dispatch({
  //           type: "SET_PLAYING",
  //           playing: true,
  //         });

  //       });

  //     });
  // };

  // * Play and Pause Toggles
  const handlePlayPause = () => {
    // console.log("playback_state",playback_state)

    if (playing === trye) {

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


  const playSong = (id) => {

    spotify
      .play({
        uris: [`spotify:track:${id}`],
      })
      .then((res) => {

        // spotify.getMyCurrentPlayingTrack().then((r) => {

        //   dispatch({
        //     type: "SET_ITEM",
        //     item: r.item,
        //   });

        //   // console.log("item", item)

        //   dispatch({
        //     type: "SET_PLAYING",
        //     playing: true,
        //   });

        // });

      });

  };


  return (
    <div className="body">

      <Header spotify={spotify} />

      <div className="body__info">

        {/* Pulls the first album image in the list*/}
        {isEmpty(top_tracks) === false && isEmpty(top_tracks.items[0].album.images[0].url) === false ? <img src={top_tracks.items[0].album.images[0].url} alt="Album" /> : null}

        <div className="body__infoText">
          <h2>Playlist Title</h2>
          {/* <p>{isEmpty(discover_weekly) === false && isEmpty(discover_weekly.description) === false  ? discover_weekly.description : null}</p> */}
          <p>Your top tracks from the past year.</p>
        </div>
      </div>

      <div className="body__songs">

        <div className="body__icons">

          {playing === true ? (<PauseCircleIcon onClick={handlePlayPause} fontSize="large" className="body__shuffle" />) : (<PlayCircleIcon onClick={playPlaylist} fontSize="large" className="body__shuffle" />)}

          <FavoriteIcon fontSize="large" className="body__favorite" />
          <MoreHorizIcon className="body__more" />

        </div>

        {isEmpty(top_tracks) === false && isEmpty(top_tracks.items) === false && isEmpty(top_tracks.items) === false ?

          top_tracks.items.map((item, index) => (
            <SongRow key={index} playSong={playSong} track={item} />
          ))

          : null}

      </div>

    </div>
  );
}

export default Playlist;
