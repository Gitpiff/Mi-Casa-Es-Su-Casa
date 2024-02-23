import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOwnerSpots } from "../../store/spots";
import { Link } from "react-router-dom";

function ManageSpots() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const userId = sessionUser?.id;
    const spots = Object.values(useSelector(state => state.spots)).filter(spot => spot.ownerId === userId)
    console.log(spots)

    useEffect(() => {
        dispatch(getOwnerSpots(userId))
    }, [dispatch, userId])

    return (sessionUser &&
        <>
            <h1 style={{ marginLeft: "20px" }}>Manage Your Spots</h1>
            {spots.length === 0 &&
                <Link to='/spots/new'><button style={{ marginBottom: "30px", marginLeft: "20px" }}>Create a New Spot</button></Link>
            }
            {spots &&
                <div className='container'>
                    {spots.map(spot => (
                        <div key={spot.id} className='spotCard'>
                            <div>
                                <Link to={`/spots/${spot.id}`}>
                                    <span className='toolTip'>{spot.name}</span>
                                    <img
                                        className='spotImage'
                                        src={spot.previewImage}
                                    />
                                    <div className='spotInfo'>
                                        <span>{spot.city}, {spot.state}</span>
                                        <span id='starReviews'>&#9733; {spot.avgRating}</span>
                                    </div>

                                    <span style={{ fontWeight: '800' }}>${spot.price}</span> night
                                </Link>
                                <p className='buttonBlock'>
                                    <Link to={`/spots/${spot.id}/edit`}><button style={{ marginRight: "10px" }}>Update</button></Link>
                                    {/* <DeleteSpotModalButton spotId={spot.id} /> */}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default ManageSpots;