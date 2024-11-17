import { NavLink, Outlet } from "react-router-dom";
import "./AuthLayout.css";

const AuthLayout = function () {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <header>
          <h1>Quizzie</h1>
        </header>
        <div className="auth-nav">
          <div className="auth-nav-container">
            <div className="auth-nav-container-signup">
              <NavLink
                to="/auth/signup"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Sign Up
              </NavLink>
            </div>
            <div className="auth-nav-container-login">
              <NavLink
                to="/auth/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Log In
              </NavLink>
            </div>
          </div>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
