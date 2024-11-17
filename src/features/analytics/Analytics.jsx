import { useState } from "react";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Delete from "./../../assets/delete.png";
import Edit from "./../../assets/edit.png";
import Share from "./../../assets/share.png";
import DeleteModal from "./DeleteModal";
import "./Analytics.css";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Analytics = () => {
  const { data: quizData } = useLoaderData();
  const [tableData, setTableData] = useState(quizData.data.user.quizzes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const navigate = useNavigate();
  console.log(quizData, "quizData");

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz);
    setIsModalOpen(true);
  };

  const handleEditClick = (quiz) => {
    console.log(quiz, "quizeditclick");
    navigate("/createQuiz", { state: { quizToEdit: quiz } });
  };
  const handleShareClick = (quiz) => {
    console.log("handleshare click or started");
    const url = `${import.meta.env.VITE_FRONTEND_URL}/quiz/${quiz._id}`; // Update this URL as needed

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy URL.");
      });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/quizzes/delete-quiz/${
          quizToDelete._id
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token as a Bearer token
          },
        }
      );

      if (response.ok) {
        setTableData(tableData.filter((quiz) => quiz._id !== quizToDelete._id));
        toast.success("Quiz deleted successfully!");
      } else {
        throw new Error("Failed to delete quiz");
      }
    } catch (error) {
      toast.error("Error deleting quiz: " + error.message);
    } finally {
      setIsModalOpen(false);
      setQuizToDelete(null);
    }
  };

  return (
    <div className="analytics-container">
      <h2 className="analytics-heading">Quiz Analysis</h2>
      <div className="analytics-wrapper">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Quiz Name</th>
              <th>Created</th>
              <th>Impression</th>
              <th>{""}</th>
              <th>{""}</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{formatDate(quiz.createdAt)}</td>
                <td>{quiz.noOfImpressions}</td>
                <td className="icon-space">
                  <img
                    src={Delete}
                    alt="delete icon"
                    onClick={() => handleDeleteClick(quiz)}
                  />
                  <img
                    src={Edit}
                    alt="edit icon"
                    onClick={() => handleEditClick(quiz)}
                  />
                  <img
                    src={Share}
                    alt="share icon"
                    onClick={() => handleShareClick(quiz)}
                  />
                </td>
                <td className="text-link-space">
                  <Link
                    to={`/analytics/${quiz._id}`}
                    state={{ quizNo: `${index}` }}
                    className="analysis-link"
                  >
                    question wise analysis of the quiz
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Analytics;
