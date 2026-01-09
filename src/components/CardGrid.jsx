import React, { useState } from "react";
import PokemonCard from "./PokemonCard";
import "../styles/cardgrid.css";
import PokemonModal from "./PokemonModal";
import { usePokemon } from "../hooks/usePokemon";

function CardGrid({ searchTerm, filters }) {
  // Use custom hook
  const { pokemonList, loading, error, hasMore, loadMore } = usePokemon(searchTerm, filters);

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  // Infinite Scroll Trigger (Simple implementation: Load More Button or Scroll Listener)
  // For now, let's add a "Load More" button at the bottom unless filtering prevents it.

  return (
    <div className="card-grid-container">
      {error && <p className="error-message">Error loading Pokemon: {error.message}</p>}

      <div className="card-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={() => openModal(pokemon)} />
        ))}
      </div>

      {loading && <div className="loading-indicator">Loading more Pokémon...</div>}

      {!loading && hasMore && pokemonList.length > 0 && (
        <button className="load-more-btn" onClick={loadMore}>
          Load More
        </button>
      )}

      {/* Show "No Results" if not loading and list is empty */}
      {!loading && pokemonList.length === 0 && (
        <p className="no-results">No Pokémon found.</p>
      )}

      {isModalOpen && selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </div>
  );
}

export default CardGrid;
