const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Joi = require('joi');
const authenticate=require('../authenticate');

const Category = require('../models/carsCatogries');
const carsCategoryRouter = express.Router();
carsCategoryRouter.use(bodyParser.json());

const categoryValidationSchema = Joi.object({
    name: Joi.string().required(),
  });


  
carsCategoryRouter.post('/', authenticate.verifyUser,(req, res, next) => {
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    Category.create(req.body)
      .then((category) => {
        res.status(201).json(category);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  });
  
  // Read all categories
 carsCategoryRouter.get('/', (req, res, next) => {
    Category.find()
      .then((categories) => {
        res.status(200).json(categories);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  });
  
  // Read a specific category
  carsCategoryRouter.get('/:id', (req, res, next) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
  
    Category.findById(id)
      .then((category) => {
        if (category) {
          res.status(200).json(category);
        } else {
          res.status(404).json({ message: 'Category not found' });
        }
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  });
  
  
  // Update a category
  carsCategoryRouter.put('/:id',authenticate.verifyUser, (req, res, next) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
  
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    Category.findByIdAndUpdate(id, req.body, { new: true })
      .then((category) => {
        if (category) {
          res.status(200).json(category);
        } else {
          res.status(404).json({ message: 'Category not found' });
        }
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  });
  
  // Delete a category
  carsCategoryRouter.delete('/:id', authenticate.verifyUser,(req, res, next) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
  
    Category.findByIdAndRemove(id)
      .then((category) => {
        if (category) {
          res.status(200).json({ message: 'Category deleted' });
        } else {
          res.status(404).json({ message: 'Category not found' });
        }
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  });

module.exports=carsCategoryRouter;
