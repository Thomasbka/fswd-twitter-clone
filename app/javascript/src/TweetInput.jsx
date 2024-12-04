import React, { useState } from "react";

const TweetInput = ({ onPostTweet }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [charCount, setCharCount] = useState(140);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setMessage(text);
    setCharCount(140 - text.length);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPostTweet(message, image);
    setMessage("");
    setImage(null);
    setCharCount(140);
  };

  return (
    <div className="post-tweet-box">
      <form onSubmit={handleSubmit} className="tweet-form">
        <textarea
          className="tweet-input"
          placeholder="What's happening?"
          maxLength="140"
          value={message}
          onChange={handleInputChange}
        />
        <div className="tweet-actions">
          <label htmlFor="image-select" className="upload-image-text">
            Upload image
          </label>
          <input
            type="file"
            id="image-select"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <span className="post-char-counter">{charCount}</span>
          <button
            className="btn btn-primary"
            disabled={message.length === 0 || message.length > 140}
          >
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
};

export default TweetInput;
