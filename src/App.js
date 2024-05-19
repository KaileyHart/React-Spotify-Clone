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
  const [discoverWeeklyData, setDiscoverWeeklyData] = useState("");

  let discoverWeeklyPlaylistID = "";
  
  const findDiscoverWeeklyPlaylist = (token) => {

    if (isEmpty(token) === false) {

      // Make a GET request to a public API endpoint
      fetch('https://api.spotify.com/v1/search?q=discoverweekly&type=playlist&limit=1', { 
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        })
      })
      .then(response => response.json())  // Parse the JSON response
      .then(data => {
        console.log('Discover Weekly data:', data);
        // TODO: Check if empty

        console.log(data.playlists.items[0].id)
        setDiscoverWeeklyData(data.playlists.items[0].id);
        discoverWeeklyPlaylistID = data.playlists.items[0].id;
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

      return discoverWeeklyData;

    };

  };

 
  useEffect(() => {

    

    const hash = getTokenFromUrl();

    // * Reset window
    window.location.hash = "";

    const _token = hash.access_token;
    findDiscoverWeeklyPlaylist(_token);

    if (isEmpty(_token) === false) {

      spotify.setAccessToken(_token);
  
     
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      // * gets the user acct
      spotify.getMe().then((user) => {

        console.log("user", user);

        dispatch({
          type: "SET_USER",
          user: user,
        });

      });

      // * gets the user playlists
      spotify.getUserPlaylists().then((playlists) => {

        console.log("playlists", playlists)

        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });

      });

      // * Use search endpoint. 
      console.log('DiscoverWeekly:', discoverWeeklyData)
      // * gets the discover weekly playlist
      // if (isEmpty(discoverWeeklyData) === false) {

      //   console.log(discoverWeeklyData)

        spotify.getPlaylist(`${discoverWeeklyPlaylistID}`).then((response) => {
          // 37i9dQZEVXcSajJeVOTSSu
          dispatch({
            type: "SET_DISCOVER_WEEKLY",
            discover_weekly: response,
          });

        });
      // };

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

    }

  }, [token, dispatch, discoverWeeklyData]);

  return (
    <div className="app">
      {token ? <Dashboard spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
