// * Lets Spotify API take care of authentication
export const authEndpoint = "https://accounts.spotify.com/authorize";

// * Redirects user to the app
// TODO: Needs to be changed to production URL when live
// TODO: May need to change here too: https://developer.spotify.com/
const redirectUri = "http://localhost:3000/";

// * Spotify API Client ID
// TODO: Move clientID to ENV 
const clientId = "885c089497a2421baae5d293348f5d42";

//Makes the user agree to terms that we can read the following:
const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
];

// * Extracts the user token/hash from the url
export const getTokenFromUrl = () => {

  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      // * #accessToken=1234567890&name=kailey
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);

      console.log("item", item);
      console.log("initial", initial);

      return initial;
    }, {});

};

// * When user clicks "Login with Spotify", it takes them through Spotify user authentication, then redirects back to the app
export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
