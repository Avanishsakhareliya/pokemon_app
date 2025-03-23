
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Pokemon, pokemonService } from "@/services/pokemonService";
import PokemonSearch from "@/components/PokemonSearch";
import PokemonCard from "@/components/PokemonCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { cn } from "@/lib/utils";

const Index = () => {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const { 
    mutate: fetchPokemon, 
    isPending, 
    error,
    reset 
  } = useMutation({
    mutationFn: pokemonService.getPokemonByName,
    onSuccess: (data) => {
      setPokemonData(data);
      setHasSearched(true);
    },
  });

  const handleSearch = (query: string) => {
    fetchPokemon(query);
  };

  const handleReset = () => {
    setPokemonData(null);
    setHasSearched(false);
    reset();
  };

  const handleAddPokemon = () => {
    navigate("/admin");
  };
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-blue-50">
      <header className="w-full text-center py-16 px-4 md:py-20">
        <div className="appear">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Pokemon Explorer
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            Search for a Pokemon to view its details and abilities
          </p>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 pb-20 flex-1 flex flex-col">
      <div className="mb-5 flex justify-center">
          <button 
            onClick={handleAddPokemon} 
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Pokemon
          </button>
        </div>
        <PokemonSearch
          onSearch={handleSearch}
          isLoading={isPending}
          error={error instanceof Error ? error.message : null}
          onReset={handleReset}
          className="mb-10"
        />

        <div className={cn(
          "flex-1 flex flex-col items-center justify-center transition-opacity duration-300",
          (isPending || pokemonData || (error && hasSearched)) ? "opacity-100" : "opacity-0"
        )}>
          {isPending && <LoadingState className="mt-10" />}
          
          {!isPending && !pokemonData && !error && hasSearched && (
            <div className="text-center p-8 animate-fade-in">
              <p className="text-lg text-muted-foreground">No Pokémon found</p>
            </div>
          )}
          
          {/* {!isPending && error && (
            <ErrorState 
              message={error instanceof Error ? error.message : "An error occurred"} 
              onRetry={handleReset}
              className="mt-8" 
            />
          )} */}
          
          {!isPending && pokemonData &&!error && (
            <div className="w-full max-w-md mx-auto animate-fade-in">
              <PokemonCard pokemon={pokemonData} />
            </div>
          )}
          
         
        </div>
         {!isPending && !pokemonData && !error && !hasSearched && (
            <div className="text-center p-8 text-muted-foreground animate-fade-in">
              <p className="text-sm md:text-base mb-2">No Pokémon yet, please submit a Pokémon!</p>
              <p className="text-xs text-muted-foreground/70">
                Try clicking one of the sample names above or use the search bar
              </p>
            </div>
          )}
      </main>
    </div>
  );
};

export default Index;
