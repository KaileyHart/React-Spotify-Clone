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
      // setPlaylistDescription("Your Top Tracks");

      if (isEmpty(top_tracks.items) === false) {

        setPlaylistItems(top_tracks.items);

        if (isEmpty(top_tracks.items[0]) === false && isEmpty(top_tracks.items[0].url) === false) {

          setPlaylistAlbumURL(top_tracks.items[0].album.images[0].url);

        };

      };

    };

    if (isEmpty(playlist) === false) {

      setPlaylistDescription("");

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

    };

  }, [playlist, top_tracks]);

  // useEffect(() => {

  //   console.log("playing", playing);

  //   if (playing === true) {

  //     spotify.getMyCurrentPlayingTrack().then((response) => {
  //       console.log("plau 2", response)
  //       dispatch({
  //         type: 'SET_CURRENTLY_PLAYING',
  //         currently_playing: response,
  //       })

  //       dispatch({
  //         type: 'SET_ITEM',
  //         item: response.item,
  //       })



  //     })
  //   }

  // }, [playing])


  const playPlaylist = (playing, id) => {

    if (isEmpty(playing) === false && playing === true) {
      console.log("pause")
      spotify.pause()
        .then(() => {

          dispatch({
            type: "SET_PLAYING",
            playing: false,
          });

          // spotify.getMyCurrentPlayingTrack()
          //   .then((response) => {

          // dispatch({
          //   type: 'SET_CURRENTLY_PLAYING',
          //   currently_playing: response,
          // })

          // dispatch({
          //   type: 'SET_ITEM',
          //   item: response.item,
          // })

          // dispatch({
          //   type: "SET_PLAYING",
          //   playing: false,
          // });

          // })

        });

    } else {
      console.log("plau")

      // spotify.getMyCurrentPlayingTrack().then((response) => {
      //   console.log("plau 2", response)
      //   dispatch({
      //     type: 'SET_CURRENTLY_PLAYING',
      //     currently_playing: response,
      //   })

      //   dispatch({
      //     type: 'SET_ITEM',
      //     item: response.item,
      //   })

      //   dispatch({
      //     type: "SET_PLAYING",
      //     playing: true,
      //   });

      // })


      spotify.play({ context_uri: `spotify:playlist:${id}` })
        .then(() => {

          spotify.getMyCurrentPlayingTrack().then((response) => {
            console.log("plau 2", response)
            dispatch({
              type: 'SET_CURRENTLY_PLAYING',
              currently_playing: response,
            })

            dispatch({
              type: 'SET_ITEM',
              item: response.item,
            })
            dispatch({
              type: "SET_PLAYING",
              playing: true,
            });


          })

        });

    };

  };


  const playSong = (track) => {

    if (isEmpty(track) === false) {

      if (isEmpty(track.id) === false) {

        spotify.play({ uris: [`spotify:track:${track.id}`] })
          .then(() => {

            dispatch({
              type: "SET_ITEM",
              item: track,
            });

            dispatch({
              type: "SET_PLAYING",
              playing: true,
            });

          });

      } else if (isEmpty(track.track) === false && isEmpty(track.track.id) === false) {

        spotify.play({ uris: [`spotify:track:${track.track.id}`] })
          .then(() => {

            dispatch({
              type: "SET_ITEM",
              item: track.track,
            });

            dispatch({
              type: "SET_PLAYING",
              playing: true,
            });

          });

      };

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
            <SongRow key={index} playSong={() => playSong(item)} isPlaying={playing} track={item} trackNumber={index}
            />
          ))
          : null}

      </div>

    </div>
  );
}

export default Body;