const mongoose = require('mongoose');
const Ability = require('./Ability');  // Import Ability model

// Create schema for Pokemon master data
const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Active',
  },
  abilities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ability',  // Reference the Ability model
  }],
}, {
  timestamps: true
});

// Auto-increment ID
pokemonSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  try {
    const highestPokemon = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = highestPokemon && highestPokemon.id ? highestPokemon.id + 1 : 1;
    
    // Set masterId for each ability
    this.abilities.forEach(ability => {
      ability.masterId = this.id;
    });
    
    next();
  } catch (error) {
    next(error);
  }
});
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
