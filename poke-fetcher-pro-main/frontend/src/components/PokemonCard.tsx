
import React from "react";
import { Pokemon } from "@/services/pokemonService";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Type colors for styling badges
const typeColors: Record<string, string> = {
  "Normal": "bg-gray-400 hover:bg-gray-500",
  "Fire": "bg-orange-500 hover:bg-orange-600",
  "Water": "bg-blue-500 hover:bg-blue-600",
  "Electric": "bg-yellow-400 hover:bg-yellow-500",
  "Grass": "bg-green-500 hover:bg-green-600",
  "Ice": "bg-cyan-400 hover:bg-cyan-500",
  "Fighting": "bg-red-600 hover:bg-red-700",
  "Poison": "bg-purple-500 hover:bg-purple-600",
  "Ground": "bg-amber-600 hover:bg-amber-700",
  "Flying": "bg-indigo-400 hover:bg-indigo-500",
  "Psychic": "bg-pink-500 hover:bg-pink-600",
  "Bug": "bg-lime-500 hover:bg-lime-600",
  "Rock": "bg-stone-500 hover:bg-stone-600",
  "Ghost": "bg-violet-600 hover:bg-violet-700",
  "Dragon": "bg-violet-800 hover:bg-violet-900",
  "Dark": "bg-gray-700 hover:bg-gray-800",
  "Steel": "bg-slate-400 hover:bg-slate-500",
  "Fairy": "bg-pink-300 hover:bg-pink-400",
};

interface PokemonCardProps {
  pokemon: Pokemon;
  className?: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, className }) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 glass hover-lift", 
        className
      )}
    >
      <CardHeader className="p-0 relative overflow-hidden h-60">
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent z-10" />
        <img 
          src={pokemon.image} 
          alt={pokemon.name}
          className="w-full h-full object-contain p-4"
          loading="lazy"
          onLoad={(e) => e.currentTarget.classList.add('animate-fade-in')}
        />
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Badge className="mb-2 bg-primary/80 backdrop-blur-sm text-white">
            #{pokemon.id.toString().padStart(3, '0')}
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight leading-none">
            {pokemon.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Status: {pokemon.status}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Abilities</h3>
          <ul className="space-y-3">
            {pokemon.abilities.map((ability) => (
              <li key={ability.id} className="flex flex-col space-y-1 animate-slide-up" style={{ animationDelay: `${ability.id * 50}ms` }}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{ability.ability}</span>
                  <Badge 
                    className={cn(
                      "text-white text-xs", 
                      typeColors[ability.type] || "bg-gray-500"
                    )}
                  >
                    {ability.type}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Damage: {ability.damage}</span>
                  <span>Status: {ability.status}</span>
                </div>
                <Separator className="mt-2" />
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
