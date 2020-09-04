import React from 'react';
import './Login.css';
import { loginUrl } from './spotify';



function Login() {
    return (
        <div className="login">
            <img src={require('./assets/images/Spotify_Logo_White.png')} alt="logo"/>
            
            
            <a href={loginUrl}>LOGIN WITH SPOTIFY</a>
           
           
        </div>
    )
}

export default Login;