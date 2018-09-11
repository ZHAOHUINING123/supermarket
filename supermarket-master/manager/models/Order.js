const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product = new Schema({
  name:{
    type:String,
    required: true,
  },
  price:{
    type: Number,
    required: true
  },
  old_id:{
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true
  }
});

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

const order = new Schema({
  items:[product],
  address:Address,
  buyer:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type:Number,
    default:0 //0: 未发货 1: 已发货 2: 已完成
  },
  send_date:{
    type:Date,
    required:true
  },
  send_time:{
    type:Number,
    required:true //0: 5-6 1: 9
  }
},{
  timestamps:true
});

let Order = mongoose.model('Order', order);

module.exports = Order;