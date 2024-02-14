import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot, getSpots } from "../../store/spots";

function SpotDetails() {
    const dispatch = useDispatch();
    //Get spotId
    const { spotId } = useParams();

    //Get spot from redux state store
    const spot = useSelector(state => state.spots ? state.spots[spotId] : null);


    //Get the selected spot
    useEffect(() => {
        dispatch(getSpots())
            .then(async () => {
                await dispatch(getSpot(spotId))
            })
    }, [dispatch, spotId])

    return (
        <section>
            <div>
                <h2>{spot.name}</h2>
                <h4>{spot.city}, {spot.state}, {spot.country}</h4>
                <div>
                    {spot.SpotImages && spot.SpotImages.map(image => (
                        image.preview &&
                        <img key={image.id} src={image.url} />
                    ))}
                </div>
                <h3>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h3>
                <span>{spot.description}</span>
                <div>
                    <span>$ {spot.price}</span>
                </div>
                <div>
                    <span>&#9733; {spot.avgStarRating}</span>
                </div>
                <button onClick={() => alert("Feature coming soon")}>Reserve</button>
            </div>
        </section>
     );
}

export default SpotDetails;
