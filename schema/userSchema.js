const mongoose = require('mongoose');
const regex = {
    email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/,
    name: /^[a-z A-Z]{2,30}/,
    phone: /^\d{10}$/g,
  };
const userSchema= new mongoose.Schema({

    email:{
        type:String,
        unique:true,
        required:[true,'Please Provide Email'],
        validate:{
            validator: email=> regex.email.test(email),
            message: props => `${props.value} is not valid email check again`,
        }
    },
    password:{
        type:String,
        required:[true,'Please Provide Password']
    },
    name: {
        type:String,
        required:[true,'Please Provide Name'],
        validate:{
            validator:name=> regex.name.test(name),
            message: props=> `(${props.value}) Enter Valid Name having min 2 and max 30 alphabets`
        }
    },
    phone:{
        type: Number,
        required:[true,'Please Provide Phone Number'],
        validate:{
            validator:phone => regex.phone.test(phone),
            message: props =>`(${props.value}) Enter Valid 10 Digit Phone Number`
        }
    },
    status:{
        type:Boolean,
        default:true,
    }
},{
    timestamps:true,
})

module.exports=mongoose.model('User',userSchema);