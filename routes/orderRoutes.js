const express = require("express");
const router = express.Router();
const {protect, admin} = require("../middlewares/authMiddleware");
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Order = require("../models/orderModel");

router.post("/placeorder" , protect, async(req,res)=> {
	const {token, subtotal, userToken, cartItems} = req.body;

	try{
		const customer = await stripe.customers.create({
			email: token.email,
			source: token.id
		});

		const payment = await stripe.charges.create({
			amount: subtotal * 100,
			currency: 'USD',
			customer: customer.id,
			receipt_email: token.email
		}, {
			idempotencyKey : uuidv4()
		})

		if(payment) {
			const newOrder = new Order({
				name: req.user.name,
				email: req.user.email,
				userId: req.user._id,
				orderAmount: subtotal,
				shippingAddress: {
					street: token.card.address_line1,
					city: token.card.address_city,
					country: token.card.address_country,
					pincode: token.card.address_zip
				},
				transactionId: payment.source.id,
				orderItems: cartItems.map((c)=> (
					{name: c.name, quantity: c.quantity, price: c.price, varient: c.varient, image: c.image, item: c._id}
				))
			})
			await newOrder.save();
			res.status(200).json({success: "true", message: "Order Placed Successfully"});
		}

		else {
			res.status(500).json({error: "Payment Failed"});
		}

	}
	catch(e) {
		console.log(e);
		res.status(500).json({error: "Something went wrong"});
	}
})

router.get("/myorders", protect, async(req,res)=> {
	try{
		const orders = await Order.find({userId: req.user._id}).sort({createdAt: -1});
		if(!orders) return res.json({message: "You have not ordered anything yet."});
		res.json({success: true, orders: orders});
	}
	catch(e) {
		console.log(e);
		res.json({error: e.message});
	}
})

router.get("/", protect, admin, async(req,res)=> {
	try {
		const orders = await Order.find().sort({createdAt: -1});
		if(!orders) return res.send("There are no orders yet");

		res.json({success: true, orders: orders});
	}
	catch(e) {
		console.log(e);
		res.json({error: e.message});
	}
})

router.put("/deliver/:id", protect, admin, async(req,res)=> {
	const orderId = req.params.id;

	try {
		const order = await Order.findOne({_id: orderId});
		if(!order) return res.status(404).json({error: "Order Not found"});

		order.isDelivered = true;
		await order.save();
		res.json({success: true, message: "Order Delivered Successfully"});
	}
	catch(e) {
		console.log(e);
		res.json({error: e.message});
	}
})

module.exports = router;