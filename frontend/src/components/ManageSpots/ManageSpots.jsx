import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpots, getSpot } from '../../store/spots';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal';
// import './ManageSpots.css';

const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const spots = useSelector(getSpots);

    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch]);

    const filteredSpots = spots.filter(spot => spot.ownerId === user.id);

    const newSpot = e => {
        e.preventDefault();
        navigate('/spots/new')
    }

    const handleClick = (e, spotId) => {
        if (!e.target.closest('.no-navigate')) {
            navigate(`/spots/${spotId}`);
        }
    }

    return (
        <>
            {
                filteredSpots && filteredSpots.length === 0 ? (
                    <div className='manage-header'>
                        <h1>Manage Your Spots</h1>
                        <button onClick={newSpot}>Create a New Spot</button>
                    </div>
                ) : (
                    <>
                        <div className='manage-header'>
                            <h1>Manage Your Spots</h1>
                        </div>
                        <div className='landing-page'>
                            <ul className='all-tiles'>
                                {spots && filteredSpots.map(spot => (
                                    <div
                                        className='spot-tile'
                                        onClick={e => handleClick(e, spot.id)}
                                        key={spot.id}
                                    >
                                        <div className='spot-prev'>
                                            <p className='tooltip'>{spot.name}</p>
                                            <img src={spot.previewImage}
                                                alt={spot.name}
                                                className='spot-img'
                                            />
                                        </div>
                                        <div className='tile-info'>
                                            <p>{spot.city}, {spot.state}</p>
                                            <p className='spot-rating'>
                                                <i className='fas fa-star'></i>
                                                {spot.avgRating?.toFixed(1) || 'New'}
                                            </p>
                                            <div className='price-per-night'>
                                                <p className='price'>${spot.price}</p>
                                                night
                                            </div>
                                            <div className='update-delete'>
                                                <button
                                                    className='no-navigate'
                                                    onClick={() => {
                                                        navigate(`/spots/${spot.id}/edit`)
                                                    }}>Update</button>
                                                <button className='no-navigate'>
                                                    <OpenModalMenuItem
                                                        itemText='Delete'
                                                        modalComponent={<DeleteSpotModal spot={spot} />}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
        </>
    )
};

export default ManageSpotsPage;