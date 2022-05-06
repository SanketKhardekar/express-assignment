const express= require('express');
const validator= require('./utils/validator.js');
const cors= require('cors');
const user= require('./utils/user.js');


const app=express();
const PORT= 3000;

var corsOptions = {
    origin: 'http://localhost:3000/',
    optionsSuccessStatus: 200
  }

app.use(express.json())  
app.use(cors(corsOptions));

//SIGNUP ROUTE
app.post('/api/user/signup',validator.validSignupData,(req,res)=>{
    const response=user.register(req.body)
    res.status(response.statusCode).send(response.message)
})

//LOGIN ROUTE
app.post('/api/user/login',validator.validLoginData,(req,res)=>{
    const response=user.login(req.body)
    res.status(response.statusCode).send(response.message)
})

//DELETE AND UPDATE USER ROUTE
app.route('/api/user/').delete(validator.validUserEmail,(req,res)=>{
    const response=user.remove(req.query)
    res.status(response.statusCode).send(response.message)
}).patch(validator.validUserEmail,validator.validUpdateData,(req,res)=>{
    const response=user.update(req.query.email,req.body)
    res.status(response.statusCode).send(response.message)
});

//404 PAGE NOT FOUND
app.all('*',(req,res)=>{
    res.status(404).send('Page Not Found!');
})

app.listen(PORT,()=>{
    console.log(`User App Running on port ${PORT}`)
})