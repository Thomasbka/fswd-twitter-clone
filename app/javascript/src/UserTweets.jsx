import React, { useState, useEffect } from "react";
import TweetCard from "./TweetCard";
import TweetInput from "./TweetInput";
import { safeCredentials, handleErrors } from "./utils/fetchHelper";
import "./styles/feeds.scss";

const UserTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({ tweets: 0, following: 0, followers: 0 });
  const [loadingTweets, setLoadingTweets] = useState(true);

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserTweets(currentUser);
      fetchUserStats(currentUser);
    }
  }, [currentUser]);

  const authenticateUser = async () => {
    try {
      const response = await fetch("/api/sessions/authenticated", safeCredentials());
      const data = await handleErrors(response);

      if (data.authenticated) {
        setCurrentUser(data.user.username);
      } else {
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      window.location.replace("/");
    }
  };

  const fetchUserTweets = async (username) => {
    try {
      const response = await fetch(`/api/users/${username}/tweets`, safeCredentials());
      const data = await handleErrors(response);
      
      const transformedTweets = data.map((tweet) => ({
        ...tweet,
        username: tweet.user?.username || "Unknown",
      }));
      
      setTweets(transformedTweets);
    } catch (error) {
      console.error("Error fetching user tweets:", error);
    } finally {
      setLoadingTweets(false);
    }
  };
  

  const fetchUserStats = async (username) => {
    try {
      const response = await fetch(`/api/users/${username}`, safeCredentials());
      const data = await handleErrors(response);
      setUserStats({
        tweets: data.tweets.length,
        following: data.following_count || 0,
        followers: data.followers_count || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handlePostTweet = async (message, image) => {
    const formData = new FormData();
    if (message) formData.append("tweet[message]", message);
    if (image) formData.append("tweet[image]", image);

    try {
      const response = await fetch("/api/tweets", {
        method: "POST",
        body: formData,
        ...safeCredentials(),
      });
      await handleErrors(response);
      fetchUserTweets(currentUser);
      fetchUserStats(currentUser);
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };

  const handleDeleteTweet = async (id) => {
    try {
      const response = await fetch(`/api/tweets/${id}`, {
        method: "DELETE",
        ...safeCredentials(),
      });
      await handleErrors(response);
      fetchUserTweets(currentUser);
      fetchUserStats(currentUser);
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/sessions", {
        method: "DELETE",
        ...safeCredentials(),
      });
      await handleErrors(response);
      console.log("User successfully logged out.");
      window.location.replace("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="user-tweets-page">
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown position-relative">
              <a
                href="#"
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span id="user-icon" className="text-dark">{currentUser || "User"}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="/feeds">Feed</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a
                    className="dropdown-item"
                    id="log-out"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Log out
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      <div className="feeds-container">
        <div className="col-left">
          <div className="profileCard">
            <div className="user-field">
              <a className="username" href={`/users/${currentUser}/tweets`}>
                {currentUser}
              </a>
              <br />
              <a className="screenName" href={`/users/${currentUser}/tweets`}>
                @{currentUser}
              </a>
            </div>
            <div className="user-stats">
              <div>
                <p>Tweets</p>
                <span>{userStats.tweets}</span>
              </div>
              <div>
                <p>Following</p>
                <span>{userStats.following}</span>
              </div>
              <div>
                <p>Followers</p>
                <span>{userStats.followers}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-center">
          <TweetInput onPostTweet={handlePostTweet} />
          <div className="tweets">
            {loadingTweets ? (
              <p>Loading tweets...</p>
            ) : (
              tweets.map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  currentUser={currentUser}
                  onDeleteTweet={handleDeleteTweet}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTweets;
