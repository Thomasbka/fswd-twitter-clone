import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import TweetCard from "./TweetCard";
import TweetInput from "./TweetInput";
import { safeCredentials, handleErrors } from "./utils/fetchHelper";
import CableApp from "./utils/cable";
import "./styles/feeds.scss";

const Feeds = () => {
  const [tweets, setTweets] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({ tweets: 0, following: 0, followers: 0 });
  const [loadingTweets, setLoadingTweets] = useState(true);

  useEffect(() => {
    authenticateUser();
    fetchTweets();

    const subscription = CableApp.cable.subscriptions.create(
      { channel: "TweetsChannel" },
      {
        connected() {
          console.log("Connected to TweetsChannel");
        },
        disconnected() {
          console.error("Disconnected from TweetsChannel");
        },
        received: (data) => {
          console.log("New tweet received via WebSocket:", data);
          setTweets((prevTweets) => {
            if (!prevTweets.some((tweet) => tweet.id === data.id)) {
              return [data, ...prevTweets];
            }
            return prevTweets;
          });
        },
        rejected() {
          console.error("Subscription to TweetsChannel rejected.");
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const authenticateUser = async () => {
    try {
      const response = await fetch("/api/sessions/authenticated", safeCredentials());
      const data = await handleErrors(response);

      if (data.authenticated) {
        setCurrentUser(data.user.username);
        fetchUserStats(data.user.username);
      } else {
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      window.location.replace("/");
    }
  };

  const fetchTweets = async () => {
    try {
      const response = await fetch("/api/tweets", safeCredentials());
      const data = await handleErrors(response);
      setTweets(data);
    } catch (error) {
      console.error("Error fetching tweets:", error);
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

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await fetch("/api/tweets", {
        method: "POST",
        body: formData,
        ...safeCredentials(),
      });
      await handleErrors(response);
      fetchTweets();
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
      fetchTweets();
      fetchUserStats(currentUser);
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span id="user-icon">User</span></a>
              <ul className="dropdown-menu row" role="menu">
                <li ><a href="#" className="username">User</a></li>
                <li role="presentation" className="divider"></li>
                <li ><a href="#">Lists</a></li>
                <li role="presentation" className="divider"></li>
                <li ><a href="#">Help</a></li>
                <li ><a href="#">Keyboard shortcuts</a></li>
                <li role="presentation" className="divider"></li>
                <li ><a href="#">Settings</a></li>
                <li ><a id="log-out" href="#">Log out</a></li>
              </ul>
            </li>
          </ul>
          <div className="search-bar col-xs-3 nav navbar-right">
            <div className="input-group">
              <input type="text" className="form-control search-input" placeholder="Search for..."/>
              <span className="input-group-btn">
                <button className="btn btn-default search-btn" type="button">Go!</button>
              </span>
            </div>
          </div>
        </div>
      </nav>
    <div>
    </div>
      <div className="feeds-container">
        <div className="col-left">
          <div className="profileCard">
            <div className="user-field">
              <a className="username" href="#">
                {currentUser}
              </a>
              <br />
              <a className="screenName" href="#">
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

export default Feeds;
