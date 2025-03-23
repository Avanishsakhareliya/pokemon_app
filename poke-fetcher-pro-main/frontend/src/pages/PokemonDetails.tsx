
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pokemon, pokemonService } from "@/services/pokemonService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PokemonCard from "@/components/PokemonCard";
import LoadingState from "@/components/LoadingState";

const PokemonDetails = () => {
  const { name } = useParams<{ name: string }>();

  const {
    data: pokemon,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => (name ? pokemonService.getPokemonByName(name) : Promise.reject("No name provided")),
    enabled: !!name,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <LoadingState className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 glass text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Error Loading Pokémon
            </h2>
            <p className="text-muted-foreground mb-6">
              {error instanceof Error ? error.message : "Failed to load Pokémon data"}
            </p>
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ml-2 hover:bg-white/50"
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </Button>

        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            {pokemon.name}
          </h1>
          <p className="text-muted-foreground">
            Pokémon #{pokemon.id.toString().padStart(3, '0')}
          </p>
        </header>

        <PokemonCard pokemon={pokemon} className="max-w-2xl mx-auto" />
      </div>
    </div>
  );
};

export default PokemonDetails;
