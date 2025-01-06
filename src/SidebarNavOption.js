import React from "react";
import "./SidebarNavOption.css";

function SidebarNavOption({ option, Icon, image, playlistID }) {

    // const redirectUri = "http://localhost:3000/";

  {/* // TODO: Add a link around each playlist to show the playlist items in the body page */}
  { /* return (
    <a href={`${redirectUri}v1/playlists/${playlistID}`}>
    <div className="sidebarNavOption">
      {Icon && <Icon className="sidebarNavOption__icon" />}
      {image ? <img src={image} className="sidebarNavOption__albumCover"/> : null}
      {Icon ? <h4>{option}</h4> : <p>{option}</p>}
    </div></a>
  ); */}

  return (
    <div className="sidebarNavOption">
      {Icon && <Icon className="sidebarNavOption__icon" />}
      {image ? <img src={image} className="sidebarNavOption__albumCover"/> : null}
      {Icon ? <h4>{option}</h4> : <p>{option}</p>}
    </div>
  );
}

export default SidebarNavOption;