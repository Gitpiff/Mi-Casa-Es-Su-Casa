import { useState } from "react";
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

    
    
    return (  
        <h1>Create Spot Form</h1>
    );
}

export default CreateSpotForm;