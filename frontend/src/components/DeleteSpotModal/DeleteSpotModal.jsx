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
<div className="delete">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <div className="confirm-delete">
                <button className="yes-delete" onClick={yes}>Yes (Delete Spot)</button>
                <button className="no-delete" onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
     );
}

export default DeleteSpotModal;