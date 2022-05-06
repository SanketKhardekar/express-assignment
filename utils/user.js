const fs=require('fs')

const login=(loginData)=>{
    const users=loadUsers()
    const validUser=users.find((user)=> user.email === loginData.email)
    if(validUser)
    {
        if(validUser.password === loginData.password)
        {
            return { status: true, message:"Login Successfull", statusCode:200 } 
        }
        return { status: false, message:"Wrong Password", statusCode:401}
    }
    return { status:false, message:"Email Id Not Found", statusCode:401};
}
const register=(registrationData)=>{
    const users=loadUsers();
    const duplicateUser=users.find((user)=> user.email===registrationData.email)
    if(!duplicateUser)
    {
        try
        {
            users.push({
                name:registrationData.name,
                phone:registrationData.phone,
                email:registrationData.email,
                password:registrationData.password,
            });
            saveUser(users)    
        }
        catch(error)
        {
            return { status:true, message:"Registration Failed Try Again Later", statusCode:409}
        }
        return { status:true, message:"Registration Successfull", statusCode:200}
    }
    else
    {
        return {status:false, message:"Email Already Exists",statusCode:409}
    }
}

const remove=(userData)=>{
    const users=loadUsers();
    const isUser=users.find((user)=> user.email ===userData.email)
    if(isUser)
    {
        try
        {
            let updatedUsers=users.filter((user)=> user.id !== userData.id)
            saveUser(updatedUsers)
        }
        catch(error)
        {
            return {status: false,message:error, statusCode:409}
        }
        return {status:true,message:"User Deleted SuccessFully",statusCode:200}
    }
    else{
        return {stats:false, message:"User Does Not Exists",statusCode:409}
    }
}
const update=(email,userData)=>{
    const users=loadUsers();
    let index=users.findIndex((user)=> user.email === email)
    if(index !== -1)
    {
        try
        {
            users[index]={
                email: userData.email ? userData.email : users[index].email,
                name: userData.name ? userData.name : users[index].name,
                phone: userData.phone ? userData.phone : users[index].phone,
                password: users[index].password,
            }
            saveUser(users);
        }
        catch(error)
        {
            return {status: false,message:error, statusCode:409}
        }
        return {status:true,message:`User Updated SuccessFully`, statusCode:200}
    }
    else
    {
        return {stats:false, message:"User Does Not Exists",statusCode:409}
    }
}
const saveUser=(userData)=>{
    const userDataJson=JSON.stringify(userData)
    fs.writeFileSync("users.json",userDataJson)
}
const loadUsers=()=>{
    try {
        const dataBuffer= fs.readFileSync("users.json")
        const dataJson=dataBuffer.toString()
        return JSON.parse(dataJson)
    } catch (error) {
        return []
    }
}

module.exports={
    login,
    register,
    remove,
    update,
}
