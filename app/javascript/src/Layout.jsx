import React from "react";
import { Link } from "react-router-dom";
import "./styles/layout.scss";

const Layout = ({ children }) => {
  return (
    <>
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/feeds">Feeds</Link></li>
            <li><a href="#">Log Out</a></li>
          </ul>
        </div>
      </nav>
      <div className="container" style={{ marginTop: "60px" }}>
        {children}
      </div>
    </>
  );
};

export default Layout;
