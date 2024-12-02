import React from "react";
import Layout from "./Layout";

const Feeds = () => {
  return (
    <Layout navbarProps={{ showUserMenu: true, showSearchBar: true }}>
      <div className="row">
        <div className="col-xs-3 profile-trends">
          <div className="profileCard col-xs-12">
            <div className="profileCard-content">
              <div className="user-field col-xs-12">
                <a className="username" href="#">User</a><br />
                <a className="screenName" href="#">@User</a>
              </div>
              <div className="user-stats">
                <div className="col-xs-3">
                  <a href="">
                    <span>Tweets<br /></span>
                    <span className="user-stats-tweets">10</span>
                  </a>
                </div>
                <div className="col-xs-4">
                  <a href="">
                    <span>Following<br /></span>
                    <span className="user-stats-following">0</span>
                  </a>
                </div>
                <div className="col-xs-4">
                  <a href="">
                    <span>Followers<br /></span>
                    <span className="user-stats-followers">0</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-6 feed-box">
          <div className="col-xs-12 post-tweet-box">
            <textarea
              type="text"
              className="form-control post-input"
              rows="3"
              placeholder="What's happening?"
            ></textarea>
            <div className="pull-right">
              <label id="upload-image-btn" htmlFor="image-select">Upload image</label>
              <input type="file" id="image-select" name="image" accept="image/*" />
              <span className="post-char-counter">140</span>
              <button className="btn btn-primary" disabled id="post-tweet-btn">
                Tweet
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feeds;
