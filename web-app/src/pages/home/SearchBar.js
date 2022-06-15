import React from "react";

export default ({ setQuery, submitSearch }) => (
  <div
    style={{
      position: "absolute",
      top: "30vh",
      display: "flex",
      width: "100vw",
      maxWidth: "100vw",
      overflow: "hidden",
      flexWrap: "wrap",
    }}
  >
    <input
      placeholder="get the best music deals here..."
      onChange={(e) => setQuery(e.target.value)}
      style={{
        border: "none",
        flex: "6",
        color: "white",
        fontSize: "x-large",
        background: "rgba(0,0,0,0.3)",
        padding: "18px",
      }}
    />
    <button onClick={submitSearch} style={{ flex: "1" }}>
      search
    </button>
  </div>
);
