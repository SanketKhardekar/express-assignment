const express = require('express');
const router=express.Router();

const validator= require('../utils/validator.js');
const user= require('../middleware/user.js');
const { handleRegistration, handleLogin, handleDelete, handleUpdate } = require('../controller/userController.js');

//Signup Route
router.post('/signup',handleRegistration);

//Login Route
 router.post('/login',handleLogin);
 

//Delete And Update User Route
 router.route('/').delete(handleDelete).patch(handleUpdate);

//404 Page Not Found Route
router.all('*',(req,res)=>{
    res.status(404).send('Page Not Found!');
})

module.exports= router;