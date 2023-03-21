const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({}).then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(dish); //
        }, (err) => {
            next(err);
        })
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Dishes.create(
            req.body
        )
            .then((dish) => {
                console.log(dish, "<<DISH CREATED");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish);

            }, (err) => next(err))
            .catch(err => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /dishes')

    })
    .delete((req, res, next) => {
        Dishes.remove({}).then((dish) => {
            console.log(dish, "All dishes deleted")
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(dish);
        }, err => next(err))
            .catch(err => next(err))
    });

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId).then((dish) => {
            console.log(dish, "Specific dish found")
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(dish);
        }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /dishes' + req.params.dishId)
    }).
    put((req, res, next) => {

        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                console.log(dish, "Specific dish updated")
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish);
            }, err => next(err))
            .catch(err => next(err))
    }).
    delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((dish) => {
                console.log(dish, "Specific dishes deleted")
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish);
            }, err => next(err))
            .catch(err => next(err))
    });




module.exports = dishRouter; 
