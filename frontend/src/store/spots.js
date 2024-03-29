import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const GET_SPOT_DETAILS = "spots/GET_SPOT_DETAILS";
const LOAD_SPOT_IMAGES = "spots/LOAD_SPOT_IMAGES";
const DELETE_SPOT = "spots/DELETE_STOP";
const UPDATE_SPOT = 'spot/updateSpot';

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

const loadSpotImages = (spotImage, spotId) => {
    return {
        type: LOAD_SPOT_IMAGES,
        spotImage,
        spotId
    }
}

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

const updateSpot = spot => {
    return {
        type: UPDATE_SPOT,
        spot
    };
};


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

export const createSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(loadSpot(newSpot));
        return newSpot
    } else {
        const errors = await response.json();
        return errors;
    }
}

export const createSpotImage = (spotId, spotImage) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(spotImage)
    })

    if (response.ok) {
        const newImage = await response.json();
        dispatch(loadSpotImages(newImage, spotId))
        return newImage
    } else {
        const errors = await response.json();
        return errors;
    }
}

export const getOwnerSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current')

    if (response.ok) {
        const data =  await response.json()
        dispatch(getSpots(data))
        return data
    }
}

export const removeSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })

    if (response.ok) {
        dispatch(deleteSpot(spotId))
    }
}

export const modifySpot = spot => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        body: JSON.stringify(spot)
    });

    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(updateSpot(updatedSpot));
        return updatedSpot;
    }
};

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
        } case LOAD_SPOT_IMAGES : {
            return {...state, [action.spotId]: {...state[action.spotId], SpotImages: [...state[action.spotId].SpotImages, action.spotImage]}}
        }
        case DELETE_SPOT: {
            const newState = {...state};
            delete newState[action.spotId];
            return newState;
        }
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        default:
            return state
    }
}

export default spotsReducer;
