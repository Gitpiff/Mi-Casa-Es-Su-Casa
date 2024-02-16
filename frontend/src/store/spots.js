import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const GET_SPOT_DETAILS = "spots/GET_SPOT_DETAILS"

//Actions
const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

const loadSpot = (spot) => {
    return {
        type: GET_SPOT_DETAILS,
        spot
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

export const getSpot = (spotId) =>  async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if(response.ok) {
        const spot = await response.json();
        dispatch(loadSpot(spot))
    }
}

//Reducer
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS:{
            const spotsState = {}
            action.spots.Spots.forEach(spot => {
                spotsState[spot.id] = spot
            })
            return spotsState
        }
        case GET_SPOT_DETAILS : {
            const spotState = {};
            spotState[action.spot.id] = action.spot
            return spotState
        }
        default:
            return state
    }
}

export default spotsReducer;
