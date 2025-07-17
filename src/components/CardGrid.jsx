// src/components/CardGrid.jsx

import React, { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import PokemonModal from "./PokemonModal"; // placeholder for now
import "../styles/cardgrid.css";

function CardGrid() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const dummyData = [
  { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], image: "../sprites/001.gif" },
  { id: 2, name: "Ivysaur", types: ["Grass", "Poison"], image: "/images/2.gif" },
  { id: 3, name: "Venusaur", types: ["Grass", "Poison"], image: "/images/3.gif" },
  { id: 4, name: "Charmander", types: ["Fire"], image: "/images/4.gif" },
  { id: 5, name: "Charmeleon", types: ["Fire"], image: "/images/5.gif" },
  { id: 6, name: "Charizard", types: ["Fire", "Flying"], image: "/images/6.gif" },
  { id: 7, name: "Squirtle", types: ["Water"], image: "/images/7.gif" },
  { id: 8, name: "Wartortle", types: ["Water"], image: "/images/8.gif" },
  { id: 9, name: "Blastoise", types: ["Water"], image: "/images/9.gif" },
];

    setPokemons(dummyData);
  }, []);

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  return (
    <>
      <div className="card-grid">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => openModal(pokemon)}
          />
        ))}
      </div>
      <PokemonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pokemon={selectedPokemon}
      />
    </>
  );
}

export default CardGrid;
