import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "./validators";

import "./Signup.css";

const Signup = function () {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear the error when the user starts typing
    setErrors({ ...errors, [name]: "" });
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    };

    if (!validateName(formData.name)) {
      newErrors.name = "Name should contain at least 5 characters";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Weak password";
    }
    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const data = await response.json();
      console.log("User signed up:", data);

      // Redirect to the login page after successful signup
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during signup:", error);
      // You can update the UI with an error message here if needed
    }
  };

  const getInputValue = (fieldName) => {
    return errors[fieldName] ? "" : formData[fieldName];
  };

  const getPlaceholderText = (fieldName) => {
    return errors[fieldName] ? errors[fieldName] : "";
  };

  const getInputClass = (fieldName) => (errors[fieldName] ? "input-error" : "");

  return (
    <div className="signup-form">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="label-container">
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-container">
            <input
              id="email"
              type="email"
              name="email"
              value={getInputValue("email")}
              onChange={handleChange}
              placeholder={getPlaceholderText("email")}
              className={getInputClass("email")}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="label-container">
            <label htmlFor="name">Name</label>
          </div>
          <div className="input-container">
            <input
              id="name"
              type="text"
              name="name"
              value={getInputValue("name")}
              onChange={handleChange}
              placeholder={getPlaceholderText("name")}
              className={getInputClass("name")}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="label-container">
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-container">
            <input
              id="password"
              type="password"
              name="password"
              value={getInputValue("password")}
              onChange={handleChange}
              placeholder={getPlaceholderText("password")}
              className={getInputClass("password")}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="label-container">
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <div className="input-container">
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={getInputValue("confirmPassword")}
              onChange={handleChange}
              placeholder={getPlaceholderText("confirmPassword")}
              className={getInputClass("confirmPassword")}
              required
            />
          </div>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
