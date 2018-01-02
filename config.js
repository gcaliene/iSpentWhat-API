'use strict';
exports.DATABASE_URL =
  process.env.MONGODB_URI ||
  global.MONGO_URI ||
  'mongodb://localhost:27017/expensesdb';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// module.exports = {
//   CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
// };
// //
// module.exports = { PORT: process.env.PORT || 8080 };
//
// module.exports = { JWT_SECRET: process.env.JWT_SECRET || 'herdfgdfgdf' };
// module.exports = { JWT_EXPIRY: process.env.JWT_EXPIRY || '7d' };
