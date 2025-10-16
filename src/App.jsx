import React from "react";
import "./App.css";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import Forum from "./components/Forum.jsx";
import InstrumentConsortium from "./components/InstrumentConsortium.jsx"; // import it

function App() {
  return (
    <>
      <NavBar />
      <div className="main-layout">
        <ProfileCard /> {/* Left column */}
        <Forum /> {/* Middle column */}
        <InstrumentConsortium /> {/* Right column */}
      </div>
      <Footer />
    </>
  );
}

export default App;
