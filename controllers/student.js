const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const Student = require("../models/student");

exports.getLogin = (req, res) => {
  res.render("student/login");
};

exports.postLogin = (req, res,next) => {
  const name = req.body.studentName;
  const roll = req.body.studentRoll;
  console.log(roll);
  const password = req.body.studentPassword;
  Student.findOne({ roll: roll })
  .then((student) => {
    if (student) {
      bcrypt.compare(password, student.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.student = student;
          return req.session.save(err => {
            res.redirect("/student/home");
          });
        }
        const err = new Error("Invalid username or password!");
        err.setHttpStatusCode = 200;
        return next(err);
      });
    } else {
      const err = new Error("Unrecognised roll no. Get registered first.");
      err.setHttpStatusCode = 200;
      return next(err);
    }
  })
  .catch(err=>{
    console.log(err);
    return next(err);
  })
};

exports.getStudentHome=(req,res,next)=>{
  if(req.session.isLoggedIn){
    return res.render("student/dashboard");
  }
  res.redirect("/home");
}