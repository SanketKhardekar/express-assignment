const express = require('express');
const router=express.Router();

const validator= require('../utils/validator.js');
const user= require('../middleware/user.js');

//Signup Route
router.post('/signup',validator.validSignupData,(req,res)=>{
    const response=user.register(req.body)
    res.status(response.statusCode).send(response.message)
})

//Login Route
router.post('/login',validator.validLoginData,(req,res)=>{
    const response=user.login(req.body)
    res.status(response.statusCode).send(response.message)
})

//Delete And Update User Route
router.route('/').delete(validator.validUserEmail,(req,res)=>{
    const response=user.remove(req.query)
    res.status(response.statusCode).send(response.message)
}).patch(validator.validUserEmail,validator.validUpdateData,(req,res)=>{
    const response=user.update(req.query.email,req.body)
    res.status(response.statusCode).send(response.message)
});

//404 Page Not Found Route
router.all('*',(req,res)=>{
    res.status(404).send('Page Not Found!');
})

module.exports= router;