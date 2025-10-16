import ProfileCard from "./ProfileCard";
import Forum from "./Forum";
import InstrumentConsortium from "./InstrumentConsortium";
import AdminContent from "./AdminContent";

function Dashboard() {
  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        padding: "20px",
      }}
    >
      <ProfileCard />
      <Forum />
      <InstrumentConsortium />
      <AdminContent />
    </div>
  );
}

export default Dashboard;
