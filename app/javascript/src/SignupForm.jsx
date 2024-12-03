import React, { useState } from "react";
import { safeCredentials, handleErrors } from "./utils/fetchHelper";
import './styles/signupform.scss';

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
        <form>
          <p><strong>New to Twitter?</strong><span> Sign Up</span></p>
          <div className="form-group">
            <input type="text" className="form-control username" placeholder="Username" />
          </div>
          <div className="form-group mt-3">
            <input type="email" className="form-control email" placeholder="Email" />
          </div>
          <div className="form-group mt-3">
            <input type="password" className="form-control password" placeholder="Password" />
          </div>
          <button id="sign-up-btn" className="btn btn-warning pull-right mt-2">Sign up for Twitter</button>
        </form>
      </div>
    );
  };
  
export default SignupForm;
