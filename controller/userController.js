const User = require("../schema/userSchema");
const mongoose = require("mongoose");
const mongoConfig = require("../config/config");
const validator = require("../utils/validator");
const bcrypt = require("bcrypt");
mongoose.connect(mongoConfig.DB_URL);
mongoose.connection.on("connected", () => {
  console.log("DB CONNECTED");
});

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
          sucesss: false,
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
      .json({ message: "Resgistration SuccessFull", user_id: result._id });
  } catch (err) {
    let message = "Something Went Wrong";
    if (err.code === 11000) message = handlerDuplicateField(err);
    if (err.name === "ValidationError") message = handleValidationError(err);
    res.status(400).json({ sucesss: false, message: message });
    return;
  }
};

const handleLogin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res
        .status(400)
        .json({ sucesss: false, message: "Please Provide Email And Password" });
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if(user === null)
    {
        res.status().json({sucesss: false, message:"User Not Found"});
        return;
    }
    console.log(user);
    res.status(200).json({ sucesss: true, id: user._id });
  } catch (err) {
    res.status(400).json({ sucesss: false, message: err.message });
  }
};

module.exports = {
  handleRegistration,
  handleLogin,
};
