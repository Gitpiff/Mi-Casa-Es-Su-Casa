import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotReviews } from "../../store/reviews";

function SpotReviews() {
    //Get spotId associated with review
    const { spotId } = useParams();

    const dispatch = useDispatch();

    //Get reviews from the redux store
    const reviews = Object.values(useSelector(state => state.reviews))
    //sort reviews starting with most recent
    reviews.sort((a, b) => b.id - a.id)

    //Get sessionUser
    const sessionUser = useSelector(state => state.session.user)


    useEffect(() => {
        dispatch(getSpotReviews())
    })
    return (  
        <h1>Spot Reviews Component</h1>
    );
}

export default SpotReviews;