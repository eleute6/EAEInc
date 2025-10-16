import React, { forwardRef } from "react";

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
    </div>
  );
});

export default ProfileCard;
