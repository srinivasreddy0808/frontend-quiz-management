import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = function () {
  const location = useLocation();
  const navigate = useNavigate();
  // Function to determine if the current path matches
  const isActive = (path) => location.pathname === path;

  // Function to handle logout
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/auth/login"); // Adjust the path as needed
  };
  return (
    <div className="layout-container">
      {/* Left Navigation Part */}
      <nav className="nav-section">
        {/* Logo Part */}
        <div className="nav-logo">QUIZZIE</div>

        {/* Navigation Links Part */}
        <div className="nav-links">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/createQuiz"
                className={`nav-link ${
                  isActive("/createQuiz") ? "active" : ""
                }`}
              >
                Create Quiz
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className={`nav-link ${isActive("/analytics") ? "active" : ""}`}
              >
                Analytics
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout Part */}
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      {/* Right Content Part */}
      <div className="content-section">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
