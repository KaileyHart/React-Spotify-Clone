import React, { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { redirectToSpotifyAuthorize, refreshToken, getRefreshToken } from "./spotify";
import { isEmpty } from "../utilities";

// * Components
import Login from "./Login";
import Dashboard from "./Dashboard";
import { useDataLayerValue } from "./DataLayer";

// * https://github.com/JMPerez/spotify-web-api-js
// * Allows react to communicate with the Spotify API
const spotify = new SpotifyWebApi();

function App() {

  // * pull from DataLayer, and then update it
  const [{ token }, dispatch] = useDataLayerValue();

  let access_token = localStorage.getItem('access_token');
  let expires = localStorage.getItem('expires');

  const checkAccessTokenExpiration = (expires) => {

    let today = new Date();
    let compareDate = new Date(expires);
    let timeInMilliseconds = compareDate.getTime() - today.getTime();

    return timeInMilliseconds;

  };
 
  useEffect(() => {

    if (isEmpty(access_token) === false) {

      spotify.setAccessToken(access_token);

      let time = checkAccessTokenExpiration(expires);

      console.log("time", time < 0);

      if (time < 0) {

        // refreshToken();
        getRefreshToken();

      };
     
      dispatch({
        type: "SET_TOKEN",
        token: access_token,
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

        // console.log("playlists", playlists);

        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });

      });

      // * gets top user top artists from the past 6 months
      spotify.getMyTopArtists().then((response) => dispatch({
        type: 'SET_TOP_ARTISTS',
        top_artists: response,
      }));

      // * gets top user top tracks from the past 6 months
      spotify.getMyTopTracks().then((response) => dispatch({
        type: 'SET_TOP_TRACKS',
        top_tracks: response,
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
      {access_token ? <Dashboard spotify={spotify}  /> : <Login redirectToSpotifyAuthorize={redirectToSpotifyAuthorize}/>}
    </div>
  );
}

export default App;
