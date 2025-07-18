import React, { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import "../styles/cardgrid.css";
import PokemonModal from "./PokemonModal";

function CardGrid() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");
        const data = await res.json();

        const details = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );

        const cleaned = details.map((p) => ({
          id: p.id,
          name: p.name,
          types: p.types.map((t) => t.type.name),
        }));

        setPokemonList(cleaned);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch Pokémons:", err);
      }
    };

    fetchPokemons();
  }, []);

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card-grid">
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={() => openModal(pokemon)} />
      ))}

      {isModalOpen && selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </div>
  );
}

export default CardGrid;
