import React, { useState, useEffect } from "react";
import "./SidebarNavOption.css";
import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";

const spotify = new SpotifyWebApi();

function SidebarNavOption({ option, Icon, image, playlistID }) {
  const redirectUri = "http://localhost:8080/";

  const [dispatch] = useDataLayerValue();
  const [currentPlaylist, setCurrentPlaylist] = useState("");

  {
    /* // TODO: Add a link around each playlist to show the playlist items in the body page */
  }

  useEffect(() => {

    if (isEmpty(currentPlaylist)=== false) {  

      spotify.getPlaylist(playlistID).then((response) => {

        dispatch({
          type: "SET_PLAYLIST",
          playlist: response,
        });

      });

    };

  }, [currentPlaylist, dispatch]);

  return (
    <a onClick={() => setCurrentPlaylist(playlistID)}>
      <div className="sidebarNavOption">
        {Icon && <Icon className="sidebarNavOption__icon" />}
        {image ? (
          <img src={image} className="sidebarNavOption__albumCover" />
        ) : null}
        {Icon ? <h4>{option}</h4> : <p>{option}</p>}
      </div>
    </a>
  );

  // return (
  //   <div className="sidebarNavOption">
  //     {Icon && <Icon className="sidebarNavOption__icon" />}
  //     {image ? <img src={image} className="sidebarNavOption__albumCover"/> : null}
  //     {Icon ? <h4>{option}</h4> : <p>{option}</p>}
  //   </div>
  // );
}

export default SidebarNavOption;
