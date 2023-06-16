const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const user= require('../models/users')
var authenticate = require('../authenticate');
const passport=require('passport');
const randomstring = require('randomstring'); 



const userRouter = express.Router();

userRouter.use(bodyParser.json());




const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  admin: Joi.boolean().required(),
  name: Joi.string().required(),
  accountType: Joi.string().required(),
  password: Joi.string().required(),
});

userRouter.route('/signin')
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /api/signin');
  })
  .post(passport.authenticate('local', { session: false }), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'Login Successful!' });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /api/signin');
    next();
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /api/signin');
    next();
  });

userRouter.route('/logout')
  .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'You are not logged in' });
      } else {
      
        res.redirect('/');
      }
    } catch (err) {
      next(err); // Pass the error to the error-handling middleware
    }
  });

userRouter.route('/signup')
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /signup');
  })
  .post((req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({ error: error.details[0].message });
    } else {
      const generatedPassword = randomstring.generate(8);
      user.register(
        new user({
          email: req.body.email,
          admin: req.body.admin,
          name: req.body.name,
          accountType: req.body.accountType,
        }),
        generatedPassword,
        (err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ error: err });
          } else {
            passport.authenticate('local')(req, res, () => {
              const emailMessage = `Your randomly generated password: ${generatedPassword}`;

              // Send the email using your email service or library
              // For example, using Nodemailer library:
              /*
              const nodemailer = require('nodemailer');
  
              const transporter = nodemailer.createTransport({
                // Configure your email service settings here
              });
  
              const mailOptions = {
                from: 'your-email@example.com',
                to: req.body.email,
                subject: 'Registration Successful',
                text: emailMessage
              };
  
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log('Error sending email:', error);
                } else {
                  console.log('Email sent:', info.response);
                }
              });
              */
  
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ status: 'Registration Successful!', success: true });
            });
          }
        }
      );
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /signup');
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /signup');
  });

module.exports = userRouter;
