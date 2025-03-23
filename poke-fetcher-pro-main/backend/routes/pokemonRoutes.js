
const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');

// Get all Pokemon names
router.get('/names', pokemonController.getAllPokemonNames);

// Get all Pokemon (complete data)
router.get('/', pokemonController.getAllPokemon);

// Get a Pokemon by name
router.get('/name/:name', pokemonController.getPokemonByName);

// Create a new Pokemon
router.post('/', pokemonController.createPokemon);

// Update a Pokemon
router.put('/:id', pokemonController.updatePokemon);

// Delete a Pokemon
router.delete('/:id', pokemonController.deletePokemon);

module.exports = router;
