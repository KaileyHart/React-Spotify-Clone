import React, { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getTokenFromUrl } from "./spotify";
import "./App.css";

//Components
import Login from "./Login";
import Dashboard from "./Dashboard";
import { useDataLayerValue } from "./DataLayer";

//Allows us/react to communicate with the Spotify API
const spotify = new SpotifyWebApi();

function App() {
  //to pull from DataLayer, and then update it
  const [{ token }, dispatch] = useDataLayerValue();

  //useEffect runs code based on a given condition
  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";

    const _token = hash.access_token;

    if (_token) {
      spotify.setAccessToken(_token);
     
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      //gets the user acct
      spotify.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          user: user,
        });
      });

      //gets the user playlists
      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });
      });

      //gets the discover weekly playlist
      spotify.getPlaylist("37i9dQZEVXcRhI3EF1Nhfw").then((response) => {
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        });
      });

      //gets top user top artists
      spotify.getMyTopArtists().then((response) => dispatch({
        type: 'SET_TOP_ARTISTS',
        top_artists: response,
      }));

      //gets spotify 
      dispatch({
        type: 'SET_SPOTIFY',
        spotify: spotify,
      })
    }
  }, [token, dispatch]);

  return (
    <div className="app">
      
      {token ? <Dashboard spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
