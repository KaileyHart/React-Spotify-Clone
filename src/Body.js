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
  const [{ discover_weekly, user, playing, token}, dispatch] = useDataLayerValue();


  const playPlaylist = (discover_weekly) => {
   
    spotify
      .play({
        context_uri: `${discover_weekly.uri}`,
      })
      .then((res) => {

    // console.log("res:", res);

        spotify.getMyCurrentPlayingTrack().then((r) => {

          // console.log("r", r);

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
  // const playSongOLD = (token, id) => {

  //   spotify
  //     .play({
  //       uris: [`spotify:track:${id}`],
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

  // TODO: This is throwing an error
  const playSong = (id) => {

    if (isEmpty(id) === false && isEmpty(token) === false) {

      // * Make a GET request to Spotify Search API
      fetch('https://api.spotify.com/v1/me/player/play', { 
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`,
         
        }),
        "data": JSON.stringify({
          uris: [`spotify:track:${id}`]
        })
      })
      .then(response => response.json()) 
      .then(data => {
        // console.log('data', data);

       // message: "Player command failed: Restriction violated"
       // reason: "UNKNOWN"
       // status: 403


       if(isEmpty(data) === false ) {

      
       } else {


       };

      })
      .catch(error => {

        console.error('Error fetching user data:', error);

      });

    };

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

          {playing === true ? ( <PauseCircleIcon onClick={handlePlayPause} fontSize="large" className="body__shuffle"/>) : ( <PlayCircleIcon onClick={() => playPlaylist(discover_weekly)} fontSize="large" className="body__shuffle"/>)}

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
