import React, { forwardRef } from "react";
import "./ProfileCard.css";
import UpcomingEvents from "./UpcomingEvents.jsx";

const ProfileCard = forwardRef((props, ref) => {
  return (
    <div className="profile-card" ref={ref}>
      <img
        src="/profile-placeholder.jpg"
        alt="Profile"
        className="profile-image"
      />
      <div className="profile-name">John Doe</div>
      <div className="profile-score">Contribution Score: 10</div>
      <div className="profile-actions">
        <button>Edit Profile</button>
        <button>Logout</button>
      </div>

      {/* Upcoming events below profile */}
      <UpcomingEvents />
    </div>
  );
});

export default ProfileCard;
