const express = require('express');
const cors = require('cors'); //netlify is on a different domain
const app = express();
const bodyParser = require('body-parser'); //we need body-parser to send json to the server. takes string body and converts it to javascr object


var {mongoose} = require('./db/mongoose');
var {Expense} = require('./models/expenseModel');

const PORT = process.env.PORT || 3000;


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


//////////      ////  POST  ////  Expense   //////
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
///////\\\\POST /////\\\\\

///////\\\\\//////////\\\\\\\\\\\\\\GET//////\\\\\\\\\\\\\\\\\///////////
////we want all the todos
app.get('/expenses' , (req,res) => {
  Expense.find().then((expenses) => {
    res.send({expenses}) //when passing back an array, create an object. it opens up to a more flexible future
  }, (e) => {
    res.status(400).send(e.errors.text.message);
  });
});
/////\\\\\\\ GET /////////\\\\\\


app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

process.on('SIGINT', function() {
  process.exit();
});

module.exports = {app};

//https://guarded-dawn-76753.herokuapp.com/ | https://git.heroku.com/guarded-dawn-76753.git
// 24cfab2e-9acf-428a-bb0a-64a65ec1c4af
