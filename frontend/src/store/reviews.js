import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

//Actions
const loadSpotReviews = (reviews, spotId) => {
    return {
        type: LOAD_REVIEWS,
        reviews,
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
        default: 
        return state
    }
}

export default reviewsReducer;