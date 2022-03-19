const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: true
    },
    userId: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
    },
    orderItems: [
     {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      varient: {type: String},
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'pizzas'
      }
    }
    ],
    orderAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: Object
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    transactionId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;