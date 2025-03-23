
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { samplePokemonNames } from "@/services/pokemonService";
import ErrorState from "./ErrorState";

interface PokemonSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
  className?: string;
}

const PokemonSearch: React.FC<PokemonSearchProps> = ({
  onSearch,
  isLoading,
  error,
  onReset,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSampleClick = (name: string) => {
    setSearchQuery(name);
    onSearch(name);
  };

  const handleClear = () => {
    setSearchQuery("");
    onReset();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a Pokémon..."
            className="pl-10 pr-10 h-12 bg-white shadow-sm focus-visible:ring-primary/20 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full aspect-square text-muted-foreground hover:text-foreground"
              onClick={handleClear}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          type="submit"
          className="mt-3 w-full transition-all duration-300 shadow-sm"
          disabled={!searchQuery.trim() || isLoading}
        >
          Search
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {samplePokemonNames.map((name) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            className="text-xs transition-all duration-200 glass-dark hover:bg-black/5"
            onClick={() => handleSampleClick(name)}
            disabled={isLoading}
          >
            {name}
          </Button>
        ))}
      </div>

      {/* {error && (
        <div className="mt-4 text-sm text-destructive bg-destructive/10 rounded-md p-2 border border-destructive/20 animate-slide-up">
          {error}
        </div>
      )} */}
      {error && (
         <ErrorState
         message={`no Pokemon yet, please submit a Pokemon!` +'    , '+ error} 
         onRetry={()=>window.location.reload()}
         className="mt-8" 
       />
      )}
    </div>
  );
};

export default PokemonSearch;
