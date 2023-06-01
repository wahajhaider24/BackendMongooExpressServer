const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const user= require('../models/users')
const passport=require('passport');

const userRouter = express.Router();

userRouter.use(bodyParser.json());




userRouter.route('/signin')
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /api/signin');
    
  })
  .post(passport.authenticate('local'),(req, res) => {
    
        res.statusCode=200; 
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true, status:'Login Sucessful!'})
     
   })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /api/signin');
    next()
  })
  .delete((res, req, next) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /api/signin');
    next();
  })


  userRouter.route('/logout')
  .get((req,res)=>{
    if(req.session)
    {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else{
      var err= new Error('You are not logged in! ');
      err.status=403;
      next(err);

    }
  })

  userRouter.route('/signup')
  .get((req, res, next)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /signup');
  })
  .post((req, res, next)=>{
    user.register(new user({username: req.body.username, admin: req.body.admin}),req.body.password, 
    (err, user)=>{
      if(err)
      {
        res.statusCode=500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err})
      }
      else{
        passport.authenticate('local')(req, res, 
          ()=>{
            res.statusCode=200; 
            res.setHeader('Content-Type', 'application/json');
            res.json({status:'Registration Succesful!', success:true});
          })
      }
    })

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
