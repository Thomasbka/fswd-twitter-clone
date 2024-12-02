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
    <div className="tweet-input">
      <textarea
        className="form-control post-input"
        placeholder="What's happening?"
        value={message}
        onChange={handleInputChange}
      />
      <span className="post-char-counter">{charCount}</span>
      <input type="file" onChange={handleImageChange} />
      <button
        className="btn btn-primary"
        disabled={message.length === 0 || message.length > 140}
        onClick={handleSubmit}
      >
        Tweet
      </button>
    </div>
  );
};

export default TweetInput;
