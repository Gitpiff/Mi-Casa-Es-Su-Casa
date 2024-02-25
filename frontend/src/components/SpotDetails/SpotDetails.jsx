import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from "../../store/spots";
import SpotReviews from "../SpotReviews";
import { getSpotReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton"
import CreateReviewModal from "../SpotReviews/CreateReviewModal";
import "./SpotDetails.css"

function SpotDetails() {
    const dispatch = useDispatch();
    //Get spotId
    const { spotId } = useParams();

    //Get spot from redux state store
    const spot = useSelector(state => state.spots ? state.spots[spotId] : null);

    //Get session user
    const sessionUser = useSelector(state => state.session.user);
    //Get reviews
    const reviews = Object.values(useSelector(state => state.reviews))
    //console.log(`Reviews ${reviews}`)

    //Get the selected spot
    useEffect(() => {
        dispatch(getSpot(spotId))
        if(reviews.length) {
            dispatch(getSpotReviews(spotId))
        }
            
    }, [dispatch, spotId, reviews.length])


 


    return ( spot && spot.Owner &&
        <section>
            <div className="container">
                <h2>{spot.name}</h2>
                <h4>{spot.city}, {spot.state}, {spot.country}</h4>
                <div className="gallery galleryContainer">
                {spot.SpotImages && spot.SpotImages.map(image => (
                        image.preview &&
                        <img
                            key={image.id}
                            src={image.url}
                        />
                    ))}
                    {spot.SpotImages && spot.SpotImages.map(image => (
                        !image.preview &&
                        <img
                            key={image.id}
                            src={image.url}
                            height="200px"
                            width="200px"
                        />
                    ))}
                </div>
                <h3>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h3>
                <span>{spot.description}</span>
                <div>
                    <span>$ {Number.parseFloat(`${spot.price}`).toFixed(2)}</span>
                </div>
                <div >
                    <span>&#9733; {spot.avgStarRating ? Number.parseFloat(`${spot.avgStarRating}`).toFixed(2) : "New"}</span>
                </div>
                <button onClick={() => alert("Feature Coming Soon...")}>Reserve</button>
                <div>
                {(sessionUser && spot.numReviews === 0 && sessionUser.id !== spot.ownerId) &&
                        <>
                           <OpenModalButton
                                buttonText="Post Your Review"
                                modalComponent={<CreateReviewModal spotId={spotId}/>}
                            />
                            <p>Be the first to post a review!</p>
                        </>}
                    {/* If more than One Review display Reviews instead of Review */}
                    {
                        sessionUser && spot.numReviews === 1 && sessionUser.id !== spot.ownerId &&
                        <>
                            <span>1 Review</span>
                            <OpenModalButton
                                buttonText="Post Your Review"
                                modalComponent={<CreateReviewModal spotId={spotId}/>}
                            />
                        </>
                    }
                    {
                        sessionUser && spot.numReviews && spot.numReviews > 1 && sessionUser.id !== spot.ownerId &&
                    <>
                        <span>{spot.numReviews} Reviews </span>
                        <OpenModalButton
                                buttonText="Post Your Review"
                                modalComponent={<CreateReviewModal spotId={spotId}/>}
                            />
                    </>
                    }
                    {
                        spot.numReviews >= 1 && <SpotReviews spotId={spotId} sessionUser={sessionUser} spot={spot}/>
                    }

                    
                </div>
            </div>
        </section>
     );
}

export default SpotDetails;
