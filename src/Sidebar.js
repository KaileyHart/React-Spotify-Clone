import React from "react";
import "./Sidebar.css";
import SidebarNavOption from "./SidebarNavOption";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";
//import {getTokenFromUrl} from './spotify'

import WhiteSpotifyLogo from "./assets/images/Spotify_Logo_White.png";



// * Icons
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

function Sidebar() {

  // * Pulls the playlists from the "data layer"
  const [{ playlists }, dispatch] = useDataLayerValue();

  return (
    <div className="sidebar">
    
      <img src={WhiteSpotifyLogo} alt="Logo" />

      <SidebarNavOption option="Home" Icon={HomeIcon} />
      <SidebarNavOption option="Search" Icon={SearchIcon} />
      <SidebarNavOption option="Your Library" Icon={LibraryMusicIcon} />

      <br />
      <strong className="sidebar__title">YOUR PLAYLISTS</strong>
      <hr />

      {isEmpty(playlists) === false && isEmpty(playlists.items) === false ?

          playlists.items.map((playlist, index) => ( <SidebarNavOption key={index} option={playlist.name} />))

        : null}
      
    </div>
  );
}

export default Sidebar;
