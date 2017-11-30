const express = require('express');
const cors = require('cors'); //netlify is on a different domain
const app = express();
const bodyParser = require('body-parser'); //we need body-parser to send json to the server. takes string body and converts it to javascr object
const _ = require('lodash');


const {mongoose} = require('./db/mongoose');
const {Expense} = require('./models/expenseModel');
const {ObjectID} = require('mongodb');
const {CLIENT_ORIGIN} = require('./config');


const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);


//app.use to configure the middleware, if custom it will be a function, if 3rd party then access something of off the library
app.use(bodyParser.json());//the return value from this json method is a function and that is the middleware we send to express



///\\```CORS Setup ////\\\
const {CLIENT_ORIGIN} = require('./config');
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
///\\```CORS Setup ////\\\


/////////////\\\\\\\\\\\\\\\\\\////  POST  \\\\\\\\\\\\\\\\////  Expense   //////
app.post('/expenses', (req,res) => {
  //console.log(req.body); //where the body gets stored by body-Parser
  var expense = new Expense ({
    description: req.body.description,
    amount: req.body.amount ,
    note:req.body.note ,
    createdAt: req.body.createdAt
  });
  expense.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e.errors.text.message);
  });
});
///////////////////\\\\\\\\\\\\\\\\\\//////////////////////\\\\\\\\\\\\\\\

///////\\\\\//////////\\\\\\\\\\\\\\````GET````//////\\\\\\\\\\\\\\\\\///////////
////we want all the todos
app.get('/expenses' , (req,res) => {
  Expense.find().then((expenses) => {
    res.send({expenses}) //when passing back an array, create an object. it opens up to a more flexible future
  }, (e) => {
    res.status(400).send(e.errors.text.message);
  });
});
/////\\\\\\\ GET /////////\\\\\\
///''''''""""""""""""""""""" Get Todos by ID ''''''''''''
app.get('/expenses/:id', (req, res) => {
  console.log(req.params.id);
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Expense.findById(id).then((expense) => {
    if (!expense) {
      return res.status(404).send();
    }
    res.send({expense});
  }).catch((e) => {
    res.status(400).send();
  });
});


app.get('/api/*', (req, res) => {
  res.json({ok: true});
});


/////////////\\\\\\\\\\\\\\\\\\\\\ DELETE ////////////\\\\\\\\\\\\\\\\\
app.delete('/expenses/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Expense.findByIdAndRemove(id).then((expense) => {
    if (!expense) {
      return res.status(404).send();
    }

    res.send({expense}); //remember to send an object ya dummy
  }).catch((e) => {
    res.status(400).send();
  });
});


//////////////\\\\\\\\\\\\ PUT ///////////\\\\\\\\\\\\\\

app.patch('/expenses/:id', (req, res) => { //https://stackoverflow.com/questions/24241893/rest-api-patch-or-put
  var id = req.params.id;
  var body = _.pick(req.body, ['description', 'amount', 'note', 'createdAt']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // if (_.isBoolean(body.completed) && body.completed) {
  //   body.completedAt = new Date().getTime();
  // } else {
  //   body.completed = false;
  //   body.completedAt = null;
  // }

  Expense.findByIdAndUpdate(id, {$set: body}, {new: true}).then((expense) => {
    if (!expense) {
      return res.status(404).send();
    }
    res.send({expense});
  }).catch((e) => {
    res.status(400).send();
  })
});





/////\\\\\````SERVER SETUP````////////\\\\\
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

process.on('SIGINT', function() {
  process.exit();
});

module.exports = {app};


//https://guarded-dawn-76753.herokuapp.com/ | https://git.heroku.com/guarded-dawn-76753.git
