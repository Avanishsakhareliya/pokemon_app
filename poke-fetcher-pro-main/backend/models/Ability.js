// models/Ability.js
const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
  ability: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  damage: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    default: 'Active',
  },
}, {
  timestamps: true
});

const Ability = mongoose.model('Ability', abilitySchema);

module.exports = Ability;
