// file: validation.js
export const validateName = (name) => name.length >= 5;
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (password) =>
  /[A-Za-z]/.test(password) && /\d/.test(password);
export const validateConfirmPassword = (password, confirmPassword) =>
  password === confirmPassword;
