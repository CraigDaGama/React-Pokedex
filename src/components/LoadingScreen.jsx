import React from "react";
import "../styles/loading.css";

function LoadingScreen({ progress }) {
  return (
    <div className="loading-screen">
      <div className="logo-container">
        <img
          src="/logo/pokedex.png"
          alt="Pokedex"
          className="pokedex-logo"
        />
        <div className="loading-text">Loading Pokédex...</div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
