import React, { useRef, useState, useEffect } from "react";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import Forum from "./components/Forum.jsx";

function App() {
  const profileRef = useRef(null);
  const [profileWidth, setProfileWidth] = useState(250); // default width

  useEffect(() => {
    const updateWidth = () => {
      if (profileRef.current) {
        setProfileWidth(profileRef.current.offsetWidth);
      }
    };

    // run after paint to ensure width is measured
    const id = requestAnimationFrame(updateWidth);
    window.addEventListener("resize", updateWidth);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <>
      <NavBar />
      <ProfileCard ref={profileRef} />
      <Forum profileWidth={profileWidth} />
      <Footer />
    </>
  );
}

export default App;
