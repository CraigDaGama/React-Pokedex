import React, { useEffect, useState } from "react";
import "../styles/pokemonmodal.css";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

function PokemonModal({ pokemon, onClose }) {
  const [details, setDetails] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [typeAdvantages, setTypeAdvantages] = useState({ strong: [], weak: [] });

  const formattedId = pokemon.id.toString().padStart(3, "0");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [detailsRes, speciesRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`).then((res) => res.json()),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`).then((res) => res.json()),
        ]);
        setDetails(detailsRes);
        setSpecies(speciesRes);

        // Get Evolution Chain
        const evoRes = await fetch(speciesRes.evolution_chain.url).then((res) => res.json());
        const evoList = [];
        let chain = evoRes.chain;

        while (chain) {
          evoList.push(chain.species.name);
          chain = chain.evolves_to[0];
        }
        setEvolution(evoList);

        // Type Advantages
        const strong = new Set();
        const weak = new Set();
        for (const type of pokemon.types) {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`).then((r) => r.json());
          res.damage_relations.double_damage_to.forEach((t) => strong.add(t.name));
          res.damage_relations.double_damage_from.forEach((t) => weak.add(t.name));
        }
        setTypeAdvantages({
          strong: [...strong],
          weak: [...weak],
        });
      } catch (err) {
        console.error("Error fetching modal data:", err);
      }
    };

    fetchDetails();
  }, [pokemon]);

  if (!details || !species) return null;

  const description =
    species.flavor_text_entries.find((entry) => entry.language.name === "en")?.flavor_text.replace(/\f/g, " ") || "";

  const stats = details.stats.map((stat) => ({
    stat: stat.stat.name,
    value: stat.base_stat,
  }));

  const spriteUrl = `/sprites/${formattedId}.gif`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Left */}
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
          <img src={spriteUrl} alt={pokemon.name} className="modal-sprite" />
          <div className="toggle-buttons">
            {/* Add toggle buttons if you implement shiny/mega */}
          </div>
          <p className="description">{description}</p>
        </div>

        {/* Right */}
        <div className="modal-right">
          <div className="radar-chart-container">
            <RadarChart outerRadius={80} width={300} height={250} data={stats}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stat" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar name="Stats" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </div>

          <div className="info-cards">
            <p><strong>Height:</strong> {details.height / 10 || "?"} m</p>
            <p><strong>Weight:</strong> {details.weight / 10 || "?"} kg</p>
            <p><strong>Base XP:</strong> {details.base_experience}</p>
          </div>

          <div className="evolution-chain">
            <h4>Evolution Chain</h4>
            <div className="evolution-list">
              {evolution.map((name) => (
                <div key={name} className="evolution-item">
                  <img
                    src={`/sprites/${name}.gif`}
                    onClick={() => onClose() /* Or load modal for that Pokémon */}
                    alt={name}
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
  );
}

export default PokemonModal;
