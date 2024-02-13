import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';

//Actions
const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}


//Thunks
export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots")

    if(response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots))
    }
}


const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS:{
            const spotsState = {}
            action.spots.Spots.forEach(spot => {
                spotsState[spot.id] = spot
            })
            return spotsState
        }
        default:
            return state
    }
}

export default spotsReducer;
