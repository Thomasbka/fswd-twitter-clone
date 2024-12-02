import React, { useState } from "react";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: formData }),
      });

      if (response.ok) {
        setSuccess(true);
        setErrors([]);
        setFormData({ username: "", email: "", password: "" });
        if (onSignupSuccess) onSignupSuccess();
      } else {
        const data = await response.json();
        setErrors(data.errors || ["An error occurred. Please try again."]);
      }
    } catch (error) {
      setErrors(["An unexpected error occurred. Please try again."]);
    }
  };

  return (
    <div className="sign-up col-xs-4 col-xs-offset-1">
      <h2>Sign Up</h2>
      {success && <p className="success-message">Signup successful! Please log in.</p>}
      {errors.length > 0 && (
        <ul className="error-messages">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            className="form-control username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-control password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button id="sign-up-btn" type="submit" className="btn btn-default btn-warning pull-right">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
