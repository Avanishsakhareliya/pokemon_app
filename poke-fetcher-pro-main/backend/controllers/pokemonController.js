
const Ability = require('../models/Ability');
const Pokemon = require('../models/Pokemon');

// Get all Pokemon (names only)
exports.getAllPokemonNames = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({}, 'name');
    res.status(200).json(pokemons.map(pokemon => pokemon.name));
  } catch (error) {
    console.error('Error fetching Pokemon names:', error);
    res.status(500).json({ message: 'Failed to fetch Pokémon names' });
  }
};

// Get a single Pokemon by name
exports.getPokemonByName = async (req, res) => {
  try {
    const name = req.params.name;
    
    // Case insensitive search
    const pokemon = await Pokemon.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    }).populate('abilities');
    
    if (!pokemon) {
      return res.status(404).json({ message: `No Pokémon found with name: ${name}` });
    }
    
    return res.status(200).json(pokemon);
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    res.status(500).json({ message: 'Failed to fetch Pokémon details' });
  }
};

// Create a new Pokemon
// exports.createPokemon = async (req, res) => {
//   try {
//     const { name } = req.body;
    
//     // Check if Pokemon already exists
//     const existingPokemon = await Pokemon.findOne({ 
//       name: { $regex: new RegExp(`^${name}$`, 'i') } 
//     });
    
//     if (existingPokemon) {
//       return res.status(400).json({ message: `Pokémon with name ${name} already exists` });
//     }
//     console.log("req.body==",req.body)
//     // Create new Pokemon
//     const newPokemon = new Pokemon(req.body);
//     await newPokemon.save();
    
//     res.status(201).json(newPokemon);
//   } catch (error) {
//     console.error('Error creating Pokemon:', error);
//     res.status(500).json({ message: 'Failed to create Pokémon', error: error.message });
//   }
// };

exports.createPokemon = async (req, res) => {
    try {
    // Extract abilities from the request body
    console.log("req.body==",req.body)
    const abilitiesData = req.body.abilities;

    // First, save all abilities to the Ability collection
    const savedAbilities = [];
    for (let abilityData of abilitiesData) {
      const ability = new Ability({
        ability: abilityData.ability,
        type: abilityData.type,
        damage: abilityData.damage,
        status: abilityData.status || 'Active',
      });
      const savedAbility = await ability.save();
      savedAbilities.push(savedAbility._id);  // Save only the ObjectId reference
    }

    // Create the Pokémon with the saved abilities
    const newPokemon = new Pokemon({
      id:1,
      name: req.body.name,
      image: req.body.image,
      status: req.body.status || 'Active',
      abilities: savedAbilities,  // Pass the saved abilities' ObjectIds
    });

    await newPokemon.save();

    return res.status(201).json({ message: 'Pokemon created successfully!', pokemon: newPokemon });
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    return res.status(500).json({ message: 'Failed to create Pokémon', error: error.message });
  }
}

// Update a Pokemon
exports.updatePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find the existing Pokémon by its ID
    const pokemon = await Pokemon.findOne({ id: id });
    
    if (!pokemon) {
      return res.status(404).json({ message: `No Pokémon found with id: ${id}` });
    }

    console.log("updates==", updates);

    // Handle abilities update
    if (updates.abilities) {
      const abilityIds = await Promise.all(
        updates.abilities.map(async (ability) => {
          // Try to find the existing ability by 'ability' and 'type' fields
          let foundAbility = await Ability.findOne({ ability: ability.ability, type: ability.type });

          if (!foundAbility) {
            // If the ability doesn't exist, create a new one
            foundAbility = new Ability({
              ability: ability.ability,
              type: ability.type,
              damage: ability.damage,
              status: ability.status,
            });

            // Save the new ability to the DB
            await foundAbility.save();
          }

          // Return the ObjectId of the found or created ability
          return foundAbility._id;
        })
      );

      // Assign the ObjectIds of abilities to the 'abilities' field in the update
      updates.abilities = abilityIds;
    }

    // Now update the Pokémon with the new abilities (or any other updates)
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: id },
      { $set: updates },
      { new: true }  // Return the updated document
    );

    if (!updatedPokemon) {
      return res.status(404).json({ message: `No Pokémon found with id: ${id}` });
    }

    res.status(200).json(updatedPokemon);
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    res.status(500).json({ message: 'Failed to update Pokémon', error: error.message });
  }
};

// Delete a Pokemon
exports.deletePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pokemon = await Pokemon.findOne({ id: id });
    
    if (!pokemon) {
      return res.status(404).json({ message: `No Pokémon found with id: ${id}` });
    }
    
    await Pokemon.deleteOne({ id: id });
    
    res.status(200).json({ message: `Deleted Pokémon: ${pokemon.name}` });
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    res.status(500).json({ message: 'Failed to delete Pokémon' });
  }
};

// Get all Pokemon (complete data)
exports.getAllPokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({});
    res.status(200).json(pokemons);
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    res.status(500).json({ message: 'Failed to fetch all Pokémon' });
  }
};
