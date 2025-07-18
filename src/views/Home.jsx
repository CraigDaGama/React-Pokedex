import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CardGrid from "../components/CardGrid";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    types: [],
    shiny: false,
    mega: false,
  });

  return (
    <>
      <Navbar />
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
      />
      <CardGrid
        searchTerm={searchTerm}
        filters={filters}
      />
    </>
  );
}

export default Home;
