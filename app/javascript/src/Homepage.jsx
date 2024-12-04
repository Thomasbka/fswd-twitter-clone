import React, { useState, useEffect } from "react";
import SignupForm from "./SignupForm";
import { safeCredentials, handleErrors } from "./utils/fetchHelper";
import "./styles/homepage.scss";

const images = require.context("../images", false, /\.(png|jpe?g|svg)$/);

const Homepage = () => {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const backgroundImages = [
    images("./background_1.png"),
    images("./background_2.png"),
    images("./background_3.jpg"),
  ];

  useEffect(() => {
    authenticateUser();

    const backgroundTimer = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 10000);

    return () => clearInterval(backgroundTimer);
  }, []);

  const authenticateUser = async () => {
    try {
      const response = await fetch("/api/sessions/authenticated", safeCredentials());
      const data = await response.json();
  
      if (data.authenticated) {
        window.location.replace("/feeds");
      } else {
        console.log("User not authenticated:", data);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("handleLogin triggered");
  
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    console.log("Attempting login with:", { username, password });
  
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        body: JSON.stringify({ user: { username, password } }),
        ...safeCredentials(),
      });
  
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
  
      const data = await handleErrors(response);
      console.log("Login response data:", data);
  
      authenticateUser();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  

  return (
    <div
      id="homeback"
      style={{
        backgroundImage: `url(${backgroundImages[backgroundIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a
                href="#"
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                language: <strong>English</strong> <span className="caret"></span>
              </a>
              <ul className="dropdown-menu row" role="menu">
                <li className="col-xs-12"><a href="#">Bahasa Melayu</a></li>
                <li className="col-xs-12"><a href="#">Dansk</a></li>
                <li className="col-xs-12"><a href="#">English</a></li>
                <li className="col-xs-12"><a href="#">Suomi</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container main-content">
        <div className="row align-items-center">
          <div className="col-md-6 welcome-section">
            <h1><strong>Welcome to Twitter.</strong></h1>
            <p>
              Connect with your friends — and other fascinating people. Get
              in-the-moment updates on the things that interest you. And watch
              events unfold, in real time, from every angle.
            </p>
            <p>
              <a 
                href="https://tbka-portfolio.netlify.app/" 
                id="twit-info" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Thomas Andersen - Fullstack Twitter Project
              </a>
            </p>
          </div>
          <div className="col-md-5 auth-section">
            <div className="log-in">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="text"
                    name="username"
                    className="form-control username"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="form-group password-row mt-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control password"
                    placeholder="Password"
                    required
                  />
                  <button id="log-in-btn" className="btn btn-primary">
                    Log in
                  </button>
                </div>
                <div className="form-group">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span> Remember me</span>
                    <span> &#183; </span>
                  </label>
                  <a href="#">Forgot password?</a>
                </div>
              </form>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;