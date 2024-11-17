import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./CreateQuizModalSecond.module.css";
import SuccessModal from "./SuccessModal";
import deleteIcon from "./../../assets/delete.png"; // Adjust the path based on your file structure
import { useLocation } from "react-router-dom";

const CreateQuizModalSecond = ({ quizData, onClose, onCloseAll }) => {
  const location = useLocation();
  const quizToEdit = location.state?.quizToEdit;
  const [questions, setQuestions] = useState([
    {
      id: 1,
      optionsType: "text",
      options: [
        { text: "", imageUrl: "" },
        { text: "", imageUrl: "" },
      ],
      timer: "10 sec",
      text: "",
      analytics: {
        answer: "",
        attempts: 0,
        correctAnswers: 0,
      },
    },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [optionType, setOptionType] = useState("text");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quizLink, setQuizLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (quizToEdit) {
      setIsEditing(true);
      setQuestions(
        quizToEdit.questions.map((q) => ({
          ...q,
          options: q.options.map((opt) => JSON.parse(opt)),
          timer: q.timer ? `${q.timer} sec` : "OFF",
        }))
      );
      setOptionType(quizToEdit.questions[0].optionsType);
    }
  }, [quizToEdit]);

  /*   useEffect(() => {
    if (quizData.questions && quizData.questions.length > 0) {
      setQuestions(quizData.questions);
    }
  }, [quizData]); */

  const addQuestion = () => {
    if (questions.length < 5 && !isEditing) {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          optionsType: "text",
          options: [
            { text: "", imageUrl: "" },
            { text: "", imageUrl: "" },
          ],
          timer: "OFF",
          text: "",
          analytics: {
            answer: "",
            attempts: 0,
            correctAnswers: 0,
          },
        },
      ]);
      setCurrentQuestion(questions.length);
    }
  };

  const handleOptionTypeChange = (type) => {
    if (!isEditing) {
      setOptionType(type);
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion].optionsType = type;
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (index, value, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerSelect = (index) => {
    if (!isEditing) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion].analytics.answer = index.toString();
      console.log(index.toString());
      setQuestions(updatedQuestions);
    }
  };

  const addOption = () => {
    if (questions[currentQuestion].options.length < 4 && !isEditing) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion].options.push({
        text: "",
        imageUrl: "",
      });
      setQuestions(updatedQuestions);
    }
  };

  const removeOption = (index) => {
    if (!isEditing) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion].options.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  const setTimer = (time) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].timer = time;
    setQuestions(updatedQuestions);
  };

  const handleCreateQuiz = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const requestBody = {
        title: quizData.quizName || "Sample Quiz",
        createdAt: new Date().toISOString(),
        questions: questions.map((q) => {
          // Prepare the common fields
          const commonFields = {
            text: q.text || "",
            options: q.options.map((opt) => {
              return JSON.stringify(opt);
            }),
            optionsType: q.optionsType,
            type: quizData.quizType === "Q&A" ? "single" : "poll",
            timer: q.timer !== "OFF" ? parseInt(q.timer) : undefined,
          };

          // Conditionally add responseCounts and analytics
          const specificFields = {};
          console.log(q.analytics.answer, "analytics answer");
          if (quizData.quizType === "Q&A") {
            specificFields.analytics = {
              answer: q.analytics.answer,
              attempts: 0,
              correctAnswers: 0,
            }; // Only include if Q&A type
          }
          console.log(
            {
              ...commonFields,
              ...specificFields,
            },
            "created question object for request"
          );

          return {
            ...commonFields,
            ...specificFields,
          };
        }),
      };
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiBaseUrl}/api/v1/quizzes/${
          isEditing ? `update-quiz/${quizToEdit._id}` : "create-quiz"
        }`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      const quizId = data.data.quiz._id;
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
      const dummyLink = `${frontendUrl}/quiz/${quizId}`;
      setQuizLink(dummyLink);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleShare = () => {
    console.log("Sharing quiz:", quizLink);
  };

  return (
    <div className={styles.modalOverlay}>
      {showSuccessModal ? (
        <SuccessModal
          link={quizLink}
          onCloseAll={onCloseAll}
          onShare={handleShare}
        />
      ) : (
        <>
          <div className={styles.modal}>
            <div className={styles.questionTabs}>
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`${styles.questionTab} ${
                    index === currentQuestion ? styles.active : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
              {questions.length < 5 && (
                <button className={styles.addQuestion} onClick={addQuestion}>
                  +
                </button>
              )}
              <span className={styles.maxQuestions}>Max 5 questions</span>
            </div>

            <input
              type="text"
              placeholder="Poll Question"
              className={styles.pollQuestion}
              value={questions[currentQuestion].text || ""}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[currentQuestion].text = e.target.value;
                setQuestions(updatedQuestions);
              }}
            />
            <div className={styles.optionType}>
              <div>Options Type</div>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="text"
                  checked={optionType === "text"}
                  onChange={() => handleOptionTypeChange("text")}
                />
                <span>Text</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="imageUrl"
                  checked={optionType === "imageUrl"}
                  onChange={() => handleOptionTypeChange("imageUrl")}
                />
                <span> Image URL</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="textAndImageUrl"
                  checked={optionType === "textAndImageUrl"}
                  onChange={() => handleOptionTypeChange("textAndImageUrl")}
                />
                <span>Text & Image URL</span>
              </label>
            </div>

            <div className={styles.optionsAndTimer}>
              <div className={styles.options}>
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className={styles.optionItem}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion}-answer`}
                      checked={
                        questions[currentQuestion].analytics.answer ===
                        index.toString()
                      }
                      onChange={() => handleAnswerSelect(index)}
                      className={styles.answerRadio}
                    />
                    {optionType === "text" ||
                    optionType === "textAndImageUrl" ? (
                      <input
                        type="text"
                        placeholder="Text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value, "text")
                        }
                        className={`${styles.optionInput} ${
                          questions[currentQuestion].analytics.answer ===
                          index.toString()
                            ? styles.selectedOption
                            : ""
                        }`}
                      />
                    ) : null}
                    {optionType === "imageUrl" ||
                    optionType === "textAndImageUrl" ? (
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={option.imageUrl}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value, "imageUrl")
                        }
                        className={`${styles.optionInput} ${
                          questions[currentQuestion].analytics.answer ===
                          index.toString()
                            ? styles.selectedOption
                            : ""
                        }`}
                      />
                    ) : null}
                    {index >= 2 && (
                      <button
                        className={styles.deleteOption}
                        onClick={() => removeOption(index)}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          className={styles.deleteIcon}
                        />
                      </button>
                    )}
                  </div>
                ))}
                {questions[currentQuestion].options.length < 4 && (
                  <button className={styles.addOption} onClick={addOption}>
                    Add option
                  </button>
                )}
              </div>

              <div className={styles.timer}>
                <span>Timer</span>
                <button
                  className={`${styles.timerBtn} ${
                    questions[currentQuestion].timer === "OFF"
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => setTimer("OFF")}
                >
                  OFF
                </button>
                <button
                  className={`${styles.timerBtn} ${
                    questions[currentQuestion].timer === "5 sec"
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => setTimer("5 sec")}
                >
                  5 sec
                </button>
                <button
                  className={`${styles.timerBtn} ${
                    questions[currentQuestion].timer === "10 sec"
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => setTimer("10 sec")}
                >
                  10 sec
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.createQuiz} onClick={handleCreateQuiz}>
                {isEditing ? "Update Quiz" : "Create Quiz"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

CreateQuizModalSecond.propTypes = {
  quizData: PropTypes.shape({
    quizName: PropTypes.string,
    quizType: PropTypes.string,
    /* questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        optionsType: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        timer: PropTypes.string.isRequired,
        text: PropTypes.string,
        analytics: PropTypes.shape({
          answer: PropTypes.string,
          attempts: PropTypes.number,
          correctAnswers: PropTypes.number,
        }),
      })
    ), */
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onCloseAll: PropTypes.func.isRequired,
};

export default CreateQuizModalSecond;
