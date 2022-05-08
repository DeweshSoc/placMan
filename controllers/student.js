const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const Student = require("../models/student");
const Record = require("../models/record");

exports.getLogin = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/student/home");
  }
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
        return err
      });
    } else {
      const err = new Error("Unrecognised roll no. Get registered first.");
      err.setHttpStatusCode = 200;
      return err;
    }
  })
  .catch(err=>{
    console.log(err);
    return next(err);
  })
};

exports.getStudentHome=(req,res,next)=>{
  const id = req.session.student._id;
  if(req.session.isLoggedIn){
    Student.findOne({_id:id})
    .then(student=>{
      if(!student){
        const err = new Error("Student not found!");
        return err;
      }
      return Record.find({})
      .then(records=>{
        let years = [];
        records.forEach(rec=>{
          years.push(rec.year);
        });
        return years;
      })
      .then(years=>{
        return res.render("student/dashboard",{
          student:student,
          isLoggedIn:req.session.isLoggedIn,
          mode:"student",
          previousYears:years
        });
      })
    })
    .catch(err=>{
      console.log(err);
      next(err);
    })
  }else{
    res.redirect("/home");
  }
};

exports.getRecords=(req,res,next)=>{
  if(req.session.isLoggedIn){
    const year = req.params.year;
    Record.findOne({year:year})
    .then(record=>{
      if(!record){
        const err = new Error("No record found for this year");
        err.setHttpStatusCode = 200;
        throw err;
      }
      return Record.find({})
        .then((records) => {
          let years = [];
          records.forEach((rec) => {
            years.push(rec.year);
          });
          return years;
        })
        .then((years) => {
          return res.render("placement-record", {
            isLoggedIn: req.session.isLoggedIn,
            mode: "student",
            previousYears: years,
            year:record.year,
            data:record.data
          });
        });
    })
    .catch(err=>{
      console.log(err);
      return next(err);
    });
  }
}

exports.logout=(req,res,next)=>{
  req.session.destroy(()=>{
    res.redirect("/home");
  });
};