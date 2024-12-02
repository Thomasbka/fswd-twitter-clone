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
      const data = await handleErrors(response);

      if (data.authenticated) {
        window.location.replace("/feeds");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      await fetch("/api/sessions", {
        method: "POST",
        body: JSON.stringify({ user: { username, password } }),
        ...safeCredentials(),
      });

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
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <i className="fa fa-twitter"></i>
            </a>
          </div>
        </div>
      </nav>
      <div className="main">
        <div className="container">
          <div className="row">
            <div className="front-card col-xs-10 col-xs-offset-1">
              <div className="col-xs-6 welcome">
                <div id="welcome-text">
                  <h1><strong>Welcome to Twitter.</strong></h1>
                  <p>Connect with your friends — and other fascinating people.</p>
                </div>
              </div>
              <div className="log-in col-xs-4 col-xs-offset-1">
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
                  <div className="form-group col-xs-8">
                    <input
                      type="password"
                      name="password"
                      className="form-control password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <button id="log-in-btn" className="btn btn-default btn-primary">
                    Log in
                  </button>
                </form>
              </div>
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
