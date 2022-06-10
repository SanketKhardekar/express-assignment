const User = require("../schema/userSchema");
const mongoose = require("mongoose");
const mongoConfig = require("../config/config");
const validator = require("../utils/validator");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt= require('jsonwebtoken');
//Database Connection
mongoose.connect(mongoConfig.DB_URL);
mongoose.connection.on("connected", () => {
  console.log("DB CONNECTED");
});

//Error Handling
const handlerDuplicateField = (err) => {
  let message;
  const keys = Object.keys(err.keyValue);
  if (keys.includes("email")) message = "User already exists";
  return message;
};

const handleValidationError = (err) => {
  let message;
  const key = Object.keys(err.errors);
  if (err.errors[key[0]] && err.errors[key[0]].properties) {
    message = err.errors[key[0]].properties.message;
  }
  return message;
};

//Registration Controller
const handleRegistration = async (req, res) => {
  try {
    if (!req.body.password) {
      res.status(400).json({
        sucesss: false,
        message: "Please Provide Password",
      });
      return;
    } else {
      if (!validator.passwordValidator(req.body.password)) {
        res.status(400).json({
          success: false,
          message:
            "Enter Valid Password combination of alphabets, at least one special character, and at least one digit with minimum of 8 and maximum of 16 characters.",
        });
        return;
      }
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      phone: req.body.phone,
    });
    const result = await user.save();
    res
      .status(200)
      .json({ success: true,message: "Resgistration SuccessFull", user_id: result._id });
  } catch (err) {
    let message = "Something Went Wrong";
    if (err.code === 11000) message = handlerDuplicateField(err);
    if (err.name === "ValidationError") message = handleValidationError(err);
    res.status(400).json({ success: false, message: message });
    return;
  }
};

//Login Controller
const handleLogin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res
        .status(400)
        .json({ success: false, message: "Please Provide Email And Password" });
      return;
    }
    const user = await User.findOne({ email: req.body.email, status:true });
    if (user === null) {
      res.status(401).json({ success: false, message: "User Not Found" });
      return;
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      res.status(401).json({ success: false, message: "Incorrect Password" });
      return;
    }
    const userData={ name:user.name,email:user.email }
    const accessToken=jwt.sign(userData,process.env.ACCESS_TOKEN_SECRET);
    res
      .status(200)
      .json({ success: true, message: "Login SucessFull", id: user._id, accessToken });
    return;
  } catch (err) {
    res.status(400).json({ success: false, message: "Something Went Wrong" });
  }
};

const getUser=async(id)=>{
  const user= await User.findOne({_id:id, status:true});
  return user;
}

//Delete User
const handleDelete = async (req, res) => {
  try {
    if (!req.query.id) {
      res.status(400).json({ success: false, message: "Please Provide Id For Deletion" });
      return;
    }
    const user= await getUser(req.query.id);
    if(user === null)
    {
      res.status(400).json({success:false, message: "User Not Found" })
      return;
    }
    user.status=false;
    user.save();
    res.status(200).json({success:true, message:"User Deleted Successfully" })
    return;
  } catch (err) {
    res.status(400).json({success:false, message: "Something Went Wrong" })
    return;
  }
};
const handleUpdate=async(req,res)=>{
  try{
    if (!req.query.id) {
      res.status(400).json({ success: false, message: "Please Provide Id For Deletion" });
      return;
    }
    if(req.body.email)
    {
      res.status(401).json({ success: false, message: "Email Cannot be Updated" });
      return;
    }
    const user= await User.findByIdAndUpdate(req.query.id,req.body,{ runValidators: true });
    if(user === null)
    {
      res.status(400).json({success:false,message:"User Not Found" })
      return;
    }
    res.status(200).json({success:true, user:user,message:"User Updated Successfully" })
    return;
  }catch(err){
    let message = "Something Went Wrong";
    if (err.name === "ValidationError") message = handleValidationError(err);
    res.status(400).json({success:false, message })
    return;
  }
}

module.exports = {
  handleRegistration,
  handleDelete,
  handleUpdate,
  handleLogin,
};
