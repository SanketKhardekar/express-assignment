const User=require('../schema/userSchema');
const mongoose=require('mongoose');
const DB_URL=require('../config/config');
const validator=require('../utils/validator');
const bcrypt=require('bcrypt');
mongoose.connect(DB_URL);
mongoose.connection.on("connected",()=>{
    console.log("DB CONNECTED");
})

const handleRegistration=(req,res)=>{
    try{
        if(!req.body.password)
        {
            res.status(400).json({message:"Please Provide Password"})
            return;
        }
        else
        {
            if(!(validator.passwordValidator(req.body.password)))
            {
                res.status(400).json({message:"Enter Valid Password combination of alphabets, at least one special character, and at least one digit with minimum of 8 and maximum of 16 characters."})
                return;
            }
        }

        
    }catch(err){
        console.log(err);
    }
}

module.exports={
    handleRegistration
}