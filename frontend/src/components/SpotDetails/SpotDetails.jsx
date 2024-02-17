import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from "../../store/spots";
import SpotReviews from "../SpotReviews";
import { getSpotReviews } from "../../store/reviews";

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
    console.log(`Reviews ${reviews}`)

    //Get the selected spot
    useEffect(() => {
        dispatch(getSpot(spotId))
        if(reviews.length) {
            dispatch(getSpotReviews(spotId))
        }
            
    }, [dispatch, spotId, reviews.length])


 


    return ( spot && 
        <section>
            <div>
                <h2>{spot.name}</h2>
                <h4>{spot.city}, {spot.state}, {spot.country}</h4>
                <div>
                    {spot.SpotImages && spot.SpotImages.map(image => (
                        image.preview &&
                        <img style={{height: "200px", width: "300px"}} key={image.id} src={image.url} />
                    ))}
                </div>
                <h3>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h3>
                <span>{spot.description}</span>
                <div>
                    <span>$ {Number.parseFloat(`${spot.price}`).toFixed(2)}</span>
                </div>
                <div>
                    <span>&#9733; {Number.parseFloat(`${spot.avgStarRating}`).toFixed(2)}</span>
                </div>
                <button onClick={() => alert("Feature Coming Soon...")}>Reserve</button>
                <div>
                    {/* If more than One Review display Reviews instead of Review */}
                    {
                        spot.numReviews === 1 && 
                        <span>1 Review</span>
                    }
                    {spot.numReviews && spot.numReviews > 1 &&
                    <span>{spot.numReviews} Reviews </span>
                    }
                    {
                        spot.numReviews >= 1 && <SpotReviews spotId={spotId} sessionUser={sessionUser} spot={spot}/>
                    }
                    {
                        (sessionUser && spot.numReviews === 0 && sessionUser.id !== spot.ownerId) && 
                            <p>
                                Be the first to post a review!
                            </p>
                    }
                    {/* <SpotReviews spotId={spotId} sessionUser={sessionUser} spot={spot}/> */}
                </div>
            </div>
        </section>
     );
}

export default SpotDetails;
