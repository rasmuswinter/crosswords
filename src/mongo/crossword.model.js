import mongoose from 'mongoose';

import { crosswordTypes } from './constants';

const Schema = mongoose.Schema;

export const fields = {
  setter: { type: String, required: true },
  number: { type: Number, required: true, unique: true },
  date: { type: String, required: false },
  notes: { type: String, required: false },
  config: {
    type: { type: String, default: crosswordTypes.NORMAL },
    gridSize: { type: Number, default: 15 },
    alphabet: { type: Boolean, default: false },
    gridCount: { type: Number, default: 1 }
  },
  solution: [{
    gridNumber: { type: Number },
    gridLetters: [{ type: String, set: row => row.toUpperCase() }],
    gridLettersInverted: [{ type: String }]
  }],
  clues: [{
    identifiers: [{ type: String }],
    clue: { type: String }
  }]
};

export const schema = new Schema(fields);

schema.methods.toApiObject = function() {
  const val = this.toObject();
  if (val.clues) {
    val.clues.forEach(clue => delete clue._id);
  }
  if (val.solution) {
    val.solution.forEach(solution => {
      delete solution.gridLettersInverted;
      delete solution._id;
    });
  }
  delete val.__v;
  delete val._id;
  return val;
};

schema.pre('save', function(next) {
  // invert the grid, to allow searching in down clues
  const crossword = this;
  if (crossword.solution) {
    crossword.solution.forEach(solution => {
      const inverted = [];
      for (let i=0; i<crossword.config.gridSize; i++) {
        inverted.push('');
      }
      solution.gridLetters.forEach(row => {
        row.split('').forEach((letter, index) => {
          inverted[index] += letter;
        });
      });
      solution.gridLettersInverted = inverted;
    });
  }
  next();
});

export default mongoose.model('Crossword', schema);
