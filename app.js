const express= require('express');
const cors= require('cors');
const userRoute=require('./routes/user.js')
const employeeRoute=require('./routes/employee.js')
const app=express();
const PORT= 3000;

var corsOptions = {
    origin: 'http://localhost:3000/',
    optionsSuccessStatus: 200
  }

app.use(express.json())  
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

//User Route
app.use('/api/user',userRoute);
app.use('/api/employee',employeeRoute);
app.all('*',(req,res)=>{
    res.status(404).send('Page Not Found!');
})

app.listen(PORT,()=>{
    console.log(`User App Running on port ${PORT}`)
})