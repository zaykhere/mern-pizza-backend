const mongoose = require("mongoose");

const pizzaSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    varients: [],
    prices: [],
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    }
}, {
    timestamps: true
});

const Pizza = mongoose.model("pizzas", pizzaSchema);

module.exports = Pizza;