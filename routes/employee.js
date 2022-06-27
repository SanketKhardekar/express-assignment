const express = require('express');
const router=express.Router();
const jwt= require('jsonwebtoken');
require('dotenv').config();
const { fetchEmployees } = require('../controller/employeeController.js');
router.route("/").get(authenticateToken,fetchEmployees);
//404 Page Not Found Route
router.all('*',(req,res)=>{
    res.status(404).send('Page Not Found!');
})
//Authentication function
function authenticateToken(req,res,next){
    const authHeader= req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(401).json({ message:"Authorization Not Found"})
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err) return res.status(403).json({ message: "Unauthorized Request"})
        req.user=user;
        next();
    })
}
module.exports= router;