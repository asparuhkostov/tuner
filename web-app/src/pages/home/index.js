import React, { useState } from "react";
import axios from "axios";

import { Page } from "../../components";
import AlbumCoversStrip from "./AlbumCoversStrip";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

const API_URL = process.env.API_URL || "http://localhost:5000";

const LoadingMessage = ({ msg }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <p style={{ textAlign: "center" }}>
      {msg}
      <br />
    </p>
  </div>
);

const Home = () => {
  const [query, setQuery] = useState("");
  const [isLoadingAlbumData, setLoadingAlbumData] = useState(false);
  const [isLoadingPriceData, setLoadingPriceData] = useState(false);
  const [albumData, setAlbumData] = useState();
  const [results, setResults] = useState([]);

  const submitSearch = () => {
    setAlbumData();
    setResults([]);

    setLoadingAlbumData(true);

    axios({
      method: "POST",
      url: API_URL + "/getRecordData",
      data: {
        item: query,
      },
    })
      .then((res) => {
        setLoadingAlbumData(false);
        setAlbumData(res.data.albumData);
        if (res.data.albumData.title) {
          setLoadingPriceData(true);
          axios({
            method: "POST",
            url: API_URL + "/getRecordPriceRange",
            data: {
              item: res.data.albumData.title,
            },
          })
            .then((res) => {
              setLoadingPriceData(false);
              setResults(res.data);
              console.log(res.data);
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Page>
      <AlbumCoversStrip />
      <SearchBar setQuery={setQuery} submitSearch={submitSearch} />
      {isLoadingAlbumData && <LoadingMessage msg={"...loading album data"} />}
      {isLoadingPriceData && <LoadingMessage msg={"...loading pricing data"} />}
      <SearchResults albumData={albumData} results={results} />
    </Page>
  );
};

export default Home;
