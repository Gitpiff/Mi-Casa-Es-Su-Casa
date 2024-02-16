import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

//Actions
const loadReviews = (reviews, spotId) => {
    return {
        type: LOAD_REVIEWS,
        reviews,
        spotId
    }
}

//Thunks
export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`api/spots/${spotId}/reviews`)

    if (response.ok) {
        const spotReviews = await response.json();
        dispatch(loadReviews(spotReviews, spotId));
    } else {
        const errors = await response.json();
        return errors
    }
}

//Reducer
const reviewsReducer = (state ={}, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const reviewState = {...state}
            if (action.reviews.Reviews !== "New") {
                action.reviews.Reviews.forEach(review => {
                    reviewState[review.id] = review
                })
                return reviewState
            }
        }
        default: 
        return state
    }
}

export default reviewsReducer;