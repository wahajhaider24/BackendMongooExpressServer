const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate=require('../authenticate');
const Cars = require('../models/cars');
const Category= require('../models/carsCatogries')
const carsRouter = express.Router();
const Joi=require('joi');
carsRouter.use(bodyParser.json());



const carSchema = Joi.object({
    name: Joi.string().required(),
    model: Joi.string().required(),
    make: Joi.string().required(),
    regNo: Joi.string().required(),
    category: Joi.string().required(),
    image: Joi.string().required(),
    addedBy: Joi.string().required(),
    
  });


//GET ALL CARS
carsRouter.route('/')
.get(async(req, res, next)=>{
    try {
        const cars = await Cars.find().populate('category');
        res.json(cars);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
})
//POST CAR
.post(authenticate.verifyUser,async (req, res, next)=>{
    
    try {
        const { error } = carSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
    
        // Check if the referenced category exists
        const category = await Category.findById(req.body.category);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
    
        const newCar = new Cars(req.body);
        const savedCar = await newCar.save();
        res.json(savedCar);
      } catch (error) {
        res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
      }
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


carsRouter.put('/:id',authenticate.verifyUser, async (req, res) => {
    try {
      const { error } = carSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      // Check if the referenced category exists
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      const updatedCar = await Cars.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('category');
      if (!updatedCar) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json(updatedCar);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

carsRouter.delete('/:id',authenticate.verifyUser, async (req, res) => {
    try {
      const deletedCar = await Cars.findByIdAndRemove(req.params.id).populate('category');
      if (!deletedCar) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json({ message: 'Car deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });










module.exports = carsRouter; 
