const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

let Address = new Schema({
  fullname:{
    type: String,
    required: true
  },
  address_line1:{
    type:String,
    required:true
  },
  address_line2: {
    type:String
  },
  city:{
    type:String,
    required:true
  },
  postcode:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    requried:true
  }
});

let User = new Schema({
  firstname:{
    type:String,
    required: true
  },
  lastname:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required: true
  },
  address: [Address],
  admin:{
    type: Boolean,
    default: false
  }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);