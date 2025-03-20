

export const initialState = {
    user: null,
    playlists: [],
    playlist: null,
    spotify: null,
    playing: false,
    item: {},
    discover_weekly: null,
    top_artists: null,
    top_tracks: null,
    playback_state: {},
    currently_playing: {}
};

// * Updating the state w/o overriding your old state
const reducer = (state, action) => {

    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            }
        case 'SET_PLAYING':
            return {
                ...state,
                playing: action.playing,
            }
        case 'SET_ITEM':
            return {
                ...state,
                item: action.item,
            }
        case 'SET_TOP_ARTISTS':
            return {
                ...state,
                top_artists: action.top_artists,
            }
        case 'SET_TOP_TRACKS':
            return {
                ...state,
                top_tracks: action.top_tracks,
            }
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.token
            }
        case 'SET_PLAYLISTS':
            return {
                ...state,
                playlists: action.playlists,
            }
        case 'SET_DISCOVER_WEEKLY':
            return {
                ...state,
                discover_weekly: action.discover_weekly,
            }
        case 'SET_SPOTIFY':
            return {
                ...state,
                spotify: action.spotify,
            }
        case 'SET_PLAYLIST':
            return {
                ...state,
                playlist: action.playlist,
            }
        case 'SET_PLAYBACK_STATE':
            return {
                ...state,
                playback_state: action.playback_state,
            }
        case 'SET_CURRENTLY_PLAYING':
            return {
                ...state,
                currently_playing: action.currently_playing,
            }
        default:
            return state;
    }
}

export default reducer;