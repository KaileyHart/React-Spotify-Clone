import React from "react";
import "./Sidebar.css";
import SidebarNavOption from "./SidebarNavOption";
import { useDataLayerValue } from "./DataLayer";
//import {getTokenFromUrl} from './spotify'

//Icons
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";


function Sidebar() {
    //pulls the playlists from the data layer
  const [{ playlists }, dispatch] = useDataLayerValue();

  return (
    <div className="sidebar">
      <img src={require("./assets/images/Spotify_Logo_White.png")} alt="Logo" />
      <SidebarNavOption option="Home" Icon={HomeIcon} />
      <SidebarNavOption option="Search" Icon={SearchIcon} />
      <SidebarNavOption option="Your Library" Icon={LibraryMusicIcon} />

      <br />
      <strong className="sidebar__title">YOUR PLAYLISTS</strong>
      <hr />

        {
            playlists?.items?.map((playlist) => ( <SidebarNavOption option={playlist.name} />))
        }
      
    </div>
  );
}

export default Sidebar;
