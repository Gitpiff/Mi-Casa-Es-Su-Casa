import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import './Spots.css'

function SpotsList() {
    const dispatch = useDispatch();

    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])


    return (
    <>
    <section>
        <div className="container">
            {
                spots.map(spot => (
                    <div key={spot.id} className="spotCard">
                        <Link to={`/spots/${spot.id}`}>
                            <span className="toolTip">{spot.name}</span>
                            <img
                                src={spot.previewImage}
                                alt={spot.name}
                                className="spotImage"
                            />
                        </Link>
                    <div className="spotInfo">
                        <span>{`${spot.city}, ${spot.state}`}</span>
                        <span id="starReviews">&#9733; {spot.avgRating !== undefined ? `$ ${parseFloat(spot.avgRating).toFixed(2)}` : "New"}</span>
                        {console.log(typeof(spot.avgRating))}
                    </div>
                        <span style={{ fontWeight: '800' }}>{`$${parseFloat(spot.price).toFixed(2)} night`}</span>
                    </div>
                ))
            }
        </div>
    </section>
    </>);
}

export default SpotsList;
