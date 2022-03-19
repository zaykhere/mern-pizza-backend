const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
			res.status(200).json({success: "true", message: "Order Placed Successfully"});
		}

		else {
			res.status(500).json({error: "Payment Failed"});
		}

	}
	catch(e) {
		res.status(500).json({error: "Something went wrong"});
	}
})

module.exports = router;