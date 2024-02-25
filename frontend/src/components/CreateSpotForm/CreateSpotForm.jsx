import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot, createSpotImage, getSpot } from "../../store/spots";

function CreateSpotForm() {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const sessionUser = useSelector(state => state.session.user);

    const [ country, setCountry ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ lat, setLat ] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [url, setUrl] = useState('');
    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');
    const [img4, setImg4] = useState('');
    const [img5, setImg5] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors({});

        const newSpot = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price
        }
        const imageInfo = {
            url,
            img1,
            img2,
            img3,
            img4,
            img5
        }

        dispatch(createSpot(newSpot))
            .then(spot => {
                const images = Object.values(imageInfo)
                let spotImage;

                images.map((img, index) => {
                    if (index === 0) {
                        spotImage = {
                            id: spot.id,
                            url: img,
                            preview: true
                        }
                    } else {
                        spotImage = {
                            id: spot.id,
                            url: img,
                            preview: false
                        }
                    }

                    dispatch(getSpot(spot.id))
                    dispatch(createSpotImage(spot.id, spotImage))
                    .then(navigate(`/spots/${spot.id}`))
                })
            })
            .catch(async (response) => {
                const data = await response.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
    }

    useEffect(() => {
        let errObj = {}
    if(!country) errObj.country = ( "Country required")
    if(!address) errObj.address =  ("Address required")
    if(!city) errObj.city =  ("City required")
    if(!state) errObj.state =  ("State required")
    if(!lat) errObj.lat =  ("Latitude required")
    if(!lng) errObj.lng =  ("Longitude required")
    if(!description || description.length < 30) errObj.description =  ("Description must be 30 characters")
    if(!name) errObj.name =  ("Name required")
    if(!url) errObj.url = ("Image required")
    if(!price) errObj.price =  ("Price required")

    if(price && price <= 0) errObj.price = ("Price is required")

    if(lat && (lat > 90 || lat < -90)) errObj.lat = ("Latitude is not valid")
    if(lng && (lng > 180 || lng < -180)) errObj.lng = ("Longitude is not valid")

    const urlFormat = url.split('.').pop()
    if(url && (urlFormat !== "png" && urlFormat !== "jpg" && urlFormat !== "jpeg")) errObj.image = ("Image URL must end in .png, .jpg, or .jpeg")

    const urlFormat1 = img1.split('.').pop()
    if(img1 && (urlFormat1 !== "png" && urlFormat1 !== "jpg" && urlFormat1 !== "jpeg")) errObj.img1 = ("Image URL must end in .png, .jpg, or .jpeg")

    const urlFormat2 = img2.split('.').pop()
    if(img2 && (urlFormat2 !== "png" && urlFormat2 !== "jpg" && urlFormat2 !== "jpeg")) errObj.img2 = ("Image URL must end in .png, .jpg, or .jpeg")


    const urlFormat3 = img3.split('.').pop()
    if(img3 && (urlFormat3 !== "png" && urlFormat3 !== "jpg" && urlFormat3 !== "jpeg")) errObj.img3 = ("Image URL must end in .png, .jpg, or .jpeg")

    const urlFormat4 = img4.split('.').pop()
    if(img4 && (urlFormat4 !== "png" && urlFormat4 !== "jpg" && urlFormat4 !== "jpeg")) errObj.img4 = ("Image URL must end in .png, .jpg, or .jpeg")

    const urlFormat5 = img5.split('.').pop()
    if(img5 && (urlFormat5 !== "png" && urlFormat5 !== "jpg" && urlFormat5 !== "jpeg")) errObj.img5 = ("Image URL must end in .png, .jpg, or .jpeg")
    setErrors(errObj)
    }, [address, city, state, description, lat, lng, name, url, price, country, img1, img2, img3, img4, img5])
    
    return (  
        <div className="spotContainer">
            {
                sessionUser && 
                    <form onSubmit={handleSubmit}>
                        <h2>Create a New Spot</h2>
                        <h4>Where's your place located?</h4>
                        <p>Guests will only get your exact address once they book a reservation.</p>
                        <span>{errors.country}</span>
                        <input 
                            type="text" 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                            name="country"
                        />

                        <span>{errors.address}</span>
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Address"
                            name="address"
                        />

                        <span>{errors.city}</span>
                        <input 
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            name="city"
                        />

                        <span>{errors.state}</span>
                        <input 
                            type="text" 
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                            name="state"
                        />

                        <span>{errors.lat}</span>
                        <input 
                            type="text" 
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="Latitude"
                            name="latitude"
                        />

                        <span>{errors.lng}</span>
                        <input 
                            type="text" 
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="Longitude"
                            name="longitude"
                        />

                        <h4>Describe your place to Guests</h4>
                        <p>Mention the best features about your space, any special amenities, like fast WiFi or parking, and what you love about the neighborhood</p>
                        <span>{errors.description}</span>
                        <textarea 
                            name="description" 
                            cols="30" 
                            rows="10"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please write at least 30 characters"    
                        />

                        <h4>Create a title for your spot</h4>
                        <p>Catch Guests attention with a spot title that highlights what makes your place special.</p>
                        <span>{errors.spot}</span>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of your spot"
                            name="spot name"
                        />

                        <h4>Set a base price for your spot</h4>
                        <span>Competitive pricing can help your listing stand out and rank higher in search results.</span>
                        <span>{errors.price}</span>
                        <input 
                            type="text" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night USD"
                            name="price"
                        />

                        <h4>Liven up your spot with photos</h4>
                        <span>Submit a link to at least one photo to publish your spot.</span>
                        <input
                        type="text"
                        value={url}
                        onChange={(e) => ({
                            previewImage: true,
                            url: setUrl(e.target.value)
                        })
                        }
                        placeholder="Preview Image URL"
                        name="previewImage"
                        />
                        {errors.url && <span>{errors.url}</span>}
                        {errors.image && <span>{errors.image}</span>}
                        <input
                            type="text"
                            value={img1}
                            onChange={(e) => ({
                                previewImage: false,
                                url: setImg1(e.target.value)
                            })
                            }
                            placeholder="Image URL"
                            name="image"
                        />
                        {errors.img1 && <span>{errors.img1}</span>}

                        <input
                            type="text"
                            value={img2}
                            onChange={(e) => ({
                                previewImage: false,
                                url: setImg2(e.target.value)
                            })
                            }
                            placeholder="Image URL"
                            name="image"
                        />
                        {errors.img2 && <span>{errors.img2}</span>}

                        <input
                            type="text"
                            value={img3}
                            onChange={(e) => ({
                                previewImage: false,
                                url: setImg3(e.target.value)
                            })
                            }
                            placeholder="Image URL"
                            name="image"
                        />
                        {errors.img3 && <span>{errors.img3}</span>}

                        <input
                            type="text"
                            value={img4}
                            onChange={(e) => ({
                                previewImage: false,
                                url: setImg4(e.target.value)
                            })
                            }
                            placeholder="Image URL"
                            name="image"
                        />
                        {errors.img4 && <span>{errors.img4}</span>}

                        <input
                            type="text"
                            value={img5}
                            onChange={(e) => ({
                                previewImage: false,
                                url: setImg5(e.target.value)
                            })
                            }
                            placeholder="Image URL"
                            name="image"
                        />
                        {errors.img5 && <span>{errors.img5}</span>}
                        
                        <button
                            type="submmit"
                            disabled={!!Object.values(errors).length}    
                        >
                            Create a Spot 
                        </button>
                    </form>
            }
        </div>
    );
}

export default CreateSpotForm;