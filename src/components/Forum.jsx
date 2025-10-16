import React from "react";

function Forum({ profileWidth }) {
  return (
    <div
      className="forum-container"
      style={{
        left: `${profileWidth}px`,
        width: `calc(100% - ${profileWidth}px)`,
      }}
    >
      <div className="forum-header">
        <h3>Forum</h3>
        <p>Search bar will go here</p>
      </div>
      <div className="forum-feed">
        <div className="post">Post 1: How do I submit a proposal?</div>
        <div className="post">Post 2: Tips for data management plans</div>
        <div className="post">Post 3: Example post content</div>
      </div>
      <div className="forum-input">
        <textarea placeholder="Write a new post..." />
        <button>Post</button>
      </div>
    </div>
  );
}

export default Forum;
