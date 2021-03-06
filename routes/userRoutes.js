const express = require("express");
const router = express.Router();
const RegisterValidation = require("../validation/registerValidation");
const User = require("../models/userModel");
const generateToken = require("../utils/genToken");
const {protect, admin} = require("../middlewares/authMiddleware");

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
    res.json({success: true, token: generateToken(user._id)});
  } catch (error) {
      console.log(error);
      res.json({error: error.message});
  }
});

router.post("/login", async(req,res)=> {
  const {email, password} = req.body;
  try{
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({ error: "No user exists with the entered email" });
    
    const matchPassword = await user.matchPassword(password);
    if (matchPassword) {
      res.json({
        token: generateToken(user._id),
	name: user.name,
	isAdmin: user.isAdmin
      })
    }
    else {
      res.status(401).json({error: "Invalid email or password"});
      
    }

  } catch (error) {
    console.log(error);
    
  }
  
})

router.get("/allusers", protect, admin, async(req,res)=> {
  try {
    const users = await User.find();
    if(!users) return res.json({error: "No users found"});

    res.json({success: true, users: users});
  }
  catch(e) {
    console.log(e);
    res.json({error: e.message});
  }
})

module.exports = router;
