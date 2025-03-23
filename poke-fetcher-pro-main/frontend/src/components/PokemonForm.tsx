
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pokemon, PokemonAbility } from "@/services/pokemonService";

// Schema for Pokemon form validation
const abilitySchema = z.object({
  id: z.number().optional(),
  ability: z.string().min(1, "Ability name is required"),
  type: z.string().min(1, "Type is required"),
  damage: z.coerce.number().min(1, "Damage must be at least 1"),
  status: z.string().default("Active"),
});

const pokemonFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Must be a valid URL").or(z.instanceof(File)),
  status: z.string().default("Active"),
  abilities: z.array(abilitySchema).min(1, "At least one ability is required"),
});

export type PokemonFormValues = z.infer<typeof pokemonFormSchema>;

interface PokemonFormProps {
  defaultValues?: Partial<PokemonFormValues>;
  onSubmit: (data: PokemonFormValues) => void;
  isLoading?: boolean;
}

const PokemonForm: React.FC<PokemonFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.image && typeof defaultValues.image === 'string' 
      ? defaultValues.image 
      : null
  );

  const form = useForm<PokemonFormValues>({
    resolver: zodResolver(pokemonFormSchema),
    defaultValues: {
      name: "",
      image: "",
      status: "Active",
      abilities: [{ ability: "", type: "", damage: 10, status: "Active" }],
      ...defaultValues,
    },
  });

  // Use useFieldArray hook to manage the array of abilities
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "abilities"
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Set the file in the form
      form.setValue("image", file);
    }
  };

  const handleSubmit = async (data: PokemonFormValues) => {
    try {
      // If image is a File, upload it first
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('image', data.image);
        
        const response = await fetch('https://pokemon-app-5pv5.onrender.com/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Image upload failed');
        }
        
        const result = await response.json();
        // Replace the File with the URL returned from the server
        data.image = result.imageUrl;
      }
      
      // Now submit the form with the image URL
      onSubmit(data);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pokémon Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pikachu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <div className="space-y-2">
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="image-upload"
                      className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded flex items-center gap-2 hover:bg-primary/90"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </label>
                    {/* <Input 
                      type="text" 
                      placeholder="Or enter image URL" 
                      value={typeof value === 'string' ? value : ''}
                      onChange={(e) => {
                        onChange(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      {...fieldProps}
                    /> */}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Active" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Abilities</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => 
                append({ ability: "", type: "", damage: 10, status: "Active" })
              }
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Ability
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="p-4 border rounded-md bg-background/50 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`abilities.${index}.ability`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ability Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Thunder Shock" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`abilities.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Electric" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`abilities.${index}.damage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Damage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          placeholder="40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`abilities.${index}.status`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Active" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Pokémon"}
        </Button>
      </form>
    </Form>
  );
};

export default PokemonForm;
