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
        <div className="main-container">
            {
                spots.map(spot => (
                    <div key={spot.id}>
                        <Link to={`/spots/${spot.id}`}>
                            <span>{spot.name}</span>
                            <img
                                src={spot.previewImage}
                                alt={spot.name}
                                className="spotImage"
                            />
                        </Link>
                    <div>
                        <span>{`${spot.city}, ${spot.state}`}</span>
                        <span>&#9733; {parseFloat(spot.avgRating).toFixed(2)}</span>
                        {/* {console.log(typeof(spot.avgRating))} */}
                    </div>
                        <span>{`$${parseFloat(spot.price).toFixed(2)} night`}</span>
                    </div>
                ))
            }
        </div>
    </section>
    </>);
}

export default SpotsList;
