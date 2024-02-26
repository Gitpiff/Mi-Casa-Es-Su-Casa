import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";
import './Reviews.css'

function DeleteReviewModal({ reviewId }) {
    //console.log(reviewId)
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const yes = (e) => {
        e.preventDefault();

        dispatch(deleteReview(reviewId.reviewId))
            .then(closeModal)
            .catch(async res => {
                const data = await res.json();
                return data;
            })
    }

    return (
        <div className="delete">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review?</p>
            <div className="confirm-delete">
                <button
                    id="yes-delete"
                    onClick={yes}>Yes (Delete Review)
                </button>
                <button
                    id="no-delete"
                    onClick={closeModal}>No (Keep Review)
                </button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;