import React from "react";
import "../styles/pokemonmodal.css";

function PokemonModal({ isOpen, onClose, pokemon }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{pokemon.name}</h2>
        <img src={pokemon.image} alt={pokemon.name} />
        <p>More details coming soon...</p>
      </div>
    </div>
  );
}

export default PokemonModal;
