const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//reference to category and user is added into the carSchema

const carSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      model: {
        type: String,
        required: true,
      },
      make: {
        type: String,
        required: true,
      },
      regNo: {
        type: String,
        required: true,
        unique: true,
      },
      category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
      },
      image: {
        type: String,
        required: true,
      },
      addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );


var Cars = mongoose.model('Cars', carSchema);

module.exports = Cars;