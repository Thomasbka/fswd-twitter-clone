import React from "react";

const TweetCard = ({ tweet, currentUser, onDeleteTweet }) => {
  return (
    <div className="tweet">
      <strong>{tweet.username}</strong>
      <span>@{tweet.username}</span>
      {tweet.image && <img src={tweet.image} alt="Tweet" className="tweet-image" />}
      <p>{tweet.message}</p>
      {tweet.username === currentUser && (
        <button
          className="btn btn-danger"
          onClick={() => onDeleteTweet(tweet.id)}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default TweetCard;
