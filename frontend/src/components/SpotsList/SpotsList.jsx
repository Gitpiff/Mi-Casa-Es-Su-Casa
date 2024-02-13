import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { Link } from "react-router-dom";

function SpotsList() {
    const dispatch = useDispatch();

    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])


    return (
    <>
        <ul>
            { spots && spots.map(spot => (
                <li key={spot.id}>
                    <Link to={`/spots/${spot.id}`}>
                        <span>{spot.name}</span>
                        <img src={spot.previewImage} alt={spot.name} />
                        <div>
                            <span>{`${spot.city}, ${spot.state}`}</span>
                            <span><i className="fa-solid fa-star"/>{spot.avgRating}</span>
                        </div>
                        <span>{`${spot.price} night`}</span>
                    </Link>
                </li>
            ))}
        </ul>

    </>);
}

export default SpotsList;
