import React from "react";
import "./App.css";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import Forum from "./components/Forum.jsx";

function App() {
  return (
    <>
      <NavBar />
      <div className="main-layout">
        <ProfileCard />
        <Forum />
      </div>
      <Footer />
    </>
  );
}

export default App;
