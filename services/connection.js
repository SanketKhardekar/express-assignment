const mysql=require('mysql');
const dbConnection=require('../config/dbConnection');

const db=mysql.createConnection(dbConnection);
db.connect((err)=>{
        if(err)
        {
            console.log(err)
        }
        console.log("Mysql Connected...");
    })
module.exports=db;