import {findAllByDisplayValue} from "@testing-library/react";

export const initialState = {
    user: null,
    playlists: [],
    spotify: null,
    playing: false,
    item: null,
    discover_weekly: null,
    top_artists:null,
   
    
    //REMOVE AFTER FINISHED DEVELOPING...CHANGE TO NULLLLLLLLLLL
    //token: 'BQCn8qz5hn-qT7ZxQ751ZkzcWRJwEDGjxGgYLFjqj6_cJm-avu…Xo5fU-8G3LIq2RCCcJhCj5000suYPBLVEy8Rdw0xEM6wbJfyg',
};

//Updating the state w/o overriding your old state
const reducer = (state, action) => {
    console.log(action);

    switch(action.type) {
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
        default: 
            return state;
    }
}

export default reducer;