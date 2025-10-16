import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Footer from "./components/Footer.jsx";
import NavBar from "./components/NavBar.jsx";
import ProfileCard from "./components/ProfileCard.jsx";

function App() {
  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", marginTop: "60px" }}>
        <ProfileCard />
        <div className="main-content"></div>
        <Sidebar />
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
}

export default App;
