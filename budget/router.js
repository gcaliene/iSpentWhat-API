'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { Budget } = require('./models');
const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

passport.use(jwtStrategy);

// the route is api/budget
router.post('/', jwtAuth, (req, res) => {
  console.log(req.body);
  const budget = new Budget({
    amount: req.body.amount,
    user: req.body.user
  });
  budget.save((err, budget) => {
    if (err) {
      res.send(err);
    } else {
      Budget.find((err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
          console.log('====line 27');
          console.log(data);
          console.log('====line 29=====');
        }
      });
    }
  });
});

router.get('/', jwtAuth, (req, res) => {
  console.log('===get==');
  console.log(req);
  // console.log(res.send());
  console.log('===get==');
  // Budget.find().then(
  Budget.find().then(
    budget => {
      console.log({ budget });

      res.send({ budget }); //when passing back an array, create an object. it opens up to a more flexible future
    },
    e => {
      res.status(400).send(e.errors.text.message);
    }
  );
  // console.log(res);
});

// router.delete();
router.delete('/', jwtAuth, (req, res) => {
  console.log(req.params);

  Budget.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.end('success');
    }
  });
});

module.exports = { router };
