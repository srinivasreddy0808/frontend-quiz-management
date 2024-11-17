import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import quizzeTrophy from "./../assets/quizze-app-image.png";
import "./Quiz.css";

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  ////
  const renderOption = (option, index) => {
    console.log(option, "option");
    const parsedOption = JSON.parse(option);
    console.log(parsedOption, "parsedoption");

    switch (currentQuestion.optionsType) {
      case "text":
        return <span className="option-text">{parsedOption.text}</span>;
      case "imageUrl":
        return (
          <img
            src={parsedOption.imageUrl}
            alt={`Option ${index + 1}`}
            className="option-image"
          />
        );
      case "textAndImageUrl":
        return (
          <>
            <span className="option-text">{parsedOption.text}</span>
            <img
              src={parsedOption.imageUrl}
              alt={`Option ${index + 1}`}
              className="option-image"
            />
          </>
        );
      default:
        return <span className="option-text">{option}</span>;
    }
  };

  ///  ddff
  const fetchQuizDetails = useCallback(async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/v1/quizzes/${quizId}`);
      const obj = await response.json();
      console.log(obj);
      setQuiz(obj.data.quiz);
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  }, [quizId]);

  const fetchQuestion = useCallback(
    async (questionId) => {
      console.log(questionId);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(
          `${apiBaseUrl}/api/v1/quizzes/${quizId}/questions/${questionId}`
        );
        const obj = await response.json();
        console.log(obj.data.question);
        setCurrentQuestion(obj.data.question);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    },
    [quizId]
  );
  const handleNext = useCallback(async () => {
    if (selectedOption !== null) {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        console.log(currentQuestion);
        const response = await fetch(
          `${apiBaseUrl}/api/v1/quizzes/${quizId}/questions/${currentQuestion._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedOption }),
          }
        );
        const result = await response.json();
        console.log(result);
        if (result.data.isCorrect) {
          setScore((prevScore) => prevScore + 1);
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  }, [currentQuestion, currentQuestionIndex, quiz, selectedOption, quizId]);

  useEffect(() => {
    fetchQuizDetails();
  }, [fetchQuizDetails]);

  useEffect(() => {
    if (quiz && quiz.questions.length > 0) {
      fetchQuestion(quiz.questions[currentQuestionIndex]._id);
    }
  }, [quiz, currentQuestionIndex, fetchQuestion]);

  // setting the timer if it is there
  useEffect(() => {
    if (currentQuestion && currentQuestion.timer) {
      setTimeLeft(currentQuestion.timer);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleNext();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestion, handleNext]);
  if (!quiz || !currentQuestion) return <div>Loading...</div>;

  if (quizCompleted) {
    return (
      <div className="quiz-background">
        <div className="quiz-container completion-screen">
          {currentQuestion.type === "single" ? (
            <>
              <h2>Congrats Quiz is completed</h2>
              <div className="trophy-icon">
                <img src={quizzeTrophy} alt="Trophy" />
              </div>
              <p>
                Your Score is{" "}
                <span>
                  {" "}
                  {score}/{quiz.questions.length}
                </span>
              </p>
            </>
          ) : (
            <div className="poll-success">
              <h2>Thank you for participating in the Poll</h2>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-background">
      <div className="quiz-container">
        <div className="quiz-header">
          <div>{`${currentQuestionIndex + 1}/${quiz.questions.length}`}</div>
          {currentQuestion.timer && (
            <div className="timer">{`${String(
              Math.floor(timeLeft / 60)
            ).padStart(2, "0")}:${String(timeLeft % 60).padStart(
              2,
              "0"
            )}`}</div>
          )}
        </div>
        <div className="quiz-content">
          <h2 className="question-text">{currentQuestion.text}</h2>
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`option-button ${
                  selectedOption === index ? "selected" : ""
                }`}
              >
                {renderOption(option, index)}
              </button>
            ))}
          </div>
          <button onClick={handleNext} className="next-button">
            {currentQuestionIndex === quiz.questions.length - 1
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
