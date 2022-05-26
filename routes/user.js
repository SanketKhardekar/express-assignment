const express = require("express");
const router = express.Router();

const validator = require("../utils/validator.js");
const user = require("../middleware/user.js");
const db = require("../services/connection");
//Signup Route
router.post("/signup", validator.validSignupData, (req, res) => {
  let query = `SELECT * FROM user WHERE email='${req.body.email}'`;
  db.query(query, (err, result) => {
    if (!err) {
      if (result.length > 0) {
        res.status(409).send("Email Already Exists");
      } else {
        let user = {
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          password: req.body.password,
        };
        query = `INSERT INTO user SET ?`;
        db.query(query, user, (err, result) => {
          if (!err) {
            res.status(200).send("Registration Successfull");
          } else {
            res.status(409).send("Registration Failed Try Again Later");
          }
        });
      }
    } else {
      res.status(409).send("Registration Failed Try Again Later");
    }
  });
});

//Login Route
router.post("/login", validator.validLoginData, (req, res) => {
  const query = `SELECT * FROM user WHERE email='${req.body.email}'`;
  db.query(query, (err, result) => {
    if (!err) {
      if (result.length > 0) {
        if (result[0].password === req.body.password) {
          res.status(200).send("Login Sucessfull");
        } else {
          res.status(401).send("Wrong Password");
        }
      } else {
        res.status(401).send("Email Id Not Found!");
      }
    } else {
      res.status(409).send("Login Failed Try Again Later");
    }
  });
});

//Delete And Update User Route
router
  .route("/")
  .delete(validator.validUserEmail, (req, res) => {
    let query = `SELECT * FROM user WHERE email='${req.query.email}'`;
    db.query(query, (err, result) => {
      if (!err) {
        if (result.length <= 0) {
          res.status(409).send("Email Does not Exists");
        } else {
          query = `DELETE FROM user WHERE email='${req.query.email}'`;
          db.query(query, (err, result) => {
            if (!err) {
              res.status(200).send("User Deletion Successfull");
            } else {
              res.status(409).send("Deletion Failed Try Again Later");
            }
          });
        }
      } else {
        res.status(409).send("Deletion Failed Try Again Later");
      }
    });
  })
  .patch(validator.validUserEmail, validator.validUpdateData, (req, res) => {
    let query = `SELECT * FROM user WHERE email='${req.query.email}'`;
    db.query(query, (err, result) => {
      if (!err) {
        if (result.length <= 0) {
          res.status(409).send("Email Does not Exists");
        } else {
            let updateData=req.body;
          query = `UPDATE user SET ? WHERE email=?`;
          db.query(query,[updateData,req.query.email],(err, result) => {
            if (!err) {
              res.status(200).send("User Updated Successfull");
            } else {
              res.status(409).send("Update Failed Try Again Later");
            }
          });
        }
      } else {
        res.status(409).send("Update Failed Try Again Later");
      }
    });
  });

//404 Page Not Found Route
router.all("*", (req, res) => {
  res.status(404).send("Page Not Found!");
});

module.exports = router;
