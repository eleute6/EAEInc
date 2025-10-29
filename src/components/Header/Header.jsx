import React, { useState } from "react";
import "./Header.css";

function Header() {
  return (
    <div className="HomePage">
      <div className="header">
        <div className="first-Header">
          <div className="logo">
            <img
              src="/MerrimackCollegeLogo.png"
              alt="logo"
              style={{ height: "50px", padding: "1rem" }}
            />
          </div>
        </div>

        <div className="middle-header">
          <a href="#home">Home</a>
          <a href="#instruments">Instrument Consortium</a>
          <a href="#admin">Admin</a>
        </div>
      </div>
    </div>
  );
}

export default Header;
