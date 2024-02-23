import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";

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
        <section>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review?</p>
            <button
                id="yes"
                onClick={yes}>Yes (Delete Review)
            </button>
            <button
                id="noButton"
                onClick={closeModal}>No (Keep Review)
            </button>
        </section>
    )
}

export default DeleteReviewModal;