const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        unique:true
      }
    },
    {
      timestamps: true,
    }
  );
  
var Category = mongoose.model("Category", categorySchema);
  
module.exports = Category;