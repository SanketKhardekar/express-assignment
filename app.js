const express= require('express');
const validator= require('./validator.js');
const user= require('./user.js');
const app=express();
const PORT= 3000;
app.use(express.json());
app.post('/api/user/signup',validator.validSignupData,(req,res)=>{
    const response=user.register(req.body)
    res.status(response.statusCode).send(response.message)
})
app.post('/api/user/login',validator.validLoginData,(req,res)=>{
    const response=user.login(req.body)
    res.status(response.statusCode).send(response.message)
})
app.route('/api/user/').delete(validator.validUserEmail,(req,res)=>{
    const response=user.remove(req.query)
    res.status(response.statusCode).send(response.message)
}).patch(validator.validUserEmail,(req,res)=>{
    res.send('Updated')
});
app.all('*',(req,res)=>{
    console.log(req.url);
    res.status(404).send('Page Not Found!');
})

app.listen(PORT,()=>{
    console.log(`User App Running on port ${PORT}`)
})