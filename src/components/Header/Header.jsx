import React, { useState } from "react";
import "./Header.css";
import MainArea from "../MainArea/MainArea.jsx";

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
          <a href="#uploads">Upload Instruments</a>

          <a href="#admin">Admin</a>
        </div>
      </div>
      <MainArea />
    </div>
  );
}

export default Header;
