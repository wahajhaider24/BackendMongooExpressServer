const Joi = require('joi');
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const user= require('../models/users')
var authenticate = require('../authenticate');
const passport=require('passport');
const randomstring = require('randomstring'); 
require('dotenv').config(); 



const userRouter = express.Router();

userRouter.use(bodyParser.json());




const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  admin: Joi.boolean().required(),
  name: Joi.string().required(),
  accountType: Joi.string().required(),
});

const forgetPasswordSchema=  Joi.object({
  email:Joi.string().email().required(),
})

const updatePasswordSchema = Joi.object({
  otp: Joi.string()
    .required()
    .messages({
      'string.base': 'OTP must be a string',
      'string.empty': 'OTP is required',
      'any.required': 'OTP is required',
    }),

  newPassword: Joi.string()
    .required()
    .messages({
      'string.base': 'New password must be a string',
      'string.empty': 'New password is required',
      'any.required': 'New password is required',
    }),

    email: Joi.string().email().required(),
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
            
              const emailMessage = `Your randomly generated password: ${generatedPassword}`;
              console.log(generatedPassword);

              
  
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.GMAIL_USER, // Use the environment variable for the Gmail email address
                  pass: process.env.GMAIL_PASSWORD // Use the environment variable for the Gmail password
                }
              });
  
              const mailOptions = {
                from: process.env.GMAIL_USER,
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
              
  
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ status: 'Registration Successful!', success: true });
           
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



  //FORGET PASSWORD API
  userRouter.post('/forgetpassword', (req, res, next) => {
    const { error } = forgetPasswordSchema.validate(req.body);
    if (error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({ error: error.details[0].message });
    } 
    else{

    
    const { email } = req.body;
  
    // Generate OTP
    const otp = randomstring.generate(6); 
  
    user.findOne({ email }, (err, user) => {
      if (err) {
        res.statusCode = 500;
        return res.json({ error: 'Internal server error' });
      }
  
      if (!user) {
        res.statusCode = 404;
        return res.json({ error: 'User not found with the given email' });
      }
  
      // Store the OTP in the user's document
      user.otp = otp;
      user.save((err) => {
        if (err) {
          res.statusCode = 500;
          return res.json({ error: 'Internal server DB error' });
        }
  
        // Send OTP to user's email
        const emailMessage = `Your OTP for password reset: ${otp}`;
  
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER, // Use the environment variable for the Gmail email address
            pass: process.env.GMAIL_PASSWORD // Use the environment variable for the Gmail password
          }
        });
  
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Password Reset OTP',
          text: emailMessage
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email:', error);
            res.statusCode = 500;
            return res.json({ error: 'Failed to send email' });
          }
  
          console.log('Email sent:', info.response);
          res.statusCode = 200;
          res.json({ message: 'OTP sent successfully' });
        });
      });
    });
  }
  })
  .put('/updatepassword', (req, res, next) => {
    const { error } = updatePasswordSchema.validate(req.body);
    if (error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({ error: error.details[0].message });
    } else {
      const { email, otp, newPassword } = req.body;
  
      user.findOne({ email }, (err, user) => {
        if (err) {
          res.statusCode = 500;
          return res.json({ error: 'Internal server error' });
        }
  
        if (!user) {
          res.statusCode = 404;
          return res.json({ error: 'User not found' });
        }
  
        // Check if the provided OTP matches the stored OTP
        if (user.otp !== otp) {
          res.statusCode = 400;
          return res.json({ error: 'Invalid OTP' });
        }
  
        // Update the user's password
         user.setPassword(newPassword, (err) => {
          if (err) {
            res.statusCode = 500;
            return res.json({ error: 'Internal server error' });
          }
  
          // Save the updated user
          user.save((err) => {
            if (err) {
              res.statusCode = 500;
              return res.json({ error: 'Internal server DB error' });
            }
  
            res.statusCode = 200;
            res.json({ message: 'Password updated successfully' });
          });
        });

          
      });
    }
  });

module.exports = userRouter;
