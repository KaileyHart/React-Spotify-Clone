import React from "react";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar } from "@mui/material";

function Header() {

  // * Pulls user data from Data Layer
  const [{ user }, dispatch] = useDataLayerValue();

  return (
    <div className="header">

      <div className="header__left">

        <SearchIcon />

        <input
          placeholder="Search for Artists, Songs, or Podcasts"
          type="text"
        />

      </div>

      <div className="header__right">

        <Avatar src={isEmpty(user) === false && isEmpty(user.images) === false && isEmpty(user.images[0].url) === false ? user.images[0].url : ""} alt={isEmpty(user) === false ? user.display_name : null} />

        <h4>{isEmpty(user) === false ? user.display_name : null}</h4>

      </div>

    </div>
  );
}

export default Header;
