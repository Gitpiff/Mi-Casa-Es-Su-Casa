import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";

export default function DeleteSpotModalButton({ spotId }) {
    return (
        <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteSpotModal spotId={spotId} />}
        />
    )
}