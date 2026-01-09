import { useState, useEffect, useRef } from "react";
import { fetchPokemonList, fetchPokemonDetails, fetchAllPokemonNames, fetchPokemonByType } from "../services/pokeapi";
import { POKEAPI_BASE_URL } from "../utils/constants";

export const usePokemon = (searchTerm, filters) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Stores the massive list of {name, url} for all pokemon to allow instant filtering
    const [allPokemon, setAllPokemon] = useState([]);
    // Stores the filtered subset of allPokemon based on search
    const [filteredPokemon, setFilteredPokemon] = useState([]);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 20;

    // 1. Initial Load: Fetch ALL names (lightweight)
    useEffect(() => {
        const loadAllNames = async () => {
            setLoading(true);
            try {
                const results = await fetchAllPokemonNames();
                setAllPokemon(results);
                setFilteredPokemon(results); // Initially, filtered = all
            } catch (err) {
                setError(err);
                console.error("Failed to load global pokemon list", err);
            } finally {
                setLoading(false);
            }
        };
        loadAllNames();
    }, []);

    // 2. Filter Logic (Search + Types)
    useEffect(() => {
        if (!allPokemon.length) return;

        const applyFilters = async () => {
            let results = allPokemon;

            // A. Filter by Search Term
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                results = results.filter((p) => p.name.includes(lowerTerm));
            }

            // B. Filter by Types (if any)
            // Note: PokeAPI type endpoint gives us a list of pokemon for THAT type.
            // If multiple types are selected (e.g. Fire + Flying), we usually want "AND" (Fire AND Flying)
            // or "OR" depending on UX. The user likely expects "AND" (find me a Fire/Flying charizard).
            // However, intersecting multiple lists client-side is heavy if we fetch them all.
            // Strategy: Fetch list for each selected type, intersect them, then intersect with `results`.

            if (filters && filters.types && filters.types.length > 0) {
                // Fetch all type lists in parallel
                try {
                    const typePromises = filters.types.map(t => fetchPokemonByType(t));
                    const typeLists = await Promise.all(typePromises);

                    // Intersect the lists (find names present in ALL lists)
                    // Start with the first list of names
                    let commonNames = new Set(typeLists[0].map(p => p.name));

                    for (let i = 1; i < typeLists.length; i++) {
                        const currentSet = new Set(typeLists[i].map(p => p.name));
                        // Intersection
                        commonNames = new Set([...commonNames].filter(x => currentSet.has(x)));
                    }

                    // Now filter our main `results` to only include these common names
                    results = results.filter(p => commonNames.has(p.name));

                } catch (err) {
                    console.error("Error filtering by type", err);
                }
            }

            // Mega Filter (Client-side heuristic: name includes '-mega')
            if (filters && filters.mega) {
                results = results.filter(p => p.name.includes("-mega"));
            }

            setFilteredPokemon(results);
            setOffset(0);
            setPokemonList([]);
            setHasMore(true);
        };

        applyFilters();

    }, [searchTerm, allPokemon, filters]); // Added filters to deps

    // 3. Pagination / Fetch Details for Visible Slice
    useEffect(() => {
        if (!filteredPokemon.length && !loading) {
            // If filtered list is empty, we might have no results
            if (allPokemon.length > 0) setHasMore(false);
            return;
        }

        const fetchVisibleSlice = async () => {
            // Avoid fetching if we already have data for this offset (simple check)
            // Actually, we need to append.

            // Define slice
            const slice = filteredPokemon.slice(offset, offset + LIMIT);
            if (slice.length === 0) {
                setHasMore(false);
                return;
            }

            setLoading(true);
            try {
                // Check if we need to fetch details or if we already have them?
                // This hook fetches details every time.
                const promises = slice.map(async (p) => {
                    // Extract ID from URL to fetch details efficiently or use url
                    const res = await fetch(p.url);
                    const data = await res.json();
                    return {
                        id: data.id,
                        name: data.name,
                        types: data.types.map((t) => t.type.name),
                        sprites: data.sprites,
                        stats: data.stats,
                        height: data.height,
                        weight: data.weight
                    };
                });

                const detailedData = await Promise.all(promises);

                setPokemonList((prev) => {
                    if (offset === 0) return detailedData;
                    return [...prev, ...detailedData];
                });

                if (offset + LIMIT >= filteredPokemon.length) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce fetching details slightly to avoid hammering API while typing fast
        // But update filtered list instantly (above).
        const timeoutId = setTimeout(() => {
            fetchVisibleSlice();
        }, 300);

        return () => clearTimeout(timeoutId);

    }, [filteredPokemon, offset]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setOffset((prev) => prev + LIMIT);
        }
    };

    return { pokemonList, loading, error, hasMore, loadMore };
};
