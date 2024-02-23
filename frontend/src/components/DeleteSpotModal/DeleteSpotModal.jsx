import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeSpot } from "../../store/spots";

function DeleteSpotModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const yes = () => {
        return dispatch(removeSpot(spotId))
                .then(closeModal)
    }
    return ( 
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={yes}>Yes -Delete Spot-</button>
            <button onClick={closeModal}>No -Keep Spot-</button>
        </>
     );
}

export default DeleteSpotModal;