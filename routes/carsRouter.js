const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate=require('../authenticate');
const Cars = require('../models/cars');
const carsRouter = express.Router();
carsRouter.use(bodyParser.json());


//general Route for all
carsRouter.route('/')
.get((req, res, next)=>{
    Cars.find({})
    .then((Cars)=>{
        if (Cars != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(Cars);
        }
        else {
            err = new Error('Cars' + req.params.carId+ ' not found');
            err.status = 404;
            return next(err);
        }
    } ,(err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next)=>{
    Cars.create(req.body)
    .then((Cars)=>{
        if (Cars != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(Cars);
        }
        else {
            err = new Error('Cars' + req.params.carId+ ' not found');
            err.status = 404;
            return next(err);
        }
    } ,(err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next)=>{
    res.statusCode=403;
    res.end("Put operation not supported on /cars")
})
.delete(authenticate.verifyUser,(req, res, next)=>{
    Cars.deleteMany({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});









module.exports = carsRouter; 
