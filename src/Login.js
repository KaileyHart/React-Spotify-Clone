import React from 'react';
import WhiteSpotifyLogo from "./assets/images/Spotify_Logo_White.png";

function Login({redirectToSpotifyAuthorize}) {

    return (
        <div className="login">

            <img src={WhiteSpotifyLogo} alt="White Spotify Logo"/>
            
            <a onClick={redirectToSpotifyAuthorize}>LOGIN WITH SPOTIFY</a>
            
        </div>
    );
};

export default Login;