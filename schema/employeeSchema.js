const mongoose = require('mongoose');
const employeeSchema= new mongoose.Schema({
    name: {
        type:String,
        required:[true,'Please Provide Name'],
    },
    startDate:{
        type:Date,
        required:[true,'Please Provide Joining Date'],
    },
    endDate:{
        type:Date,
        required:[true,'Please Provide Leaving Date']
    },
},{
    timestamps:true,
})

module.exports=mongoose.model('Employee',employeeSchema);