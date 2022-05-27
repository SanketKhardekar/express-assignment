const express = require("express");
const router = express.Router();
const { v4: uuidv4}=require('uuid');
const validator = require("../utils/validator.js");
const user = require("../middleware/user.js");
const db = require("../services/connection");
//Signup Route
router.post("/signup", validator.validSignupData, (req, res) => {
  let query = `SELECT * FROM user WHERE email='${req.body.email}'`;
  db.query(query, (err, result) => {
    if (!err) {
      if (result.length > 0) {
        res.status(409).json({message:"Email Already Exists"});
        return;
      } else {
        const newId = uuidv4()
        let user = {
          id: newId,
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          password: req.body.password,
          status:1,
        };
        query = `INSERT INTO user SET ?`;
        db.query(query, user, (err, result) => {
          if (!err) {
            res.status(200).json({message:"Registration Successfull", userId: newId});
            return;
          } else {
            res.status(409).json({message:"Registration Failed Try Again Later"});
            return;
          }
        });
      }
    } else {
      res.status(409).json({message:"Registration Failed Try Again Later"});
      return;
    }
  });
});

//Login Route
router.post("/login", validator.validLoginData, (req, res) => {
  const query = `SELECT * FROM user WHERE email='${req.body.email}'AND status=1`;
  db.query(query, (err, result) => {
    if (!err) {
      if (result.length > 0) {
        if (result[0].password === req.body.password) {
          res.status(200).send({message:"Login Sucessfull", userId:result[0].id});
          return;
        } else {
          res.status(401).send("Wrong Password");
          return;
        }
      } else {
        res.status(401).send("Email Id Not Found!");
        return;
      }
    } else {
      res.status(409).send("Login Failed Try Again Later");
      return;
    }
  });
});

//Delete And Update User Route
router
  .route("/")
  .delete((req, res) => {
    let query = `SELECT * FROM user WHERE id='${req.query.id}' AND status=1`;
    db.query(query, (err, result) => {
      if (!err) {
        if (result.length <= 0) {
          res.status(409).json({message:"User Does not Exists"});
          return;
        } else {
          query = `UPDATE user SET status=0 WHERE id='${req.query.id}'`;
          db.query(query, (err, result) => {
            if (!err) {
              res.status(200).json({message:"User Deletion Successfull"});
              return;
            } else {
              res.status(409).json({message:"Deletion Failed Try Again Later"});
              return;
            }
          });
        }
      } else {
        res.status(409).json({message:"Deletion Failed Try Again Later"});
        return;
      }
    });
  })
  .patch(validator.validUpdateData, (req, res) => {
    let query = `SELECT * FROM user WHERE id='${req.query.id}'  AND status=1`;
    db.query(query, (err, result) => {
      if (!err) {
        if (result.length <= 0) {
          res.status(409).send("User Does not Exists");
          return;
        } else {
            let updateData=req.body;
          query = `UPDATE user SET ? WHERE id=?`;
          db.query(query,[updateData,req.query.id],(err, result) => {
            if (!err) {
              res.status(200).send("User Updated Successfull");
              return;
            } else {
              res.status(409).send("Update Failed Try Again Later");
              return;
            }
          });
        }
      } else {
        res.status(409).send("Update Failed Try Again Later");
        return;
      }
    });
  });

//404 Page Not Found Route
router.all("*", (req, res) => {
  res.status(404).send("Page Not Found!");
});

module.exports = router;
