import React from "react";
import { Grid, Slider } from "@mui/material";
import { useDataLayerValue } from "./DataLayer";
import { isEmpty } from "../utilities";
import { safeSpotifyAPI } from "./SafeSpotifyAPI";

// * Icons
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleFilledOutlined";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";

function Footer({ spotify }) {

    // * Pull song data from spotify
    const [{ item, playing, playlist: currentPlaylist }, dispatch] = useDataLayerValue();


    const handlePlayPause = async () => {

        if (playing === true) {

            const result = await safeSpotifyAPI.pause();

            if (result.success === true) {

                dispatch({
                    type: "SET_PLAYING",
                    playing: false,
                });

            } else {

                // console.log('Error pausing:', result.error);
                alert('Unable to pause: ' + result.error);

            };

        } else {

            const result = await safeSpotifyAPI.play();

            if (result.success === true) {

                dispatch({
                    type: "SET_PLAYING",
                    playing: true,
                });

            } else {

                // console.log('Error playing:', result.error);
                alert('Unable to play: ' + result.error);

            };

        };

    };


    const refreshPlaybackState = async () => {

        const result = await safeSpotifyAPI.getCurrentPlaybackState();

        if (result.success === true && isEmpty(result.data) === false) {

            dispatch({
                type: 'SET_PLAYBACK_STATE',
                playback_state: result.data,
            });

            if (isEmpty(result.data.item) === false) {

                dispatch({
                    type: 'SET_ITEM',
                    item: result.data.item,
                });

            };

            dispatch({
                type: 'SET_PLAYING',
                playing: result.data.is_playing || false,
            });

        } else {

            console.log('Error getting playback state:', result.error || 'No data returned');

        };

    };


    const skipToNextSong = async () => {
        // console.log('skipToNextSong');

        // * Get fresh playback state first
        const currentState = await safeSpotifyAPI.getCurrentPlaybackState();

        const freshPlaybackState = currentState.data;;

        //* Check if there is a valid context (playlist/album)
        const hasValidContext = freshPlaybackState.context &&
            (freshPlaybackState.context.type === 'playlist' ||
                freshPlaybackState.context.type === 'album' ||
                freshPlaybackState.context.type === 'artist' ||
                freshPlaybackState.context.type === 'show' ||
                freshPlaybackState.context.uri);

        const hasPlaylistInState = currentPlaylist && (currentPlaylist.uri || currentPlaylist.id);

        let contextSource = [];

        if (isEmpty(hasValidContext) === false) {

            contextSource.push(`Spotify: ${freshPlaybackState.context?.type}`);

        };

        if (isEmpty(hasPlaylistInState) === false) {

            contextSource.push(`Body.js: ${currentPlaylist?.name || 'playlist'}`)
        };

        let deviceID = freshPlaybackState.device.id;

        let result = await safeSpotifyAPI.skipToNext();

        // TODO: Review if this is necessary
        if (result.success === false) {

            // * If that fails, try with device_id
            result = await safeSpotifyAPI.skipToNext(deviceID);

        };

        if (result.success === true) {

            // * This keeps the song/album cover in sync
            // * Wait a moment, then check if the song actually changed
            setTimeout(async () => {

                await verifySkipOperation(freshPlaybackState, 'next');

            }, 1200);

        } else {
            // console.log('result.error');
            alert('Unable to skip to next song: ' + result.error);

        };

    };


    const skipToPreviousSong = async () => {

        // * Get fresh playback state first
        const currentState = await safeSpotifyAPI.getCurrentPlaybackState();

        const freshPlaybackState = currentState.data;

        let deviceID = freshPlaybackState.device.id;

        // * Try using the safe API without device_id first
        let result = await safeSpotifyAPI.skipToPrevious();

        if (result.success === false) {

            // * If that fails, try with device_id
            result = await safeSpotifyAPI.skipToPrevious(deviceID);

        };

        if (result.success === true) {

            // * Wait a moment, then check if the song actually changed
            setTimeout(async () => {

                await verifySkipOperation(freshPlaybackState, 'previous');

            }, 1200);

        } else {

            alert('Unable to skip to previous song: ' + result.error);

        };

    };


    const verifySkipOperation = async (beforeState, direction = 'next') => {

        const afterSkipState = await safeSpotifyAPI.getCurrentPlaybackState();

        const beforeSong = beforeState.item;
        const afterSong = afterSkipState.data.item;

        if (afterSong?.id !== beforeSong?.id) {

            refreshPlaybackState();

            return;

        };

        // * Check repeat state
        const repeatState = afterSkipState.data.repeat_state;

        if (repeatState === 'track') {

            refreshPlaybackState();
            return;

        };

        // TODO: Review
        // * Still refresh to ensure UI is in sync
        refreshPlaybackState();

    };


    return (
        <div className="footer">

            <div className="footer__left">

                {isEmpty(item) === false && isEmpty(item.name) === false && isEmpty(item.album) === false && isEmpty(item.album.images) === false && isEmpty(item.album.images[0]) === false && isEmpty(item.album.images[0].url) === false ? (
                    <img
                        key={`${item.id}-${Date.now()}`}
                        className="footer__albumCover"
                        src={item.album.images[0].url}
                        alt={item.name}
                    />
                ) : null}

                {isEmpty(item) === false ? (
                    <div className="footer__songInfo" key={`song-info-${item.id}`}>
                        <h4>{item.name}</h4>
                        <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
                    </div>
                ) : (
                    <div className="footer__songInfo">
                        <h4>No song is playing</h4>
                        <p>...</p>
                    </div>
                )}

            </div>

            <div className="footer__center">

                <ShuffleIcon className="footer__green" />

                <SkipPreviousIcon className="footer__icon" onClick={() => skipToPreviousSong()} />

                {isEmpty(playing) === false && playing === true ?
                    (<PauseCircleOutlineIcon onClick={handlePlayPause} fontSize="large" className="footer__icon" />)
                    :
                    (<PlayCircleOutlineIcon onClick={handlePlayPause} fontSize="large" className="footer__icon" />)}

                <SkipNextIcon className="footer__icon" onClick={() => skipToNextSong()} />

                <RepeatIcon className="footer__green" />

            </div>

            <div className="footer__right">

                <Grid container spacing={2}>

                    <Grid item>
                        <PlaylistPlayIcon />
                    </Grid>

                    <Grid item>
                        <VolumeDownIcon />
                    </Grid>

                    <Grid item xs>
                        <Slider aria-labelledby="continuous-slider" />
                    </Grid>

                </Grid>

            </div>

        </div>
    );
}

export default Footer;