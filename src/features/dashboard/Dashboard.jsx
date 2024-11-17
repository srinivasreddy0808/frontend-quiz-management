import { useLoaderData } from "react-router-dom";
import eyeIcon from "./../../assets/eye.png";
import "./Dashboard.css";

// Utility function to format impressions
const formatImpressions = (impressions) => {
  if (impressions >= 1000) {
    return `${(impressions / 1000).toFixed(1)}k`;
  }
  return impressions;
};

const Dashboard = () => {
  const { data } = useLoaderData();

  return (
    <div className="dashboard-container">
      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-box quizzes">
          <div>
            <span className="stats-number">{data.noOfQuizzes} </span>
            <span className="stats-text">created</span>{" "}
          </div>
          Quiz
        </div>
        <div className="stats-box questions">
          <div>
            <span className="stats-number">{data.noOfQuestions}</span>{" "}
            <span className="stats-text">created </span>
          </div>
          questions
        </div>
        <div className="stats-box impressions">
          <div>
            <span className="stats-number">
              {formatImpressions(data.totalImpressions)}
            </span>{" "}
            <span className="stats-text">impressions</span>
          </div>{" "}
          total
        </div>
      </div>

      {/* Trending Quizzes Section */}
      <div className="trending-section">
        <h2>Trending Quizzes</h2>
        <div className="trending-grid">
          {data.quizDetails.map((quiz, index) => (
            <div className="trending-box" key={index}>
              <div className="quiz-title">
                <div>{quiz.title.slice(0, 10)}</div>
                <div className="impressions">
                  <div>{formatImpressions(quiz.noOfImpressions)}</div>
                  <div>
                    <img src={eyeIcon} alt="eye icon" className="eye-icon" />
                  </div>
                </div>
              </div>
              <div className="created-at">
                Created on: {new Date(quiz.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
