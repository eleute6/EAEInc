import React, { useState } from "react";
import "./MainArea.css";

function MainArea() {
  const [inputText, setInputText] = useState("");

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

  // Add a new post
  const handlePost = () => {
    if (inputText.trim() === "") return;

    const newPost = {
      id: Date.now(),
      author: "Erin McNulty",
      content: inputText,
    };

    setPosts([newPost, ...posts]);
    setInputText("");
  };

  // Delete a post by id
  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // Allow Enter to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="Main">
      {/* LEFT SIDE */}
      <div className="Lside">
        <div className="Profile">
          <img
            src="/profiletest.png"
            alt="profile"
            style={{ height: "60px", borderRadius: "50%", margin: "1rem" }}
          />
          <p>Erin McNulty</p>
        </div>
      </div>

      {/* CENTER FEED */}
      <div className="MainArea">
        <div className="Post">
          <img src="/profiletest.png" alt="profile" />
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

        {/* Render posts */}
        {posts.map((post) => (
          <div className="Posted" key={post.id}>
            <div className="poster">
              <div className="poster-left">
                <img src="/profiletest.png" alt="profile" />
                <p>
                  <strong>{post.author}</strong>
                </p>
              </div>
              <button
                className="deleteButton"
                onClick={() => handleDelete(post.id)}
              >
                ✖
              </button>
            </div>
            <p className="content">{post.content}</p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="Rside">
        <p>Resources</p>
      </div>
    </div>
  );
}

export default MainArea;
