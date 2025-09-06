import React, { useEffect, useState } from "react";
import Header from "./Header";
import SongRow from "./SongRow";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";
import PlayCircleIcon from "@mui/icons-material/PlayCircleFilled";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PauseCircleIcon from "@mui/icons-material/PauseCircleFilledOutlined";

function Body({ spotify }) {

  // * Pulls discover weekly playlist info from data layer -> reducer.js
  const [{ playlist, playing, top_tracks }, dispatch] = useDataLayerValue();

  const [currentPlaylistID, setCurrentPlaylistID] = useState("");

  const [playlistAlbumURL, setPlaylistAlbumURL] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  const [playlistItems, setPlaylistItems] = useState([]);

  useEffect(() => {

    if (isEmpty(top_tracks) === false) {

      setPlaylistTitle("Your Top Tracks");
      setPlaylistDescription("Your most played tracks from the past year");
      setCurrentPlaylistID("user-top-tracks");

      if (isEmpty(top_tracks.items) === false) {

        setPlaylistItems(top_tracks.items);

        if (isEmpty(top_tracks.items[0]) === false && isEmpty(top_tracks.items[0].album) === false && isEmpty(top_tracks.items[0].album.images) === false && isEmpty(top_tracks.items[0].album.images[0]) === false) {
          setPlaylistAlbumURL(top_tracks.items[0].album.images[0].url);
        }
      }

      // * Create a playlist-like context for top tracks. Generates a unique URI for top tracks context.
      const topTracksPlaylistContext = {
        id: "user-top-tracks",
        name: "Your Top Tracks",
        description: "Your most played tracks from the past year",
        type: "user-top-tracks",
        tracks: {
          items: top_tracks.items || [],
          total: top_tracks.items?.length || 0
        },
        uri: "spotify:user:top-tracks",
        images: top_tracks.items?.[0]?.album?.images || [],
        owner: {
          display_name: "Spotify"
        },
        external_urls: {
          spotify: "https://open.spotify.com/collection/tracks"
        }
      };

      // * Dispatch the top tracks as a playlist context
      dispatch({
        type: "SET_PLAYLIST",
        playlist: topTracksPlaylistContext,
      });
    };

    if (isEmpty(playlist) === false) {

      setPlaylistDescription(playlist.description || "");

      if (isEmpty(playlist.id) === false) {

        setCurrentPlaylistID(playlist.id);

      };

      if (isEmpty(playlist.name) === false) {

        setPlaylistTitle(playlist.name);

      };

      if (isEmpty(playlist.tracks) === false && isEmpty(playlist.tracks.items) === false) {

        setPlaylistItems(playlist.tracks.items);

      };

      if (isEmpty(playlist.images) === false && isEmpty(playlist.images[0]) === false && isEmpty(playlist.images[0].url) === false) {

        setPlaylistAlbumURL(playlist.images[0].url);

      };

      // * Ensure regular playlist context is available
      dispatch({
        type: "SET_PLAYLIST",
        playlist: playlist,
      });

    };

    // TODO: Review putting the dispatch here. It could run into performance issues later. 
  }, [playlist, top_tracks, dispatch]);


  const playPlaylist = (playing, id) => {

    if (isEmpty(playing) === false && playing === true) {
      // console.log("pause");
      spotify.pause()
        .then(() => {

          dispatch({
            type: "SET_PLAYING",
            playing: false,
          });

        });

    } else {

      // * Handle the special case of Top Tracks (no real playlist URI)
      if (id === "user-top-tracks" || (isEmpty(playlist) && !isEmpty(top_tracks))) {

        playTopTracksCollection();

      } else {
        // * Use the full playlist URI if available, otherwise construct from ID
        const playlistUri = playlist?.uri || `spotify:playlist:${id}`;

        spotify.play({ context_uri: playlistUri })
          .then(() => {
            // ? Delay to ensure the playlist is loaded?
            setTimeout(() => updatePlaylistPlaybackState(), 500);

          })
          .catch((error) => {
            // console.log("Error playing full playlist:", error);
            // * Fallback to track collection if playlist URI fails
            if (!isEmpty(playlistItems)) {

              playTrackCollection();

            };

          });

      };

    };

  };


  const playTopTracksCollection = () => {

    if (isEmpty(top_tracks) || isEmpty(top_tracks.items)) {

      return;

    };

    // * Create array of track URIs from top tracks
    const trackUris = top_tracks.items.map(item => {

      if (isEmpty(item.id) === false) {

        return `spotify:track:${item.id}`;

      };

      if (isEmpty(item.track) === false && isEmpty(item.track.id) === false) {

        return `spotify:track:${item.track.id}`;

      };

      return null;

    }).filter(uri => uri !== null);

    spotify.play({ uris: trackUris })
      .then(() => {

        // ? Delay to ensure the playlist is loaded?
        setTimeout(() => updatePlaylistPlaybackState(), 500);

      })
      .catch((error) => {

        console.log("Error playing top tracks collection:", error);

      });

  };


  const playTrackCollection = () => {

    if (isEmpty(playlistItems)) {

      return;

    };

    // * Create array of track URIs from playlist items
    const trackUris = playlistItems.map(item => {

      if (isEmpty(item.id) === false) {

        return `spotify:track:${item.id}`;

      };

      if (isEmpty(item.track) === false && isEmpty(item.track.id) === false) {

        return `spotify:track:${item.track.id}`;

      };

      return null;

    }).filter(uri => uri !== null);

    spotify.play({ uris: trackUris })
      .then(() => {

        // ? Delay to ensure the playlist is loaded?
        setTimeout(() => updatePlaylistPlaybackState(), 500);

      })
      .catch((error) => {

        console.log("Error playing track collection:", error);

      });

  };


  const updatePlaylistPlaybackState = () => {

    spotify.getMyCurrentPlayingTrack().then((response) => {
      if (response && response.item) {
        dispatch({
          type: 'SET_CURRENTLY_PLAYING',
          currently_playing: response,
        });

        dispatch({
          type: 'SET_ITEM',
          item: response.item,
        });

        dispatch({
          type: "SET_PLAYING",
          playing: true,
        });

        // * Ensure current playlist context is maintained in DataLayer
        let currentPlaylistContext = null;

        if (isEmpty(top_tracks) === false && (currentPlaylistID === "user-top-tracks" || isEmpty(playlist))) {

          // * Create top tracks context
          currentPlaylistContext = {
            id: "user-top-tracks",
            name: "Your Top Tracks",
            description: "Your most played tracks from the past year",
            type: "user-top-tracks",
            tracks: {
              items: top_tracks.items,
              total: top_tracks.items?.length || 0
            },
            uri: "spotify:user:top-tracks",
            images: top_tracks.items?.[0]?.album?.images || []
          };

        } else if (isEmpty(playlist) === false) {

          // * Use regular playlist context
          currentPlaylistContext = playlist;

        };

        if (currentPlaylistContext) {

          dispatch({
            type: "SET_PLAYLIST",
            playlist: currentPlaylistContext,
          });

        };

      };

    }).catch((error) => {

      console.log("Error updating playback state:", error);

    });

  };


  const playSong = (track, currentPlaylistContext = null) => {

    if (isEmpty(track) === false) {

      let trackToPlay = null;
      let trackUri = null;

      // * Get track information
      if (isEmpty(track.id) === false) {

        trackToPlay = track;
        trackUri = `spotify:track:${track.id}`;

      } else if (isEmpty(track.track) === false && isEmpty(track.track.id) === false) {

        trackToPlay = track.track;
        trackUri = `spotify:track:${track.track.id}`;

      };

      // * Play with playlist context if available
      if (isEmpty(playlist) === false && isEmpty(playlist.uri) === false && playlist.id !== "user-top-tracks") {

        spotify.play({
          context_uri: playlist.uri,
          offset: { uri: trackUri }
        })
          .then(() => {
            updatePlaybackState(trackToPlay);
          })
          .catch((error) => {
            playWithTrackCollection(trackToPlay, trackUri);
          });

      } else if (!isEmpty(playlistItems) && playlistItems.length > 1) {

        playWithTrackCollection(trackToPlay, trackUri);

      } else {

        playSingleTrack(trackToPlay, trackUri);

      };

    };

  };


  const playWithTrackCollection = (trackToPlay, selectedTrackUri) => {

    // * Create URIs array from current playlist items
    const trackUris = playlistItems.map(item => {

      if (isEmpty(item.id) === false) {

        return `spotify:track:${item.id}`;

      };

      if (isEmpty(item.track) === false && isEmpty(item.track.id) === false) {

        return `spotify:track:${item.track.id}`;

      };

      return null;

    }).filter(uri => uri !== null);

    spotify.play({
      uris: trackUris,
      offset: { uri: selectedTrackUri }
    })
      .then(() => {
        updatePlaybackState(trackToPlay);
      })
      .catch((error) => {

        playSingleTrack(trackToPlay, selectedTrackUri);

      });

  };

  const playSingleTrack = (trackToPlay, trackUri) => {

    spotify.play({ uris: [trackUri] })
      .then(() => {

        updatePlaybackState(trackToPlay);

      })
      .catch((error) => {

        console.log("Error playing single track:", error);

      });

  };

  const updatePlaybackState = (track) => {
    dispatch({
      type: "SET_ITEM",
      item: track,
    });

    dispatch({
      type: "SET_PLAYING",
      playing: true,
    });

    // *  Dispatch the  playlist context to make it available in Footer
    let contextToDispatch = null;

    if (currentPlaylistID === "user-top-tracks" || (isEmpty(top_tracks) === false && isEmpty(playlist) === true)) {

      // * Create top tracks context
      contextToDispatch = {
        id: "user-top-tracks",
        name: "Your Top Tracks",
        description: "Your most played tracks from the past year",
        type: "user-top-tracks",
        tracks: {
          items: top_tracks.items || [],
          total: top_tracks.items?.length || 0
        },
        uri: "spotify:user:top-tracks",
        images: top_tracks.items?.[0]?.album?.images || []
      };

    } else if (isEmpty(playlist) === false) {

      contextToDispatch = playlist;

    };

    if (contextToDispatch) {

      dispatch({
        type: "SET_PLAYLIST",
        playlist: contextToDispatch,
      });

    };

  };


  return (
    <div className="body">

      <Header spotify={spotify} />

      <div className="body__info">

        {isEmpty(playlistAlbumURL) === false ? (<img src={playlistAlbumURL} alt="Album" />) : null}

        <div className="body__infoText">

          {isEmpty(playlistTitle) === false ? <h1>{playlistTitle}</h1> : null}

          {isEmpty(playlistItems) === false ? (<p>{playlistItems.length} Songs</p>) : null}

          {isEmpty(playlistDescription) === false ? (<p>{playlistDescription}</p>) : null}

        </div>

      </div>

      <div className="body__songs">

        {isEmpty(currentPlaylistID) === false ?

          <div className="body__icons">

            {isEmpty(playing) === false && playing === true ? (
              <PauseCircleIcon onClick={() => playPlaylist(playing, currentPlaylistID)} fontSize="large" className="body__shuffle" />
            ) : (
              <PlayCircleIcon onClick={() => playPlaylist(playing, currentPlaylistID)} fontSize="large" className="body__shuffle" />
            )}

            <FavoriteIcon fontSize="large" className="body__favorite" />

            <MoreHorizIcon className="body__more" />

          </div>

          : null

        }

        <div className="body__table_info">
          <p className="body__table_number">#</p>
          <p className="body__table_title">Title</p>
          <p className="body__table_album">Album</p>
          <p className="body__table_date_released">Date Released</p>
          <p className="body__table_duration">Duration</p>
        </div>

        <hr className="body__table_hr"></hr>

        {isEmpty(playlistItems) === false
          ? playlistItems.map((item, index) => (
            <SongRow
              key={index}
              playSong={(track, playlistContext) => playSong(track, playlist)}
              isPlaying={playing}
              track={item}
              trackNumber={index}
              currentPlaylist={playlist || { id: currentPlaylistID, name: playlistTitle }}
            />
          ))
          : null}

      </div>

    </div>
  );
}

export default Body;