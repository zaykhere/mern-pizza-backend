const express = require("express");
const router = express.Router();
const RegisterValidation = require("../validation/registerValidation");
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
  const { error } = RegisterValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error });

  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });
    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    await user.save();
    res.json({success: true});
  } catch (error) {
      console.log(error);
      res.json({error: error.message});
  }
});

module.exports = router;
