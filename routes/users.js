const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const users = require('../models/users')

const userRouter = express.Router();

userRouter.use(bodyParser.json());




userRouter.route('/signin')
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /api/signin');
  })
  .post((req, res, next) => {
    users.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          err = new Error('No user found with such email');
          err.status = 404;
          return next(err);
        }
        else if (user.email == req.body.email) {
          res.statusCode = 200;
          res.end("Email and password are correct");
          res.setHeader('Content-Type', 'application/json');
          res.json(user);




        }
        else {
          err = new Error('Passord is incorrect');
          err.status = 404;
          return next(err);
        }
      }, (err) => {
        next(err);
      })
      .catch(err => next(err))

  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /api/signin');
  })
  .delete((res, req, next) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /api/signin');
  })



  userRouter.route('/signup')
  .get((req, res, next)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /signup');
  })
  .post((req, res, next)=>{
    users.create(req.body)
    .then((user)=>{
      res.statusCode=200; 
      res.setHeader('Content-Type', 'application/json')

      res.json(user);
    }, err=>next(err))
    .catch(err=>next(err))
  })
  .put((req, res, next)=>{
    res.statusCode=403; 
    res.end('PUT operation not supported on /signup');
  })
  .delete((req,res,next)=>{
    res.statusCode = 403;
    res.end('DELETE operation not supported on /signup');
  })

module.exports = userRouter;
