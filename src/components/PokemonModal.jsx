import React, { useEffect, useState } from "react";
import "../styles/pokemonmodal.css";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { TYPE_COLORS } from "../utils/constants";
import { fetchPokemonDetails } from "../services/pokeapi";
import { FaArrowRight, FaVolumeUp } from "react-icons/fa";

function PokemonModal({ pokemon, onClose, onPokemonChange }) {
  const { darkMode } = useTheme();

  const [details, setDetails] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [typeAdvantages, setTypeAdvantages] = useState({ strong: [], weak: [] });

  // Removed Shiny state/toggles as per request

  const formattedId = pokemon.id.toString().padStart(3, "0");

  const getSpriteUrl = (id) => {
    // Reverted to Official Artwork as requested
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const playCry = () => {
    if (details?.cries?.latest) {
      const audio = new Audio(details.cries.latest);
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio play failed", e));
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [detailsRes, speciesRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`).then((res) => res.json()),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`).then((res) => res.json()),
        ]);
        setDetails(detailsRes);
        setSpecies(speciesRes);

        // Evolution chain
        const evoRes = await fetch(speciesRes.evolution_chain.url).then((res) => res.json());
        const evoList = [];
        let chain = evoRes.chain;

        while (chain) {
          const urlParts = chain.species.url.split("/");
          const id = urlParts[urlParts.length - 2];
          evoList.push({ name: chain.species.name, id });
          chain = chain.evolves_to[0];
        }
        setEvolution(evoList);

        // Type Relations
        const strong = new Set();
        const weak = new Set();
        for (const type of pokemon.types) {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`).then((r) => r.json());
          res.damage_relations.double_damage_to.forEach((t) => strong.add(t.name));
          res.damage_relations.double_damage_from.forEach((t) => weak.add(t.name));
        }
        setTypeAdvantages({ strong: [...strong], weak: [...weak] });

      } catch (err) {
        console.error("Error fetching modal data:", err);
      }
    };
    fetchDetails();
  }, [pokemon]);

  if (!details || !species) return null;

  const description =
    species.flavor_text_entries.find((entry) => entry.language.name === "en")?.flavor_text.replace(/\f/g, " ") ||
    "";

  const stats = details.stats.map((stat) => ({
    stat: stat.stat.name,
    value: stat.base_stat,
  }));

  return (
    <div className={`pokemon-modal ${darkMode ? "dark" : "light"}`}>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Left Side */}
          <div className="modal-left">
            <div className="modal-header">
              <h2 className="modal-id">#{formattedId}</h2>
              <h2>{pokemon.name}</h2>
              <div className="type-pills">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="type-badge"
                    style={{ backgroundColor: TYPE_COLORS[type] || '#777' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="sprite-wrapper">
              <img
                src={getSpriteUrl(pokemon.id)}
                alt={pokemon.name}
                className="modal-sprite"
              />
            </div>

            {/* Replaced Shiny Toggle with Audio Button to fill space */}
            <div className="modal-actions">
              <button className="cry-button" onClick={playCry} title="Play Cry">
                <FaVolumeUp /> Play Cry
              </button>
            </div>

            <p className="description">{description}</p>

            <div className="info-cards">
              <p><strong>Height:</strong> {details.height / 10} m</p>
              <p><strong>Weight:</strong> {details.weight / 10} kg</p>
              <p><strong>XP:</strong> {details.base_experience}</p>
            </div>

            <div className="abilities-section-card">
              <h3>Abilities</h3>
              <div className="info-cards abilities-inner">
                {details.abilities.map((ability) => (
                  <p key={ability.ability.name} className={ability.is_hidden ? "hidden-ability-text" : ""}>
                    <strong>{ability.is_hidden ? "Hidden" : "Standard"}</strong>
                    {ability.ability.name.replace("-", " ")}
                  </p>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side */}
          <div className="modal-right">
            <div className="radar-chart-container">
              <RadarChart outerRadius={80} width={300} height={250} data={stats}>
                <PolarGrid />
                <PolarAngleAxis dataKey="stat" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Stats" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </div>

            <div className="evolution-chain">
              <h4>Evolution Chain</h4>
              <div className="evolution-list">
                {evolution.map((evo, index) => (
                  <React.Fragment key={evo.name}>
                    <div className="evolution-item">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                        alt={evo.name}
                        onClick={async () => {
                          const newData = await fetchPokemonDetails(evo.name);
                          if (newData) onPokemonChange(newData);
                        }}
                      />
                      <p>{evo.name}</p>
                    </div>
                    {index < evolution.length - 1 && (
                      <FaArrowRight className="evolution-arrow" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="advantages">
              <h4>Strong Against</h4>
              <div className="type-list">
                {typeAdvantages.strong.map((type) => (
                  <span
                    key={type}
                    className="type-badge"
                    style={{ backgroundColor: TYPE_COLORS[type] || '#777' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
              <h4>Weak Against</h4>
              <div className="type-list">
                {typeAdvantages.weak.map((type) => (
                  <span
                    key={type}
                    className="type-badge"
                    style={{ backgroundColor: TYPE_COLORS[type] || '#777' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;
