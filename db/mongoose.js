const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || global.MONGO_URI || 'mongodb://localhost:27017/expensesdb', {
  useMongoClient: true //this line has to be added due to deprecation
});

module.exports = {
  mongoose: mongoose
}
