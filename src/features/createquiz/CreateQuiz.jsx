import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateQuizModal from "./CreateQuizModal";
import CreateQuizModalSecond from "./CreateQuizModalSecond";

import "./CreateQuiz.css";

const CreateQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizToEdit = location.state?.quizToEdit;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const [quizData, setQuizData] = useState(null);
  console.log(quizToEdit, "quiztoedit");

  useEffect(() => {
    if (quizToEdit) {
      setQuizData({
        quizName: quizToEdit.title,
        quizType: quizToEdit.questions[0].type === "single" ? "Q&A" : "Poll",
      });
      setModalOpen(true);
    }
  }, [quizToEdit]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/dashboard");
  };

  const handleContinue = (data) => {
    setQuizData(data);
    setModalOpen(false);
    setSecondModalOpen(true);
  };

  const handleCloseSecondModal = () => {
    setSecondModalOpen(false);
    setModalOpen(true); // Close both modals when success modal is closed
  };
  const handleCloseAll = () => {
    setSecondModalOpen(false);
    setModalOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="create-quiz-container">
      <div className="create-quiz">
        <button onClick={handleOpenModal} className="create-quiz-btn">
          Create Quiz
        </button>
        {isModalOpen && !isSecondModalOpen && (
          <CreateQuizModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onContinue={handleContinue}
            initialData={quizData}
            isEditing={!!quizToEdit}
          />
        )}
        {isSecondModalOpen && (
          <CreateQuizModalSecond
            quizData={quizData}
            onClose={handleCloseSecondModal}
            onCloseAll={handleCloseAll}
          />
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;
