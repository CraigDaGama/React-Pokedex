import React, { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { TYPE_COLORS } from "../utils/constants";
import "../styles/pokemoncard.css";

function PokemonCard({ pokemon, onClick }) {
  const { darkMode } = useTheme();

  // Format ID to 3 digits (e.g. 001)
  const formattedId = pokemon.id.toString().padStart(3, "0");

  // Get background style based on types
  const bgStyle = useMemo(() => {
    const types = pokemon.types || [];
    if (types.length === 1) {
      return { backgroundColor: TYPE_COLORS[types[0]] || "#777" };
    } else if (types.length >= 2) {
      const color1 = TYPE_COLORS[types[0]] || "#777";
      const color2 = TYPE_COLORS[types[1]] || "#777";
      return { background: `linear-gradient(135deg, ${color1}, ${color2})` };
    }
    return { backgroundColor: "#777" };
  }, [pokemon.types]);

  // Use PokeAPI CDN for official artwork or animated sprites (optional: make this a helper)
  // We'll stick to local GIFs request for now OR switch to CDN as requested.
  // Plan said: Switch to CDN.
  // Animated (Gen 5 BW): https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/{id}.gif
  // Fallback to static if ID > 649 (Gen 5 limit for these specific GIFs) or check availability? 
  // For safety/reliability, let's use the official artwork for static cards, or High Res PNGs.

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div
      className={`pokemon-card ${darkMode ? "dark" : "light"}`}
      onClick={() => onClick(pokemon)}
    >
      <div className="pokemon-card-top" style={bgStyle}>
        <div className="card-overlay" /> {/* Glass effect overlay */}
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className="pokemon-image"
          loading="lazy"
        />
      </div>
      <div className="pokemon-card-bottom">
        <p className="pokemon-id">#{formattedId}</p>
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="type-badge"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
