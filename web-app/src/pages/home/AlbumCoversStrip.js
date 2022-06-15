import React from "react";

export default () => (
  <div style={{ overflow: "hidden", width: "250%", maxHeight: "50vh" }}>
    <div class="album_covers_background" />
    <div
      style={{
        position: "absolute",
        top: "10vh",
        left: 0,
        right: 0,
        zIndex: 1,
        textAlign: "center",
      }}
    >
      <img
        src={process.env.PUBLIC_URL + "/cassette.png"}
        style={{ width: 60, padding: 5 }}
      />
      <p
        style={{
          fontSize: "xxx-large",
          margin: 0,
        }}
      >
        tuner
      </p>
    </div>
    <div id="album_covers_strip_overlay" />
  </div>
);
