import "./ProfileCard.css";

function ProfileCard() {
  return (
    <div className="profile-card">
      <img
        src="/profile-placeholder.jpg"
        alt="Profile"
        className="profile-image"
      />
      <h3 className="profile-name">John Doe</h3>
      <div className="profile-score">Contribution Score: 10</div>

      <div className="profile-actions">
        <button>Edit Profile</button>
        <button>Logout</button>
      </div>
    </div>
  );
}

export default ProfileCard;
