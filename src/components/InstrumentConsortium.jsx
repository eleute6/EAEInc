import ContributionLeaderboard from "./ContributionLeaderboard.jsx";

function InstrumentConsortium() {
  return (
    <div
      className="right-column"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Top content */}
      <div style={{ padding: "10px" }}>
        <h3>Instrument Consortium</h3>
        <p>File uploads and downloads go here</p>
      </div>

      {/* Leaderboard at bottom */}
      <ContributionLeaderboard />
    </div>
  );
}

export default InstrumentConsortium;
