import React from "react";

const TweetCard = ({ tweet, currentUser, onDeleteTweet }) => {
  console.log("Tweet Data:", tweet); 
  const username = tweet.username || "Unknown User";
  const screenName = tweet.username || "unknown";

  return (
    <div className="tweet">
      <div className="tweet-header">
        <span className="tweet-username">{username}</span>{" "}
        <span className="tweet-screenName">@{screenName}</span>
        {currentUser === tweet.username && (
          <button
            className="delete-tweet-btn"
            onClick={() => onDeleteTweet(tweet.id)}
          >
            Delete
          </button>
        )}
      </div>
      <p>{tweet.message}</p>
      {tweet.image && <img src={tweet.image} alt="Attached" />}
    </div>
  );
};

export default TweetCard;

