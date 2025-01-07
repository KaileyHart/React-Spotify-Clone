import React from "react";
import "./Sidebar.css";
import SidebarNavOption from "./SidebarNavOption";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";

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

      {/* <SidebarNavOption option="Home" Icon={HomeIcon} /> */}
     
      <SidebarNavOption option="Your Library" Icon={LibraryMusicIcon} />

      {/* // TODO: Add pill buttons for "Playlists", "Albums", "Podcasts & Shows", "Audiobooks" */}

      {/* <SidebarNavOption option="Search" Icon={SearchIcon} /> */}

      <br />
      <strong className="sidebar__title">YOUR PLAYLISTS</strong>
      <hr />

      
      {isEmpty(playlists) === false && isEmpty(playlists.items) === false ?

          playlists.items.map((playlist, index) => (
          <SidebarNavOption key={index} option={playlist.name} image={playlist.images[2].url} playlistID={playlist.id} />
          ))

        : null}

        
      
    </div>
  );
}

export default Sidebar;
