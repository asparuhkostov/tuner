import React from "react";
import styled from "styled-components";
import media from "../../config/media";

const ResponsiveResultsContainer = styled.div`
  padding: 0 5vh;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  ${media.tablet`
    flex-direction: row;
  `}
  ${media.phone`
    flex-direction: column;
  `}
`;

const musicalSymbolStyle = {
  maxWidth: 25,
  display: "flex",
  alignSelf: "center",
  margin: "5vh 0",
};

const Item = ({ content }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
    }}
  >
    {content.vendor === "Value Your Music" ? (
      <img
        src={process.env.PUBLIC_URL + "/musical_key.png"}
        style={musicalSymbolStyle}
      />
    ) : (
      <img
        src={process.env.PUBLIC_URL + "/musical_note.png"}
        style={musicalSymbolStyle}
      />
    )}
    {content.vendor === "Value Your Music" ? (
      <p class="album_data_field">All time range</p>
    ) : (
      <p class="album_data_field">
        <strong>Vendor</strong>: {content.vendor}
      </p>
    )}
    <br />
    <p class="album_data_field">
      <strong>Highest price</strong>:{" "}
      <a href={content.mostExpensiveItemUrl} target="_blank">
        {content.highestPrice}
      </a>
    </p>
    <br />
    <p class="album_data_field">
      <strong>Lowest price</strong>:{" "}
      <a href={content.leastExpensiveItemUrl} target="_blank">
        {content.lowestPrice}
      </a>
    </p>
    <br />
  </div>
);

export default ({ albumData, results }) => (
  <div>
    <ResponsiveResultsContainer>
      <div style={{ flex: 2, padding: "5vh" }}>
        <img
          src={albumData ? albumData.cover_image : ""}
          style={{ maxWidth: "100%" }}
        />
      </div>
      {albumData ? (
        <div
          style={{
            flex: 4,
            padding: "0 5vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p class="album_data_field">
            <strong>Album</strong>: {albumData.title}
          </p>
          <br />
          <p class="album_data_field">
            <strong>Year</strong>: {albumData.year}
          </p>
          <br />
          <p class="album_data_field">
            <strong>Label(s)</strong>: {albumData.label.join("; ")}
          </p>
          <br />
          <p class="album_data_field">
            <strong>Genre</strong>: {albumData.genre.join(", ")}
          </p>
          <br />
          <p class="album_data_field">
            <strong>Style</strong>: {albumData.style.join(", ")}
          </p>
        </div>
      ) : null}
    </ResponsiveResultsContainer>
    {results.length ? (
      <ResponsiveResultsContainer>
        {results.map((r) => (
          <Item content={r} />
        ))}
      </ResponsiveResultsContainer>
    ) : null}
  </div>
);
