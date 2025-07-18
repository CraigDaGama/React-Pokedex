import React, { useEffect, useState } from "react";
import "../styles/pokemonmodal.css";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";

function PokemonModal({ pokemon, onClose }) {
  const [sprite, setSprite] = useState("");
  const [isShiny, setIsShiny] = useState(false);
  const [isMega, setIsMega] = useState(false);
  const [megaForm, setMegaForm] = useState("x");
  const [stats, setStats] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [typeData, setTypeData] = useState({ weaknesses: [], strengths: [] });
  const [details, setDetails] = useState({ height: "", weight: "", gender: "", category: "", abilities: [] });

  const formattedId = pokemon.id.toString().padStart(3, "0");
  const hasMega = ["003", "006", "009"].includes(formattedId);
  const hasMegaXY = ["006", "150"].includes(formattedId);

  useEffect(() => {
    const tryLoadImage = async (pathList) => {
      for (const path of pathList) {
        try {
          const res = await fetch(path, { method: "HEAD" });
          if (res.ok) return path;
        } catch {
          continue;
        }
      }
      return `/sprites/${formattedId}.gif`;
    };

    const base = `/sprites/${formattedId}`;
    const spriteOptions = [];

    if (isMega) {
      if (hasMegaXY) {
        if (isShiny) {
          spriteOptions.push(`${base}-mega-${megaForm}-shiny.gif`);
        }
        spriteOptions.push(`${base}-mega-${megaForm}.gif`);
      } else {
        if (isShiny) {
          spriteOptions.push(`${base}-mega-shiny.gif`);
        }
        spriteOptions.push(`${base}-mega.gif`);
      }
    } else {
      if (isShiny) spriteOptions.push(`${base}-shiny.gif`);
    }

    spriteOptions.push(`${base}.gif`);
    tryLoadImage(spriteOptions).then(setSprite);
  }, [isMega, isShiny, formattedId, megaForm, hasMegaXY]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
        const data = await res.json();

        const statData = data.stats.map((s) => ({ stat: s.stat.name, value: s.base_stat }));
        setStats(statData);

        const types = data.types.map((t) => t.type.name);
        const typeInfo = await Promise.all(data.types.map((t) => fetch(t.type.url).then((r) => r.json())));
        const weaknesses = new Set();
        const strengths = new Set();
        typeInfo.forEach((info) => {
          info.damage_relations.double_damage_from.forEach((t) => weaknesses.add(t.name));
          info.damage_relations.double_damage_to.forEach((t) => strengths.add(t.name));
        });
        setTypeData({ weaknesses: [...weaknesses], strengths: [...strengths] });

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();
        const evoChain = [];
        let evo = evoData.chain;
        do {
          evoChain.push(evo.species.name);
          evo = evo.evolves_to[0];
        } while (evo && evo.evolves_to);
        setEvolution(evoChain);

        const abilities = data.abilities.map((a) => a.ability.name);
        setDetails({
          height: `${(data.height / 3.048).toFixed(2)}'`,
          weight: `${(data.weight * 0.2205).toFixed(1)} lbs`,
          gender: speciesData.gender_rate === -1 ? "Genderless" : "Male / Female",
          category: speciesData.genera.find((g) => g.language.name === "en")?.genus || "",
          abilities,
        });
      } catch (err) {
        console.error("Failed to load modal data:", err);
      }
    };
    fetchDetails();
  }, [pokemon]);

  
  return (
    
    <div className="pokemon-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>&times;</button>

          <div className="modal-left">
            <p className="pokemon-id">No{formattedId}</p>
            <img src={sprite} alt={pokemon.name} className="modal-sprite" />
            <h2 className="pokemon-name">{pokemon.name}</h2>

            <div className="button-group">
              <img
                src="/logo/shiny.png"
                alt="Shiny Toggle"
                title="Toggle Shiny"
                className={`icon-button ${isShiny ? "active" : ""}`}
                onClick={() => setIsShiny(!isShiny)}
              />
              {hasMega && (
                <>
                  <img
                    src="/logo/mega.png"
                    alt="Mega Toggle"
                    title="Toggle Mega"
                    className={`icon-button ${isMega ? "active" : ""}`}
                    onClick={() => setIsMega(!isMega)}
                  />
                  {isMega && hasMegaXY && (
                    <div className="sub-button-group">
                      <button onClick={() => setMegaForm("x")} className={megaForm === "x" ? "active" : ""}>X</button>
                      <button onClick={() => setMegaForm("y")} className={megaForm === "y" ? "active" : ""}>Y</button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="info-box">
              <p><strong>Height:</strong> {details.height}</p>
              <p><strong>Weight:</strong> {details.weight}</p>
              <p><strong>Gender:</strong> {details.gender}</p>
              <p><strong>Category:</strong> {details.category}</p>
              <p><strong>Abilities:</strong> {details.abilities.join(", ")}</p>
            </div>
          </div>

          <div className="modal-right">
            <h3>Stats</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={stats} outerRadius={90}>
                <PolarGrid />
                <PolarAngleAxis dataKey="stat" />
                <PolarRadiusAxis angle={30} domain={[0, 160]} />
                <Radar name="Stats" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>

            <h3>Evolution</h3>
            <div className="evolution-line">
              {evolution.map((name, idx) => (
                <span key={name}>{name}{idx !== evolution.length - 1 && " → "}</span>
              ))}
            </div>

            <h3>Type Advantages</h3>
            <div className="type-pills">
              {typeData.strengths.map((type) => (
                <span key={type} className={`type-badge type-${type}`}>{type}</span>
              ))}
            </div>

            <h3>Weaknesses</h3>
            <div className="type-pills">
              {typeData.weaknesses.map((type) => (
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
