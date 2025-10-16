import React, { useState } from "react";
import "./NavBar.css";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/mchorizontalreversecmykjpg.jpg"
          alt="Merrimack College Logo"
          className="navbar-logo"
        />
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <a href="#dashboard">Dashboard</a>
        <a href="#forum">Forum</a>
        <a href="#instruments">Instrument Consortium</a>
        <a href="#admin">Admin</a>
      </div>

      <div className="navbar-right">
        <a href="#profile">Profile</a>
      </div>
    </nav>
  );
}

export default NavBar;
