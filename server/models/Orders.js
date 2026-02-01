const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

 
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,ref:"Book"
      },
      title: String,
      quantity: {
        type:Number,default:1
      },
      price: Number
    
  ,

  totalAmount: {
    type: Number,
    required: true,
  },
  image: String,
address:String,

  orderDate: {
    type: Date,
    default: Date.now,
  },

  deliveryDate: {
    type: Date,
    default: function () {
      let d = new Date();
      d.setDate(d.getDate() + 2); // delivery after 2 days
      return d;
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
