const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//model vs schema
const BudgetSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  // note: { type: String, required: false, default: null },
  createdAt: { type: Date, required: false, default: new Date() },
  user: { type: String, required: true }
});

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = { Budget };
