import React from "react";

const TweetCard = ({ tweet, currentUser, onDeleteTweet }) => {
  console.log("Tweet Data:", tweet); 
  const username = tweet.username || "Unknown User";
  const screenName = tweet.username || "unknown";

  return (
    <div className="tweet position-relative">
      {currentUser === tweet.username && (
        <button
          className="delete-tweet-btn"
          onClick={() => onDeleteTweet(tweet.id)}
          aria-label="Delete tweet"
        >
          &times;
        </button>
      )}
      <div className="tweet-header">
        <a className="tweet-username" href={`/users/${username}/tweets`}>{username}</a>{" "}
        <a className="tweet-screenName" href={`/users/${username}/tweets`}>@{screenName}</a>
      </div>
      <p>{tweet.message}</p>
      {tweet.image && <img src={tweet.image} alt="Attached" />}
    </div>
  );
};

export default TweetCard;
