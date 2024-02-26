import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { modifySpot, getSpot } from '../../store/spots';

// import { modifySpotImage } from '../../store/imageReducer';

const UpdateSpotForm = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots);
    let spot;

    useEffect(() => {
        dispatch(getSpot(spotId));
    }, [dispatch, spotId]);

    spot = spots[spotId]

    const [address, setAddress] = useState(spot?.address || '');
    const [city, setCity] = useState(spot?.city || '');
    const [state, setState] = useState(spot?.state || '');
    const [country, setCountry] = useState(spot?.country || '');
    const [lat, setLat] = useState('' + spot?.lat || '');
    const [lng, setLng] = useState('' + spot?.lng || '');
    const [name, setName] = useState(spot?.name || '');
    const [description, setDescription] = useState(spot?.description || '');
    const [price, setPrice] = useState('' + spot?.price || '');
   
    const [errors, setErrors] = useState({});

    const handleValidation = () => {
        const formErrors = {};
        let formIsValid = true;

        if (!address.length) {
            formIsValid = false;
            formErrors.address = 'Address is required'
        }
        if (!city.length) {
            formIsValid = false;
            formErrors.city = 'City is required'
        }
        if (!state.length) {
            formIsValid = false;
            formErrors.state = 'State is required'
        }
        if (!country.length) {
            formIsValid = false;
            formErrors.country = 'Country is required'
        }
        if (!lat.length) {
            formIsValid = false;
            formErrors.lat = 'Latitude is required'
        }
        if (lat.length) {
            if (lat < -90 || lat > 90) {
                formIsValid = false;
                formErrors.lat = 'Latitude must be between -90 and 90'
            }
        }
        if (!lng.length) {
            formIsValid = false;
            formErrors.lng = 'Longitude is required'
        }
        if (lng.length) {
            if (lng < -180 || lng > 180) {
                formIsValid = false;
                formErrors.lng = 'Longitude must be between -180 and 180'
            }
        }
        if (!name.length) {
            formIsValid = false;
            formErrors.name = 'Name is required'
        }
        if (!description.length) {
            formIsValid = false;
            formErrors.description = 'Description is required'
        }
        if (description.length) {
            if (description.length < 30) {
                formIsValid = false;
                formErrors.description = 'Description needs a minimum of 30 characters'
            }
        }
        if (!price.length) {
            formIsValid = false;
            formErrors.price = 'Price is required'
        }
        if (price.length) {
            if (price < 1) {
                formIsValid = false;
                formErrors.price = 'Price must be a positive number'
            }
        }
       

        setErrors(formErrors);
        return formIsValid;
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (handleValidation()) {
            const updatedSpot = {
                id: spotId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            };

            return dispatch(modifySpot(updatedSpot))
                .then(() => {
                   dispatch(getSpot(spotId))
                    navigate(`/spots/${spotId}`)
                })
        }
    }

    if (!user) {
        navigate('/');
    }

    if (!spot) return <></>

    return (
        <div className='update-spot-form'>
            <form onSubmit={handleSubmit} className='spot-form-els'>
                <h1>Update Your Spot</h1>
                <div className='set-location outer-container'>
                    <h2>Where&apos;s your place located?</h2>
                    <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>
                    <label className='country'>
                        <div className='spot-label'>
                            Country {errors.country && <p className='spot-error'>{errors.country}</p>}
                        </div>
                        <input
                            type="text"
                            value={country}
                            placeholder='Country'
                            onChange={e => setCountry(e.target.value)}
                        />
                    </label>
                    <label className='address'>
                        <div className='spot-label'>
                            Street Address {errors.address && <p className='spot-error'>{errors.address}</p>}
                        </div>
                        <input
                            type="text"
                            value={address}
                            placeholder='Address'
                            onChange={e => setAddress(e.target.value)}
                        />
                    </label>
                    <div className='city-state inner-container'>
                        <label className='city'>
                            <div className='spot-label'>
                                City {errors.city && <p className='spot-error'>{errors.city}</p>}
                            </div>
                            <input
                                type="text"
                                value={city}
                                placeholder='City'
                                onChange={e => setCity(e.target.value)}
                            />
                        </label>
                        <p className='comma'>,</p>
                        <label className='state'>
                            <div className='spot-label'>
                                State {errors.state && <p className='spot-error'>{errors.state}</p>}
                            </div>
                            <input
                                type="text"
                                value={state}
                                placeholder='State'
                                onChange={e => setState(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className='lat-lng inner-container'>
                        <label className='lat'>
                            <div className='spot-label'>
                                Latitude {errors.lat && <p className='spot-error'>{errors.lat}</p>}
                            </div>
                            <input
                                type="text"
                                value={lat}
                                placeholder='Latitude'
                                onChange={e => setLat(e.target.value)}
                            />
                        </label>
                        <p className='comma'>,</p>
                        <label className='lng'>
                            <div className='spot-label'>
                                Longitude {errors.lng && <p className='spot-error'>{errors.lng}</p>}
                            </div>
                            <input
                                type="text"
                                value={lng}
                                placeholder='Longitude'
                                onChange={e => setLng(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <div className='set-description outer-container'>
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities, and what you love about the neighborhood.</p>
                    <textarea
                        placeholder='Please write at least 30 characters'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    ></textarea>
                    <div className='spot-label'>
                        {errors.description && <p className='spot-error'>{errors.description}</p>}
                    </div>
                </div>
                <div className='set-name outer-container'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <input
                        placeholder='Name of your spot'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <div className='spot-label'>
                        {errors.name && <p className='spot-error'>{errors.name}</p>}
                    </div>
                </div>
                <div className='set-price outer-container'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <div className='inner-container'>
                        <p className='dollar'><i className="fa-solid fa-coins"></i></p>
                        <input
                            placeholder='Price per night (Silver Pieces)'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </div>
                    <div className='spot-label'>
                        {errors.price && <p className='spot-error'>{errors.price}</p>}
                    </div>
                </div>
               
                <button>Update Spot</button>
            </form>
        </div>
    )
};

export default UpdateSpotForm;