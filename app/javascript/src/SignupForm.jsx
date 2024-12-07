import React, { useState } from "react";
import { safeCredentials, handleErrors } from "./utils/fetchHelper";
import "./styles/signupform.scss";

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ user: formData }),
        ...safeCredentials(),
      });
      const data = await handleErrors(response);

      setSuccess(true);
      setErrors([]);
      setFormData({ username: "", email: "", password: "" });

      if (onSignupSuccess) onSignupSuccess();
    } catch (error) {
      console.error("Signup error:", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    }
  };

  return (
    <div className="sign-up col-xs-4 col-xs-offset-1">
      <form onSubmit={handleSubmit}>
        <p><strong>New to Twitter?</strong><span> Sign Up</span></p>
        <div className="form-group">
          <input
            type="text"
            className="form-control username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="email"
            className="form-control email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="password"
            className="form-control password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          id="sign-up-btn"
          className="btn btn-warning pull-right mt-2"
          type="submit"
        >
          Sign up for Twitter
        </button>
      </form>
      {errors.length > 0 && (
        <div className="alert alert-danger mt-3">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {success && (
        <div className="alert alert-success mt-3">
          Signup successful! You can now log in.
        </div>
      )}
    </div>
  );
};

export default SignupForm;
