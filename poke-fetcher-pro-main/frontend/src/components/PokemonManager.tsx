import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pokemon, pokemonService } from "@/services/pokemonService";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PokemonForm, { PokemonFormValues } from "./PokemonForm";
import LoadingState from "./LoadingState";

const PokemonManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch all Pokémon names
  const { data: pokemonNames, isLoading: isLoadingNames } = useQuery({
    queryKey: ["pokemonNames"],
    queryFn: pokemonService.getPokemonNames,
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: (pokemon: Omit<Pokemon, "id">) => 
      pokemonService.createPokemon(pokemon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemonNames"] });
      setIsCreateDialogOpen(false);
      toast.success("Pokémon created successfully!");
    },
    onError: (error) => {
      console.error("Error creating Pokémon:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create Pokémon");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pokemon }: { id: number; pokemon: Partial<Pokemon> }) => {
      return pokemonService.updatePokemon(id, pokemon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemonNames"] });
      setIsEditDialogOpen(false);
      toast.success("Pokémon updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating Pokémon:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update Pokémon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pokemonService.deletePokemon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemonNames"] });
      toast.success("Pokémon deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting Pokémon:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete Pokémon");
    },
  });

  // Fetch a specific Pokémon's details
  const fetchPokemonDetails = async (name: string) => {
    try {
      const pokemon = await pokemonService.getPokemonByName(name);
      setSelectedPokemon(pokemon);
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch Pokémon details");
    }
  };

  const handleCreateSubmit = (data: PokemonFormValues) => {
    // Convert from PokemonFormValues to Pokemon type
    const pokemon: Omit<Pokemon, "id"> = {
      name: data.name,
      image: data.image,
      status: data.status || "Active",
      abilities: data.abilities.map(ability => ({
        id: ability.id || 0,
        // masterId: 0, 
        ability: ability.ability,
        type: ability.type,
        damage: ability.damage,
        status: ability.status || "Active"
      }))
    };
    
    createMutation.mutate(pokemon);
  };

  const handleUpdateSubmit = (data: PokemonFormValues) => {
    if (selectedPokemon?.id) {
      console.log("Updating Pokémon:", data,selectedPokemon);
      // Convert from PokemonFormValues to Pokemon type
      const updateData: Partial<Pokemon> = {
        name: data.name,
        image: data.image,
        status: data.status,
        abilities: data.abilities.map(ability => ({
          _id: ability.id || 0,
          masterId: selectedPokemon.id,
          ability: ability.ability,
          type: ability.type,
          damage: ability.damage,
          status: ability.status || "Active"
        }))
      };
      
      updateMutation.mutate({ 
        id: selectedPokemon.id, 
        pokemon: updateData 
      });
    }
  };

  const handleDeletePokemon = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoadingNames) {
    return <LoadingState className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Pokémon</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Pokémon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Pokémon</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new Pokémon to the database.
              </DialogDescription>
            </DialogHeader>
            <PokemonForm 
              onSubmit={handleCreateSubmit} 
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pokemonNames?.map((name) => (
          <Card key={name} className="hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => fetchPokemonDetails(name)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{" "}
                        <span className="font-semibold">{name}</span> from the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            const pokemon = await pokemonService.getPokemonByName(name);
                            handleDeletePokemon(pokemon.id);
                          } catch (error) {
                            console.error("Error fetching Pokémon for deletion:", error);
                            toast.error("Failed to delete Pokémon");
                          }
                        }}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pokémon: {selectedPokemon?.name}</DialogTitle>
            <DialogDescription>
              Update the information for this Pokémon.
            </DialogDescription>
          </DialogHeader>
          {selectedPokemon && (
            <PokemonForm
              defaultValues={selectedPokemon}
              onSubmit={handleUpdateSubmit}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PokemonManager;
