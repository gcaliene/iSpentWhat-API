//'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors'); //netlify is on a different domain
const app = express();
const bodyParser = require('body-parser'); //we need body-parser to send json to the server. takes string body and converts it to javascr object
const _ = require('lodash');
const mongoose = require('mongoose');

//const { mongoose } = require('./db/mongoose');
const { Expense } = require('./models/expenseModel');
const { ObjectID } = require('mongodb');
const { CLIENT_ORIGIN } = require('./config');
const { PORT, DATABASE_URL } = require('./config');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: budgetRouter } = require('./budget');

// Logging
app.use(morgan('common'));

//app.use to configure the middleware, if custom it will be a function, if 3rd party then access something of off the library
app.use(bodyParser.json()); //the return value from this json method is a function and that is the middleware we send to express

///\\```CORS Setup ////\\\
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//   if (req.method === 'OPTIONS') {
//     return res.send(204);
//   }
//   next();
// });
///\\``End of CORS Setup ////\\\

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/budget/', budgetRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

// app.use('*', (req, res) => {
//   return res.status(404).json({ message: 'Not Found' });
// });

/////////////\\\\\\\\\\\\\\\\\\////  POST  \\\\\\\\\\\\\\\\////  Expense   //////
app.post('/expenses', jwtAuth, (req, res) => {
  console.log(req.body); //where the body gets stored by body-Parser
  const expense = new Expense({
    description: req.body.description,
    amount: req.body.amount,
    note: req.body.note,
    createdAt: req.body.createdAt,
    user: req.body.user
  });
  expense.save((err, expense) => {
    if (err) {
      res.send(err);
    } else {
      Expense.find((err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
        }
      });
    }
  });
});
///////////////////\\\\\\\\\\\\\\\\\\//////////////////////\\\\\\\\\\\\\\\

///////\\\\\//////////\\\\\\\\\\\\\\````GET````//////\\\\\\\\\\\\\\\\\///////////
////we want all the todos

app.get('/expenses', jwtAuth, (req, res) => {
  console.log('=======');
  Expense.find().then(
    expenses => {
      res.send({ expenses }); //when passing back an array, create an object. it opens up to a more flexible future
    },
    e => {
      res.status(400).send(e.errors.text.message);
    }
  );
});
//

/////\\\\\\\ GET /////////\\\\\\
///''''''""""""""""""""""""" Get Todos by ID ''''''''''''
app.get('/expenses/:id', jwtAuth, (req, res) => {
  console.log('req.params.id=' + req.params.id);
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Expense.findById(id)
    .then(expense => {
      if (!expense) {
        return res.status(404).send();
      }
      res.send({ expense });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.get('/currentUser', jwtAuth, (req, res) => {
  console.log(req.user.username);
  res.json(req.user.username); //just sends back user
});

// app.get('/api/*', (req, res) => {
//   res.json({ ok: true });
// });

/////////////\\\\\\\\\\\\\\\\\\\\\ DELETE ////////////\\\\\\\\\\\\\\\\\
app.delete('/expenses/:id', jwtAuth, (req, res) => {
  console.log(req.params);
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Expense.findByIdAndRemove(id)
    .then(expense => {
      if (!expense) {
        return res.status(404).send();
      }

      res.send({ expense }); //remember to send an object ya dummy
    })
    .catch(e => {
      res.status(400).send();
    });
});

//////////////\\\\\\\\\\\\ PUT/patch Needs patch because maybe updating one or two things /fetch doesn't allow patch ///////////\\\\\\\\\\\\\\

app.put('/expenses/:id', jwtAuth, (req, res) => {
  //https://stackoverflow.com/questions/24241893/rest-api-patch-or-put //put for fetch but patch works for axios
  var id = req.params.id;
  var body = _.pick(req.body, ['description', 'amount', 'note', 'createdAt']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Expense.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(expense => {
      if (!expense) {
        return res.status(404).send();
      }
      res.send({ expense });
    })
    .catch(e => {
      res.status(400).send();
    });
});

let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

//https://guarded-dawn-76753.herokuapp.com/ | https://git.heroku.com/guarded-dawn-76753.git
