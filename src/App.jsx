import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./features/authentication/Signup";
import Login from "./features/authentication/Login";
import Dashboard from "./features/dashboard/Dashboard";
import CreateQuiz from "./features/createquiz/CreateQuiz";
import Analytics from "./features/analytics/Analytics";
import QuizAnalytics from "./features/analytics/QuizAnalytics";
import PrivateRoute from "./components/PrivateRoute";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import { dashboardLoader } from "./features/dashboard/dashboardLoader";
import { fetchAnalytics } from "./features/analytics/fetchAnalytics";
import { fetchQuizAnalytics } from "./features/analytics/fetchQuizAnalytics";
import Quiz from "./quiz/Quiz";
import { jwtDecode } from "jwt-decode";
import "./index.css";

const isAuthenticated = () => {
  // Get the token from local storage
  const token = localStorage.getItem("token");

  // If there's no token, return false
  if (!token) return false;

  try {
    // Decode the token
    const decodedToken = jwtDecode(token);

    // Get the current time and the token's expiry time
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
    const expiryTime = decodedToken.exp; // Expiry time in seconds

    // Check if the token has expired
    return currentTime < expiryTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute
            element={<Dashboard />}
            isAuthenticated={isAuthenticated}
          />
        ),
        loader: dashboardLoader,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute
            element={<Dashboard />}
            isAuthenticated={isAuthenticated}
          />
        ),
        loader: dashboardLoader,
      },
      {
        path: "createQuiz",
        element: (
          <PrivateRoute
            element={<CreateQuiz />}
            isAuthenticated={isAuthenticated}
          />
        ),
      },
      {
        path: "analytics",
        element: (
          <PrivateRoute
            element={<Analytics />}
            isAuthenticated={isAuthenticated}
          />
        ),
        loader: fetchAnalytics,
      },
      {
        path: "analytics/:quizAnalyticsId",
        element: (
          <PrivateRoute
            element={<QuizAnalytics />}
            isAuthenticated={isAuthenticated}
          />
        ),
        loader: fetchQuizAnalytics, // Attach the loader function
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />, // Redirects to /auth/login by default
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/quiz/:quizId", // Independent route for Quiz component
    element: <Quiz />, // No authentication or layout needed
  },
]);

function App() {
  return (
    <>
      <RouterProvider
        router={router}
        fallback={<div className="loadingSpinner"></div>}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
