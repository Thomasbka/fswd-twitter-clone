import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import TweetCard from "./TweetCard";
import TweetInput from "./TweetInput";
import { safeCredentials, handleErrors } from "../utils/fetchHelper";
import CableApp from "../utils/cable";
import "../src/styles/feeds.scss";

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
    <Layout navbarProps={{ showUserMenu: true, showSearchBar: true }}>
      <div className="row">
        <div className="col-xs-3 profile-trends">
          <div className="profileCard col-xs-12">
            <div className="profileCard-content">
              <div className="user-field col-xs-12">
                <a className="username" href="#">
                  {currentUser}
                </a>
                <br />
                <a className="screenName" href="#">
                  @{currentUser}
                </a>
              </div>
              <div className="user-stats">
                <div className="col-xs-3">
                  <a href="#">
                    <span>Tweets<br /></span>
                    <span className="user-stats-tweets">{userStats.tweets}</span>
                  </a>
                </div>
                <div className="col-xs-4">
                  <a href="#">
                    <span>Following<br /></span>
                    <span className="user-stats-following">{userStats.following}</span>
                  </a>
                </div>
                <div className="col-xs-4">
                  <a href="#">
                    <span>Followers<br /></span>
                    <span className="user-stats-followers">{userStats.followers}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-6 feed-box">
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
    </Layout>
  );
};

export default Feeds;
