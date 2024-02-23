import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "./CreateReviewModal";

export default function CreateReviewButton({ spotId }) {
    return (
        <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<CreateReviewModal spotId={spotId} />}
        />
    );
}