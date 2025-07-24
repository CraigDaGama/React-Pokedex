// PokemonModal.jsx
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

function PokemonModal({ pokemon, onClose, onPokemonChange }) {
  const { darkMode } = useTheme(); // use dark mode
  
  const [details, setDetails] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [typeAdvantages, setTypeAdvantages] = useState({ strong: [], weak: [] });

  const [isShiny, setIsShiny] = useState(false);
  const [isMega, setIsMega] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  const [hasShiny, setHasShiny] = useState(false);
  const [hasMega, setHasMega] = useState(false);
  const [hasFemale, setHasFemale] = useState(false);

  const formattedId = pokemon.id.toString().padStart(3, "0");

  const checkImageExists = (path) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const getSpritePath = () => {
    const base = `/sprites/${formattedId}`;
    if (isMega && isShiny && hasMega) return `${base}-mega-shiny.gif`;
    if (isMega && hasMega) return `${base}-mega.gif`;
    if (isShiny && hasShiny && isFemale && hasFemale) return `${base}-female-shiny.gif`;
    if (isShiny && hasShiny) return `${base}-shiny.gif`;
    if (isFemale && hasFemale) return `${base}-female.gif`;
    return `${base}.gif`;
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
          evoList.push(chain.species.name);
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

        // Sprite availability
        const base = `/sprites/${formattedId}`;
        const shiny = await checkImageExists(`${base}-shiny.gif`);
        const mega = await checkImageExists(`${base}-mega.gif`) || await checkImageExists(`${base}-mega-shiny.gif`);
        const female = await checkImageExists(`${base}-female.gif`);
        setHasShiny(shiny);
        setHasMega(mega);
        setHasFemale(female);

        setIsShiny(false);
        setIsMega(false);
        setIsFemale(false);
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
      {/* Modal content here */}
    
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Left Side */}
        <div className="modal-left">
          <div className="modal-header">
            <h2 className="modal-id">#{formattedId}</h2>
            <h2>{pokemon.name}</h2>
            <div className="type-pills">
              {pokemon.types.map((type) => (
                <span key={type} className={`type-badge type-${type}`}>{type}</span>
              ))}
            </div>
          </div>

          <div className="sprite-wrapper">
            <img src={getSpritePath()} alt={pokemon.name} className="modal-sprite" />
          </div>

          <div className="toggle-buttons">
            {hasShiny && (
              <button className="icon-button" onClick={() => setIsShiny(!isShiny)} title="Toggle Shiny">
                <img src="/logo/shiny.png" alt="Shiny" />
              </button>
            )}
            {hasMega && (
              <button className="icon-button" onClick={() => setIsMega(!isMega)} title="Toggle Mega">
                <img src="/logo/mega.png" alt="Mega" />
              </button>
            )}
            {hasFemale && (
              <button className="icon-button" onClick={() => setIsFemale(!isFemale)} title="Toggle Female">
                <img src="/logo/gender.png" alt="Female" />
              </button>
            )}
          </div>
          
          <p className="description">{description}</p>

          <div className="info-cards">
            <p><strong>Height:</strong> {details.height / 10} m</p>
            <p><strong>Weight:</strong> {details.weight / 10} kg</p>
            <p><strong>Base XP:</strong> {details.base_experience}</p>
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
              {evolution.map((name) => (
                <div key={name} className="evolution-item">
                  <img
                    src={`/sprites/${name}.gif`}
                    alt={name}
                    onClick={async () => {
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                      const newData = await res.json();
                      onPokemonChange(newData);
                    }}
                  />
                  <p>{name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="advantages">
            <h4>Strong Against</h4>
            <div className="type-list">
              {typeAdvantages.strong.map((type) => (
                <span key={type} className={`type-badge type-${type}`}>{type}</span>
              ))}
            </div>
            <h4>Weak Against</h4>
            <div className="type-list">
              {typeAdvantages.weak.map((type) => (
                <span key={type} className={`type-badge type-${type}`}>{type}</span>
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
