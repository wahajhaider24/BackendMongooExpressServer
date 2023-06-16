const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose');



// for particular  car agencies
const businessSchema = new Schema({
      name: { type: String },
      logo: { type: String },
},
{
      timestamps: true,
});
  
//user is a car agency
const userSchema = new Schema({

        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        admin: {
          type: Boolean,
          required: true,
          default: false,
        },
        accountType:{
          type:String,
          required: true,
          default:"agency"
        },
        business: {type:businessSchema}
    

},
{ timestamps: true })


userSchema.plugin(passportLocalMongoose, { usernameField: 'email' , session: false,});

var User=mongoose.model('User', userSchema);

module.exports=User; 