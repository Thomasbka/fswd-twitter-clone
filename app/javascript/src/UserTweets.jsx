import React, { useState, useEffect } from "react";
import { safeCredentials, handleErrors } from "./utils/fetchHelper";
import TweetCard from "./TweetCard";
import "./styles/feeds.scss";

const UserTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingTweets, setLoadingTweets] = useState(true);

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserTweets(currentUser);
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
      setTweets(data);
    } catch (error) {
      console.error("Error fetching user tweets:", error);
    } finally {
      setLoadingTweets(false);
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
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  return (
    <div className="user-tweets-page">
      <h1>{currentUser}'s Tweets</h1>
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
  );
};

export default UserTweets;
