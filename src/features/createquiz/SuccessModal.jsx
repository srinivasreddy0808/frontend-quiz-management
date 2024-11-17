import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SuccessModal.css";

const SuccessModal = ({ link, onCloseAll, onShare }) => {
  const handleShare = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link copied to clipboard!");
        onShare(); // Optional: trigger any additional share logic
      })
      .catch(() => {
        toast.error("Failed to copy the link.");
      });
  };

  return (
    <div className="modal-content success-modal">
      <div className="close-btn-container">
        <button className="close-btn" onClick={onCloseAll}>
          ×
        </button>
      </div>
      <h2>Congrats your Quiz is Published!</h2>
      <div className="link-container">
        <input type="text" value={link} readOnly />
      </div>
      <button className="share-btn" onClick={handleShare}>
        Share
      </button>
    </div>
  );
};

SuccessModal.propTypes = {
  link: PropTypes.string.isRequired,
  onCloseAll: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default SuccessModal;
