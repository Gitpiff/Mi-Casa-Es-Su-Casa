import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotReviews, clearReviews } from "../../store/reviews";
import DeleteReviewButton from "./DeleteReviewButton";

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

        return () => {
            dispatch(clearReviews())
        }
            
    }, [dispatch, spotId])

    const getDate = (date) => {
        const newDate = new Date(date);
        const month = newDate.toLocaleString('default', { month: 'long'})
        const year = newDate.getFullYear();
        return [month, " ", year]
    }

    return (  
        <>
        {reviews && reviews.map((review) => (
            <li
            className="reviewsList"
            key={review.id}>
            <span style={{ fontSize: '18px' }}>
                
              {sessionUser && sessionUser.id === review.User?.id
                ? sessionUser.firstName
                : (review.User?.firstName)
              }
  
            </span>
            <span style={{ fontSize: '14px', color: 'grey' }}>
              {review.createdAt &&
                getDate(review.createdAt)
              }
            </span>
            <span style={{ fontSize: '12px' }}>
              {review.review}
            </span>
              {sessionUser && sessionUser.id === review.User?.id &&
              <span><DeleteReviewButton reviewId={review.id}/></span>
              }
          </li>
        ))}
      </>
    );
}

export default SpotReviews;