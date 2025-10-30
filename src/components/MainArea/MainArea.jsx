import React from "react";
import "./MainArea.css";

function MainArea() {
  return (
    <div className="Main">
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

      <div className="MainArea">
        <div className="Post">
          <img src="/MerrimackCollegeLogo.png" alt="profile" />
          <input type="text" placeholder="What's on your mind?" />
        </div>

        <div className="Posted">
          <div className="poster">
            <img src="/MerrimackCollegeLogo.png" alt="profile" />
            <p>
              <strong>John Doe</strong>
            </p>
          </div>
          <p className="content">Just a placeholder post to test the layout!</p>
        </div>

        <div className="Posted">
          <div className="poster">
            <img src="/MerrimackCollegeLogo.png" alt="profile" />
            <p>
              <strong>Jane Smith</strong>
            </p>
          </div>
          <p className="content">Another example of a post in the feed.</p>
        </div>
      </div>

      <div className="Rside">
        <p>Right side content (placeholder)</p>
      </div>
    </div>
  );
}

export default MainArea;
