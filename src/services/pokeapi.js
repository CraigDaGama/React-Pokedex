import { POKEAPI_BASE_URL } from "../utils/constants";

/**
 * Fetch a list of Pokemon with basic details.
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<Array>} List of Pokemon with types and image URL.
 */
export const fetchPokemonList = async (limit = 20, offset = 0) => {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();

        const promises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return formatPokemonData(details);
        });

        return Promise.all(promises);
    } catch (error) {
        console.error("Error fetching pokemon list:", error);
        throw error;
    }
};

/**
 * Fetch a single Pokemon by Name or ID
 * @param {string|number} identifier
 */
export const fetchPokemonDetails = async (identifier) => {
    try {
        const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${identifier}`);
        const data = await res.json();
        return formatPokemonData(data);
    } catch (error) {
        console.error(`Error fetching pokemon ${identifier}:`, error);
        return null;
    }
};

/**
 * Fetch ALL pokemon names and URLs (lightweight) for client-side filtering.
 * Limit set to 1500 to cover all gens.
 */
export const fetchAllPokemonNames = async () => {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=1500`);
        const data = await response.json();
        return data.results; // Returns array of { name, url }
    } catch (error) {
        console.error("Error fetching all pokemon names:", error);
        return [];
    }
};

/**
 * Fetch list of pokemon for a specific type
 * @param {string} type - e.g. "fire"
 * @returns {Promise<Array>} Array of { name, url }
 */
export const fetchPokemonByType = async (type) => {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/type/${type}`);
        const data = await response.json();
        // The structure for type endpoint is { pokemon: [ { pokemon: { name, url } } ] }
        return data.pokemon.map(p => p.pokemon);
    } catch (error) {
        console.error(`Error fetching pokemon of type ${type}:`, error);
        return [];
    }
};

/**
 * Helper to format raw PokeAPI data into a clean object.
 */
const formatPokemonData = (data) => {
    return {
        id: data.id,
        name: data.name,
        types: data.types.map((t) => t.type.name),
        height: data.height,
        weight: data.weight,
        stats: data.stats,
        sprites: data.sprites,
        cries: data.cries, // Add cries for audio
    };
};
