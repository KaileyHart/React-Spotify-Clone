import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getTokenFromUrl } from "./spotify";

// * Components
import Login from "./Login";
import Dashboard from "./Dashboard";
import { useDataLayerValue } from "./DataLayer";
import { MyLocation } from "@mui/icons-material";
import { isEmpty } from "../utilities";

// * https://github.com/JMPerez/spotify-web-api-js
// * Allows react to communicate with the Spotify API
const spotify = new SpotifyWebApi();

function App() {
  
  // * pull from DataLayer, and then update it
  const [{ token }, dispatch] = useDataLayerValue();
  // const [discoverWeeklyData, setDiscoverWeeklyData] = useState("");
  // const [playbackState, setPlaybackState] = useState({});

  // * Get Playback State https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
  // ? None of the other functions seems to work without this one first ? -- 06/10/2024
  const getUserPlaybackState = (token) => {

    if (isEmpty(token) === false) {

      // * Make a GET request to Spotify Player
      fetch('https://api.spotify.com/v1/me/player', { 
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        })
      })
      .then(response => response.json()) 
      .then(data => {
        // console.log('Playback state data:', data);

        // TODO: Set to initial state?

      })
      .catch(error => {

        console.error('Error fetching user data:', error);

      });

    };

  };


  const findDiscoverWeeklyPlaylist = (token) => {

    if (isEmpty(token) === false) {

      // * Make a GET request to Spotify Search API
      fetch('https://api.spotify.com/v1/search?q=discoverweekly&type=playlist&limit=1', { 
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        })
      })
      .then(response => response.json()) 
      .then(data => {
        // console.log('Discover Weekly data:', data);

       if(isEmpty(data) === false && isEmpty(data.playlists) === false && isEmpty(data.playlists.items[0]) === false && isEmpty(data.playlists.items[0].id) === false) {

        // console.log(data.playlists.items[0].id);

        // setDiscoverWeeklyData(data.playlists.items[0].id);

        spotify.getPlaylist(`${data.playlists.items[0].id}`).then((response) => {

          dispatch({
            type: "SET_DISCOVER_WEEKLY",
            discover_weekly: response,
          });

        });

       } else {

        // TODO: Send them to a default playlist
        // setDiscoverWeeklyData("");
        console.error("No discover weekly data");

       };

      })
      .catch(error => {

        console.error('Error fetching user data:', error);

      });

    };

  };

  
  useEffect(() => {

    const hash = getTokenFromUrl();

    // * Reset window
    // ! This breaks the application
    // window.location.hash = "";

    const _token = hash.access_token;

    if (isEmpty(_token) === false) {

      spotify.setAccessToken(_token);

      findDiscoverWeeklyPlaylist(_token);
      getUserPlaybackState(_token);
  
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      // * gets the user acct
      spotify.getMe().then((user) => {

        // console.log("user", user);

        dispatch({
          type: "SET_USER",
          user: user,
        });

      });

      // * gets the user playlists
      spotify.getUserPlaylists().then((playlists) => {

        // console.log("playlists", playlists)

        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });

      });

      // * gets top user top artists
      spotify.getMyTopArtists().then((response) => dispatch({
        type: 'SET_TOP_ARTISTS',
        top_artists: response,
      }));

      // * gets spotify 
      dispatch({
        type: 'SET_SPOTIFY',
        spotify: spotify,
      });

    };

  }, [token, dispatch]);


  return (
    <div className="app">
      {isEmpty(token) === false ? <Dashboard spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
