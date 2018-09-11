const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product = new Schema({
  name:{
    type:String,
    required: true,
    unique: true
  },
  price:{
    type: Number,
    required: true
  },
  pic_path:{
    type: String,
    default:''
  },
  large_class:{
    type:Number,
    required: true
  },
  small_class:{
    type:Number,
    required: true
  },
  inventory:{
    type:Number,
    default:10
  }
},{
  timestamps:true
});

let Product = mongoose.model('product', product);

module.exports = Product;