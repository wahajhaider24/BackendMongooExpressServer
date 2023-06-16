const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Category = require('../models/carsCatogries');

const carsCategoryRouter = express.Router();

carsCategoryRouter.use(bodyParser.json());

carsCategoryRouter.route('/')
.get((req, res, next)=>{
    Category.find()
    .then((Category)=>{
        if (Category != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(Category);
        }
        else {
            err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
    } ,(err) => next(err))
    .catch((err) => next(err));
})

module.exports=carsCategoryRouter;
