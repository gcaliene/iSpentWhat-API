const mongoose = require('mongoose');

//model vs schema
var Expense = mongoose.model('Expense', {
  description: { type: String, required: true, minlength: 1 },
  amount: { type: Number, required: true },
  note: { type: String, required: false, default: null },
  createdAt: { type: Date, required: true, default: new Date() },
  user: { type: String, required: true }
}); //we should be ok but later need to add geocoding

module.exports = { Expense };
