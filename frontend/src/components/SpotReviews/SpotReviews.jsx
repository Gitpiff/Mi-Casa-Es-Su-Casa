import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotReviews } from "../../store/reviews";
import { getSpot } from "../../store/spots";

function SpotReviews() {
    //Get spotId associated with review
    const { spotId } = useParams();

    const dispatch = useDispatch();

    //Get reviews from the redux store
    const reviews = Object.values(useSelector(state => state.reviews))
    // console.log(`Reviews ${reviews}`)
    //sort reviews starting with most recent
    // reviews.sort((a, b) => b.id - a.id)

    //Get sessionUser
    const sessionUser = useSelector(state => state.session.user)


    useEffect(() => {
        dispatch(getSpotReviews(spotId))
            
    }, [dispatch, spotId])

    const getDate = (date) => {
        const newDate = new Date(date);
        const month = newDate.toLocaleString('default', { month: 'long'})
        const year = newDate.getFullYear();
        return [month, " ", year]
    }

    return (  
       <>
        {
            reviews.map(review => (
                <div>
                    <h3>{review.User.firstName}</h3>
                    <h3>{getDate(review.createdAt)}</h3>
                    <span>
                        {review.review}
                    </span>
                </div>
                // <span>
                //     {console.log(review.review)}
                // </span>
            ))
        }
        {/* <h1>SpotReview</h1> */}
       </>
    );
}

export default SpotReviews;