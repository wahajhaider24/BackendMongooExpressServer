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
    
        if(!req.session.user){
          var authHeader = req.headers.authorization;
      
          if (!authHeader) {
           
            res.setHeader('WWW-Authenticate', 'Basic');
            res.status(401);
            return res.end("You are not authenticated!");
          }
        
        
          var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
          var username = auth[0];
          var password = auth[1];
        
          users.findOne({email:username})
          .then((user)=>{
            if(user)
            {
              if (user.email=== username && user.password === password) {
                req.session.user='authenticated';
                res.statusCode=200;
                res.setHeader('Content-Type','text/plain');
                return res.end('You are authenticated! ');
                
              }
              else {
                var err = new Error("Email or password not correct!");
                err.status = 403;
                return next(err);
              }
            }
            else {
              var err = new Error("User"+ user.email + "doesn't exist");
              err.status = 403;
              return next(err);
            }
          })
          .catch(err => next(err))
        }
        else{
          res.statusCode=200; 
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are already authenticated!')
         
        }
      
      
     
     
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
    users.findOne({email: req.body.email})
    .then((user)=>{
      if(!user){
        return users.create({email: req.body.email,
        password: req.body.password})
      }
      else{
        err = new Error('Email is already registered!');
          err.status = 404;
          return next(err);
      }
    })
    .then((user)=>{
      res.statusCode=200;
      res.setHeader('Content-Type', 'application/json');
      res.json({status:'Registration Successful!',user: user})
    },(err)=>next(err))
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
