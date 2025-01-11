import { isEmpty } from "../utilities";

// * Lets Spotify API take care of authentication
const authorizationEndpoint = "https://accounts.spotify.com/authorize";

// * Redirects user to the app
const redirectUrl = 'http://localhost:8080/';

const tokenEndpoint = "https://accounts.spotify.com/api/token";

const scope = 'user-read-private user-read-email user-read-currently-playing user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state';

// TODO: Needs to be changed to production URL when live
// TODO: May need to change in developer dashboard too: https://developer.spotify.com/

// * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow


// * Spotify API Client ID
const clientId = "885c089497a2421baae5d293348f5d42";

// * Extracts the user token/hash from the url
// export const getTokenFromUrl = () => {

//   return window.location.hash
//     .substring(1)
//     .split("&")
//     .reduce((initial, item) => {
//       // * #accessToken=1234567890&name=kailey
//       let parts = item.split("=");
//       initial[parts[0]] = decodeURIComponent(parts[1]);

//       return initial;
//     }, {});
// };


// * Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  
  get access_token() { return localStorage.getItem('access_token') || null; },
  get refresh_token() { return localStorage.getItem('refresh_token') || null; },
  get expires_in() { return localStorage.getItem('refresh_in') || null },
  get expires() { return localStorage.getItem('expires') || null },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    localStorage.setItem('expires', expiry);
  }

};

// * On page load, try to fetch auth code from current browser search URL
const args = new URLSearchParams(window.location.search);
const code = args.get('code');

// * Soptify API Calls
const getToken = async (code) => {

  const code_verifier = localStorage.getItem('code_verifier');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier,
    }),
  });

  return await response.json();
};


// * If we find a code, we're in a callback, do a token exchange
if (code) {

  const token = await getToken(code);
  currentToken.save(token);

  // * Remove code from URL so we can refresh correctly.
  const url = new URL(window.location.href);
  url.searchParams.delete("code");

  const updatedUrl = url.search ? url.href : url.href.replace('?', '');
  window.history.replaceState({}, document.title, updatedUrl);

};


export const redirectToSpotifyAuthorize = async () => {

  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest('SHA-256', data);

  const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  window.localStorage.setItem('code_verifier', code_verifier);

  const authUrl = new URL(authorizationEndpoint);

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();

  // * Redirect the user to the authorization server for login
  window.location.href = authUrl.toString(); 

};


export const refreshToken = async () => {

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: currentToken.refresh_token
    }),
  });

  // console.log(response.json());
  console.log("response", response);

  return await response;

};


export const getRefreshToken = async () => {

  // * Refresh token that has been previously stored
  const refreshToken = localStorage.getItem('refresh_token');
  const url = "https://accounts.spotify.com/api/token";

   const payload = {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     body: new URLSearchParams({
       grant_type: 'refresh_token',
       refresh_token: refreshToken,
       client_id: clientId
     }),
   };

   const body = await fetch(url, payload);
   const response = await body.json();

   localStorage.setItem('access_token', response.accessToken);

   if (isEmpty(response.refreshToken) === false) {

     localStorage.setItem('refresh_token', response.refreshToken);
     console.log("refresh_token", response.refreshToken);

   } else {

    logoutClick();
    console.log("logoutClick()");

   };

 };


const getUserData = async () => {

  const response = await fetch("https://api.spotify.com/v1/me", {

    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token },

  });

  return await response;

};


// * Click handlers
const loginWithSpotifyClick = async () => {

  await redirectToSpotifyAuthorize();

};


const logoutClick = async () => {

  localStorage.clear();

  window.location.href = redirectUrl;

};


const refreshTokenClick = async () => {

  const token = await refreshToken();

  currentToken.save(token);

};
