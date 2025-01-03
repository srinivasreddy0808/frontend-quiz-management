import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function PrivateRoute({ element, isAuthenticated }) {
  // Check authentication immediately without state
  const isAuth = isAuthenticated();

  // Directly return based on auth status
  return isAuth ? element : <Navigate to="/auth/login" replace />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default PrivateRoute;
