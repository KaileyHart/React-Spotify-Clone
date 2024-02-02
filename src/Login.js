import React from 'react';
import { loginUrl } from './spotify';
import WhiteSpotifyLogo from "./assets/images/Spotify_Logo_White.png";

function Login() {

    return (
        <div className="login">

            <img src={WhiteSpotifyLogo} alt="White Spotify Logo"/>
            
            <a href={loginUrl}>LOGIN WITH SPOTIFY</a>
           
        </div>
    );
};

export default Login;