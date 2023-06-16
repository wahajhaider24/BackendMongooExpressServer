const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const user= require('../models/users')
var authenticate = require('../authenticate');
const passport=require('passport');


const userRouter = express.Router();

userRouter.use(bodyParser.json());




userRouter.route('/signin')
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /api/signin');
    
  })
  .post(passport.authenticate('local', { session: false }),(req, res) => {
        
      var token = authenticate.getToken({_id: req.user._id});
        res.statusCode=200; 
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true, token: token , status:'Login Sucessful!'})
     
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
  .get(passport.authenticate('jwt', { session: false }),(req,res,next)=>
  {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'You are not logged in' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.json({ logout: 'Logout Successful' });
        res.redirect('/');
      }
    
    } catch (err) {
      next(err); // Pass the error to the error-handling middleware
    }
    
  })

  userRouter.route('/signup')
  .get((req, res, next)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /signup');
  })
  .post((req, res, next)=>{
    user.register(new user({email: req.body.email, admin: req.body.admin, name: req.body.name, accountType: req.body.accountType}),req.body.password, 
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
