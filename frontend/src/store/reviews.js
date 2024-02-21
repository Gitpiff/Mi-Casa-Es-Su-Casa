import { csrfFetch } from "./csrf";
import { getSpot } from "./spots";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const CREATE_SPOT_REVIEWS = 'reviews/CREATE_SPOT_REVIEWS';

//Actions
const loadSpotReviews = (reviews, spotId) => {
    return {
        type: LOAD_REVIEWS,
        reviews,
        spotId
    }
}

const createSpotReview = (review, spotId) => {
    return {
        type: CREATE_SPOT_REVIEWS,
        review,
        spotId
    }
}


//Thunks
export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    console.log(response)
    if (response.ok) {
        const spotReviews = await response.json();
        return dispatch(loadSpotReviews(spotReviews, spotId));
    } else {
        const errors = await response.json();
        return errors
    }
}

export const addReview = (spotId, review) => async (dispatch, getState) => {
    const sessionUser = getState().session.user;
    console.log(spotId, review, sessionUser)

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({...review, userId: sessionUser.id})
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(createSpotReview(data));
        dispatch(getSpot(spotId));
        dispatch(getSpotReviews(spotId));
     return data
    } else {
        const errors = await response.json();
        return errors
    }
}

//Reducer
const reviewsReducer = (state ={}, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const allReviews = {}
            if (action.reviews.Reviews !== "New") {
                action.reviews.Reviews.forEach(review => {
                    allReviews[review.id] = review
                })
                return allReviews
            }
        }
        case CREATE_SPOT_REVIEWS: {
            return {...state, [action.review.id]: action.review}
        }
        default: 
        return state
    }
}

export default reviewsReducer;