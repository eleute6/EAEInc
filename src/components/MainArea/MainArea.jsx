import React from "react";
import "./MainArea.css";

function MainArea() {
  return (
    <div className="Main">
      <div classname="Rside">
        <div className="Profile">
          <img
            scr="/MerrimackCollegeLogo.png"
            alt="dp"
            style={{ height: "60px", padding: "1rem" }}
          />
          Erin McNulty
        </div>
        <div className="pro"></div>
        <div className="MainArea">
          <div className="message">
            <div className="Post">
              <img src="MerrimackCollegeLogo.png" alt="PIC" />
              <input type="Mind" placeholder="Search" />
            </div>
          </div>
        </div>
        <div className="Posted">
          <div className="test"></div>
        </div>
      </div>
    </div>
  );
}

export default MainArea;
