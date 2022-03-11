const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

 const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; 
  }

  if (!token) {
    res.status(401).json({ error: "You are not allowed to visit this route" });
  }

   try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if(!user) return res.json({error: "No user found"})
    req.user = user;
    next();  
  }
  catch (ex) {
    console.log(ex);
    res.json({error: "Invalid token"});
  } 
 }

 const admin = (req,res,next) => {
  if(req.user && req.user.isAdmin===true) {
    next();
  }
  else {
    res.status(401).json({error: "You are not authorized to access this route."})
  }
 }

module.exports.protect = protect;
module.exports.admin = admin;