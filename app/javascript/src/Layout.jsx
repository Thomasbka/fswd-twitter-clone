import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <i className="fa fa-twitter"></i> Twitter Clone
            </a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/feeds">Feeds</Link>
            </li>
            <li>
              <a href="#">Log Out</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main container for dynamic content */}
      <div className="container" style={{ marginTop: "60px" }}>
        {children}
      </div>
    </>
  );
};

export default Layout;
