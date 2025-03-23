
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "lucide-react";
import PokemonManager from "@/components/PokemonManager";

const Admin = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your Pokémon database</p>
        </header>
        
        <Tabs defaultValue="pokemon" className="w-full">
        <div className="mb-5 flex justify-center">
          <button 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {"<"} Return Home
          </button>
        </div>
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="pokemon" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Pokemon Management</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pokemon" className="animate-fade-in">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <span>Pokemon Database</span>
                </CardTitle>
                <CardDescription>
                  Create, update, and delete Pokémon data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PokemonManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
