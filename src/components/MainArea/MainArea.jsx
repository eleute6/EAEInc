import React, { useState } from "react";
import "./MainArea.css";

function MainArea() {
  // State to store the current input text
  const [inputText, setInputText] = useState("");

  // State to store the list of posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "John Doe",
      content: "Just a placeholder post to test the layout!",
    },
    {
      id: 2,
      author: "Jane Smith",
      content: "Another example of a post in the feed.",
    },
  ]);

  // Function to handle posting
  const handlePost = () => {
    if (inputText.trim() === "") return; // ignore empty posts

    const newPost = {
      id: Date.now(), // unique ID
      author: "Erin McNulty",
      content: inputText,
    };

    // Add the new post to the TOP of the list
    setPosts([newPost, ...posts]);

    // Clear the input field
    setInputText("");
  };

  // Allow pressing Enter to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="Main">
      {/* LEFT SIDE PROFILE */}
      <div className="Lside">
        <div className="Profile">
          <img
            src="/MerrimackCollegeLogo.png"
            alt="profile"
            style={{ height: "60px", borderRadius: "50%", margin: "1rem" }}
          />
          <p>Erin McNulty</p>
        </div>
      </div>

      {/* CENTER POSTS FEED */}
      <div className="MainArea">
        {/* Post input bar */}
        <div className="Post">
          <img src="/MerrimackCollegeLogo.png" alt="profile" />
          <input
            type="text"
            placeholder="What's on your mind?"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handlePost} className="postButton">
            Post
          </button>
        </div>

        {/* Render all posts */}
        {posts.map((post) => (
          <div className="Posted" key={post.id}>
            <div className="poster">
              <img src="/MerrimackCollegeLogo.png" alt="profile" />
              <p>
                <strong>{post.author}</strong>
              </p>
            </div>
            <p className="content">{post.content}</p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="Rside">
        <p>Right side content (placeholder)</p>
      </div>
    </div>
  );
}

export default MainArea;
