
import { toast } from "sonner";
import axios from 'axios';

// API base URL - updated to point to backend server
const API_BASE_URL = 'http://localhost:5000/api/pokemon';

// Types for our Pokemon data structure
export interface PokemonAbility {
  id: number;
  masterId: number;
  ability: string;
  type: string;
  damage: number;
  status: string;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  status: string;
  abilities: PokemonAbility[];
}

// Sample Pokemon data for initial state
export const samplePokemonNames = [
  "Pikachu",
  "Charizard",
  "Bulbasaur",
  "Squirtle",
  "Eevee"
];

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pokemon API service
export const pokemonService = {
  // Upload an image
  uploadImage: async (imageFile: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  },

  // Get all Pokemon names
  getPokemonNames: async (): Promise<string[]> => {
    try {
      const response = await api.get('/names');
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokémon names:", error);
      throw new Error("Failed to fetch Pokémon names. Please try again.");
    }
  },

  // Get a single Pokemon by name
  getPokemonByName: async (name: string): Promise<Pokemon> => {
    try {
      const response = await api.get(`/name/${name}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`No Pokémon found with name: ${name}`);
      }
      throw new Error("Failed to fetch Pokémon details. Please try again.");
    }
  },

  // Create a new Pokemon
  createPokemon: async (pokemon: Omit<Pokemon, "id">): Promise<Pokemon> => {
    try {
      const response = await api.post('/', pokemon);
      toast.success(`Created Pokémon: ${pokemon.name}`);
      return response.data;
    } catch (error) {
      console.error("Error creating Pokémon:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create Pokémon. Please try again.");
    }
  },

  // Update an existing Pokemon
  updatePokemon: async (id: number, pokemon: Partial<Pokemon>): Promise<Pokemon> => {
    try {
      const response = await api.put(`/${id}`, pokemon);
      toast.success(`Updated Pokémon: ${response.data.name}`);
      return response.data;
    } catch (error) {
      console.error("Error updating Pokémon:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update Pokémon. Please try again.");
    }
  },

  // Delete a Pokemon by id
  deletePokemon: async (id: number): Promise<void> => {
    try {
      const response = await api.delete(`/${id}`);
      toast.success(response.data.message || `Deleted Pokémon successfully`);
    } catch (error) {
      console.error("Error deleting Pokémon:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete Pokémon. Please try again.");
    }
  }
};
