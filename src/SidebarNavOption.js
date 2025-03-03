import React, { useState, useEffect } from "react";
import "./SidebarNavOption.css";
import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

const spotify = new SpotifyWebApi();

function SidebarNavOption({ option, Icon, image, playlistID }) {

    const [{ token }, dispatch] = useDataLayerValue();

    const [currentPlaylistID, setCurrentPlaylistID] = useState("");

    const [isHovering, setIsHovering] = useState(false);

    let access_token = localStorage.getItem("access_token");

    useEffect(() => {

        if (isEmpty(access_token) === false) {

            spotify.setAccessToken(access_token);

            dispatch({
                type: "SET_TOKEN",
                token: access_token,
            });

            // * gets spotify
            dispatch({
                type: "SET_SPOTIFY",
                spotify: spotify,
            });

        }

        if (isEmpty(currentPlaylistID) === false) {

            spotify.getPlaylist(playlistID).then((response) => {

                dispatch({
                    type: "SET_PLAYLIST",
                    playlist: response,
                });

            });

        };

    }, [token, currentPlaylistID, dispatch]);


    return (
        <a onClick={() => setCurrentPlaylistID(playlistID)} onMouseOver={(event) => { setIsHovering(true); }} onMouseOut={(event) => { setIsHovering(false); }}>

            <div className="sidebarNavOption">

                {isEmpty(Icon) === false && <Icon className="sidebarNavOption__icon" />}

                {isEmpty(image) === false ? (

                    <div>

                        {isHovering === false ?
                            <img src={image} className="sidebarNavOption__albumCover" />
                            :
                            <div>
                                <PlayArrowRoundedIcon className="sidebarNavOption__playOverlay" />
                                <img src={image} className="sidebarNavOption__albumCover" />
                            </div>
                        }

                    </div>

                ) : null}

                {Icon ? <h4>{option}</h4> : <p>{option}</p>}

            </div>

        </a>

    );
}

export default SidebarNavOption;
