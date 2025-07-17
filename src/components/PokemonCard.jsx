import React from "react";
import "../styles/pokemoncard.css"; // We'll style this separately

function PokemonCard({ pokemon, onClick }) {
  const primaryType = pokemon.types[0]?.toLowerCase() || "normal";

  return (
    <div className={`pokemon-card ${primaryType}`} onClick={onClick}>
      <span className="pokemon-id">#{String(pokemon.id).padStart(3, "0")}</span>
      <img
        src={`/sprites/${pokemon.id.toString().padStart(3, '0')}.gif`}
        alt={pokemon.name}
        className="pokemon-image"
      />
      <h3 className="pokemon-name">{pokemon.name}</h3>
      <div className="pokemon-types">
        {pokemon.types.map((type) => (
          <span className={`type-tag ${type.toLowerCase()}`} key={type}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PokemonCard;
