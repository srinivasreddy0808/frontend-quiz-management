import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./CreateQuizModal.module.css"; // Assuming you want to style the modal separately

const CreateQuizModal = ({
  isOpen,
  onClose,
  onContinue,
  initialData,
  isEditing,
}) => {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("Q&A");

  useEffect(() => {
    if (initialData) {
      setQuizName(initialData.quizName);
      setQuizType(initialData.quizType);
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.row}>
          <input
            type="text"
            placeholder="Quiz Name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            readOnly={isEditing}
          />
        </div>
        <div className={styles.quizTypeRow}>
          <div className={styles.quizTypeLabel}>Quiz Type</div>
          <div
            className={`${styles.quizTypeOption} ${
              quizType === "Q&A" ? styles.quizTypeOptionActive : ""
            }`}
            onClick={() => !isEditing && setQuizType("Q&A")}
          >
            Q&A
          </div>
          <div
            className={`${styles.quizTypeOption} ${
              quizType === "Poll" ? styles.quizTypeOptionActive : ""
            }`}
            onClick={() => !isEditing && setQuizType("Poll")}
          >
            Poll
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onContinue({ quizName, quizType })}
            disabled={!quizName}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
CreateQuizModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    quizName: PropTypes.string,
    quizType: PropTypes.string,
  }),
  isEditing: PropTypes.bool,
};

export default CreateQuizModal;
