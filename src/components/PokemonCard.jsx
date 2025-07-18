import React from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/pokemoncard.css";

function PokemonCard({ pokemon, onClick }) {
  const { darkMode } = useTheme(); // use dark mode
  const formattedId = pokemon.id.toString().padStart(3, "0");

  const getTypeColorFromClass = (type) => {
    const dummy = document.createElement("span");
    dummy.className = `type-${type.toLowerCase()}`;
    dummy.style.display = "none";
    document.body.appendChild(dummy);
    const color = getComputedStyle(dummy).backgroundColor;
    dummy.remove();
    return color || "#e0e0e0";
  };

  const bgStyle = React.useMemo(() => {
    if (pokemon.types.length === 1) {
      return { backgroundColor: getTypeColorFromClass(pokemon.types[0]) };
    } else {
      const color1 = getTypeColorFromClass(pokemon.types[0]);
      const color2 = getTypeColorFromClass(pokemon.types[1]);
      return { background: `linear-gradient(135deg, ${color1}, ${color2})` };
    }
  }, [pokemon.types]);

  return (
    <div
      className={`pokemon-card ${darkMode ? "dark" : "light"}`}
      onClick={() => onClick(pokemon)}
    >
      <div className="pokemon-card-top" style={bgStyle}>
        <img
          src={`/sprites/${formattedId}.gif`}
          alt={pokemon.name}
          className="pokemon-image"
        />
      </div>
      <div className="pokemon-card-bottom">
        <p className="pokemon-id">#{formattedId}</p>
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
