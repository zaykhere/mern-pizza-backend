const express = require("express");
const mongoose = require("mongoose");
const Pizza = require("../models/pizzaModel");
const {protect, admin} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", async(req,res)=> {
    const pizzas = await Pizza.find();
    res.send(pizzas);
})

router.get("/:pizzaid", async(req,res)=> {
	const pizzaId = req.params.pizzaid;
	try {
		const pizza = await Pizza.findOne({_id: pizzaId});
		if(!pizza) return res.status(404).json({error: "Pizza not found"});

		res.json({success: true, data: pizza});
	}
	catch(e) {
		console.log(e);
		res.json({error: e.message});
	}
})

router.post("/addpizza", protect, admin, async(req,res)=> {
	const pizza = req.body.pizza;

	try{
	const newPizza = new Pizza({
		name: pizza.name,
		image: pizza.image,
		varients: ['small', 'medium', 'large'],
		description: pizza.description,
		category: pizza.category,
		prices: [pizza.prices] 
	});

	await newPizza.save();
	res.status(200).json({success: true});
}
	catch(e) {
		console.log(e);
		return res.status(500).json({error: e.message});
	}

})

router.put("/editpizza/:id", protect, admin, async(req,res)=> {
	try {
		let pizza = await Pizza.findOne({_id: req.params.id});
		if(!pizza) return res.status(404).json({error: "Requested pizza is not found"});

		pizza.name = req.body.pizza.name,
		pizza.description = req.body.pizza.description,
		pizza.image = req.body.pizza.image,
		pizza.category = req.body.pizza.category,
		pizza.prices = [req.body.pizza.prices],

		await pizza.save();

		res.send("Pizza details added successfully");
	}
	catch(e) {
		console.log(e);
		res.status(500).json({error: e.message});
	}
})

module.exports = router;