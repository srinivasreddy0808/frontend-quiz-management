import "./QuizAnalytics.css"; // Make sure to create and style this file

import { useLoaderData, useLocation } from "react-router-dom";

const QuizAnalytics = () => {
  const obj = useLoaderData();
  const {
    title: quizTitle = "Quiz 2 Question Analysis",
    createdAt,
    noOfImpressions: impressions,
  } = obj.data || {};
  const location = useLocation();
  console.log(location.state);
  const { quizNo } = location.state || {};
  return (
    <div className="quiz-analytics">
      <div className="quiz-header">
        <h1 className="quiz-title">{`Quiz ${
          Number(quizNo) + 1
        } ${quizTitle}`}</h1>
        <div className="quiz-meta">
          <div>
            Created on :{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div>Impressions : {impressions}</div>
        </div>
      </div>
      <div className="questions-container">
        {obj.data.questions.map((question, index) => (
          <div key={index} className="question-box">
            <h2 className="question-text">
              Q.{index + 1} {question.text}
            </h2>
            <div className="stats-container">
              {question.type === "single" ? (
                <>
                  <div className="stat-item">
                    <span className="stat-value">
                      {question.analytics.attempts}
                    </span>
                    <span className="stat-label">
                      people Attempted the question
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {question.analytics.correctAnswers}
                    </span>
                    <span className="stat-label">
                      people Answered Correctly
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {question.analytics.attempts -
                        question.analytics.correctAnswers}
                    </span>
                    <span className="stat-label">
                      people Answered Incorrectly
                    </span>
                  </div>
                </>
              ) : (
                question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="stat-item">
                    <span className="stat-value">
                      {question.responseCounts[optionIndex]}
                    </span>
                    <span className="stat-label">Option {optionIndex + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizAnalytics;
