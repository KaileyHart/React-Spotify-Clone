import React, { useState, useEffect } from "react";
import "./SidebarNavOption.css";
import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";

const spotify = new SpotifyWebApi();

function SidebarNavOption({ option, Icon, image, playlistID }) {
  const redirectUri = "http://localhost:8080/";

  const [{ token }, dispatch] = useDataLayerValue();

  const [currentPlaylistID, setCurrentPlaylistID] = useState("");

    let access_token = localStorage.getItem('access_token');
   
    useEffect(() => {
  
      if (isEmpty(access_token) === false) {
  
        spotify.setAccessToken(access_token);
       
        dispatch({
          type: "SET_TOKEN",
          token: access_token,
        });

        // * gets spotify 
        dispatch({
          type: 'SET_SPOTIFY',
          spotify: spotify,
        });
  
      };

      if (isEmpty(currentPlaylistID) === false) {  
  
        spotify.getPlaylist(playlistID).then((response) => {
  
          console.log("response", response);
  
          dispatch({
            type: "SET_PLAYLIST",
            playlist: response,
          });
  
        });
  
      };
  
    }, [token, currentPlaylistID, dispatch]);

  {
    /* // TODO: Add a link around each playlist to show the playlist items in the body page */
  }

  return (
    <a onClick={() => setCurrentPlaylistID(playlistID)}>
      <div className="sidebarNavOption">
        {Icon && <Icon className="sidebarNavOption__icon" />}
        {image ? (
          <img src={image} className="sidebarNavOption__albumCover" />
        ) : null}
        {Icon ? <h4>{option}</h4> : <p>{option}</p>}
      </div>
    </a>
  );

}

export default SidebarNavOption;
