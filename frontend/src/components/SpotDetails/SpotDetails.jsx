import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from "../../store/spots";
import SpotReviews from "../SpotReviews";
import { getSpotReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton"
import CreateReviewModal from "../SpotReviews/CreateReviewModal";
import "./SpotDetails.css"
// import { isArray } from "lodash";

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
            <div className="spot-container">
                <div className="spot-details">
                    <div className="heading">
                        <h2>{spot.name}</h2>
                        <h4>{spot.city}, {spot.state}, {spot.country}</h4>

                    </div>
                    <div className="imagesGrid">
                        {Array.isArray(spot.SpotImages) && spot.SpotImages.map(image => {
                            if (image.preview === true) {
                                return (
                                    <div key={image.id}>
                                        <img src={image.url} className='preview-image' />
                                    </div>
                                )
                            } else if (image.preview === false) {
                                return (
                                    <img src={image.url} className='reg-image' key={image.id} />
                                )
                            }
                        })}
                        {/* <div className='reg-img-container'>
                            {spot.SpotImages?.map(image => {
                                if (image.preview === false) {
                                    return (
                                        <img src={image.url} className='reg-image' key={image.id} />
                                    )
                                }
                            })}
                        </div> */}
                    </div>
                </div>

                

                <div className='spot-info'>
                    <div className='details'>
                        <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                        <p>{spot.description}</p>
                    </div>
                    <div className='reserve'>
                        <div className='reserve-price'>
                            <i className="fa-solid fa-coins"></i> $ {parseFloat(spot.price).toFixed(2)} night
                        </div>
                            <div className='review-preview'>
                                <p className='avg-review'>
                                    <i className='fas fa-star'></i>
                                    <span>&#9733; {spot.avgStarRating !== "No reviews found" ? `${parseFloat(spot.avgStarRating).toFixed(2)}` : "New"}</span>
                                    {console.log(spot.avgStarRating)}
                                    {spot.numReviews !== 0 && (
                                        <span>
                                            · {spot.numReviews && spot.numReviews === 1 ? '1 review' : 'reviews'}
                                        </span>
                                    )}
                                </p>
                            </div>
                             <button onClick={() => window.alert('Feature Coming Soon...')}>Reserve</button>
                        </div>
                    
                   
                {(sessionUser && spot.numReviews === 0 && sessionUser.id !== spot.ownerId) &&
                        <>
                           <OpenModalButton
                                className= "new-review"
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
                                className= "new-review"
                                buttonText="Post Your Review"
                                modalComponent={<CreateReviewModal spotId={spotId}/>}
                            />
                        </>
                    }
                    {
                        sessionUser && spot.numReviews && spot.numReviews > 1 && sessionUser.id !== spot.ownerId &&
                    <>
                        <span id="starReviews">&#9733; {spot.numReviews} Reviews </span>
                        <OpenModalButton
                                className= "new-review"
                                buttonText="Post Your Review"
                                modalComponent={<CreateReviewModal spotId={spotId}/>}
                            />
                    </>
                    }
                    
                

                    
                </div>
            </div>
            <div className="spot-reviews">
                {
                    spot.numReviews >= 1 && <SpotReviews spotId={spotId} sessionUser={sessionUser} spot={spot}/>
                }
            </div>      
        </section>
     );
}

export default SpotDetails;
