import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function PrivateRoute({ element, isAuthenticated }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication status synchronously
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    setAuthChecked(true);
  }, [isAuthenticated]);

  if (!authChecked) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return isAuth ? element : <Navigate to="/auth/login" />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default PrivateRoute;
