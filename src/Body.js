import React, {useEffect, useState} from "react";
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
  const [{user, playlist, playlists, playing, top_tracks }, dispatch] = useDataLayerValue();
  console.log("playlists", playlists);
  const [currentPlaylist, setCurrentPlaylist] = useState({});

  const [playlistAlbumURL, setPlaylistAlbumURL] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  const [playlistItems, setPlaylistItems] = useState([]);


  useEffect(() => {

    if (isEmpty(top_tracks)=== false ) {  

      setCurrentPlaylist({...top_tracks});
      setPlaylistTitle("Your Top Tracks");
      setPlaylistDescription("Your Top Tracks");

      if (isEmpty(top_tracks.items) === false) {

        setPlaylistItems(top_tracks.items);

        if (isEmpty(top_tracks.items[0]) === false) {

          setPlaylistAlbumURL(top_tracks.items[0].album.images[0].url);
  
        };

        // track URL
        // track name
        // track artists
        // track album name

      };

    };


    if (isEmpty(playlist)=== false) {  

      setCurrentPlaylist({...playlist});
      setPlaylistDescription("");

      console.log("playlist", playlist);

      if (isEmpty(playlist.name)=== false) {  

        setPlaylistTitle(playlist.name);

      };

      if (isEmpty(playlist.tracks)=== false && isEmpty(playlist.tracks.items)=== false) {  
        setPlaylistItems(playlist.tracks.items);
        console.log("playlistItems", playlistItems);
      };

      if (isEmpty(playlist.images)=== false && isEmpty(playlist.images[0]) === false && isEmpty(playlist.images[0].url) === false) {  

        setPlaylistAlbumURL(playlist.images[0].url);

      };

    };

  }, [playlist, top_tracks, dispatch]);


  const playPlaylist = (id) => {

    spotify
      .play({
        context_uri: `spotify:playlist:37i9dQZEVXcRhI3EF1Nhfw`,
      })
      .then((res) => {
        
        spotify.getMyCurrentPlayingTrack().then((r) => {

          dispatch({
            type: "SET_ITEM",
            item: r.item,
          });

          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });

        });

      });
  };

  // * Play and Pause Toggles
  const handlePlayPause = () => {

    if (playing) {

      spotify.pause();

      dispatch({
        type: "SET_PLAYING",
        playing: false,
      });

    } else {

      spotify.play();

      dispatch({
        type: "SET_PLAYING",
        playing: true,
      });

    };

  };


  const playSong = (id) => {

    spotify
      .play({
        uris: [`spotify:track:${id}`],
      })
      .then((res) => {

        spotify.getMyCurrentPlayingTrack().then((r) => {

          dispatch({
            type: "SET_ITEM",
            item: r.item,
          });

          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });

        });

      });

  };


  return (
    <div className="body">

      <Header spotify={spotify} />

      <div className="body__info">

        {/* // * Pulls the first album image in the list*/}
        {isEmpty(playlistAlbumURL) === false ? <img src={playlistAlbumURL} alt="Album" /> : null}

        <div className="body__infoText">

        {isEmpty(playlistTitle) === false?  <h1>{playlistTitle}</h1> : null}
        {isEmpty(playlistItems) === false? <p>{playlistItems.length} Songs</p> : null}
        {isEmpty(playlistDescription) === false? <p>{playlistDescription}</p> : null}

        </div>
      </div>

      <div className="body__songs">

        <div className="body__icons">

          {playing === true ? ( <PauseCircleIcon onClick={handlePlayPause} fontSize="large" className="body__shuffle"/>) : ( <PlayCircleIcon onClick={playPlaylist} fontSize="large" className="body__shuffle"/>)}

          <FavoriteIcon fontSize="large" className="body__favorite" />
          <MoreHorizIcon className="body__more" />

        </div>

        <div className="body__table_info">
          <p className="body__table_number">#</p>
          <p className="body__table_title">Title</p>
          <p className="body__table_album">Album</p>
          <p className="body__table_date_added">Date Added</p>
          <p className="body__table_duration">Duration</p>
        </div>
        <hr className="body__table_hr"></hr>
        

        {isEmpty(playlistItems) === false ? 
              playlistItems.map((item, index) => (
            <SongRow key={index} playSong={playSong} track={item} trackNumber={index} />
          )) 
        : null} 

      </div>

    </div>
  );
}

export default Body;
