import React from "react";
import "../styles/pokemoncard.css";

function PokemonCard({ pokemon, onClick }) {
  const formattedId = pokemon.id.toString().padStart(3, "0");

  return (
    <div className="pokemon-card" onClick={() => onClick(pokemon)}>
      <img
        src={`/sprites/${formattedId}.gif`}
        alt={pokemon.name}
        className="pokemon-image"
      />
      <div className="pokemon-info">
        <p className="pokemon-id">#{formattedId}</p>
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
