const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const Student = require("../models/student");
const Record = require("../models/record");
const { set } = require("mongoose");

exports.getSignup=(req,res,next)=>{
  if (req.session.isLoggedIn) {
    return res.redirect("/student/home");
  }
  res.render("student/signup");
}

exports.postSignup=(req,res,next)=>{

  const roll = req.body.studentRoll;
  const name = req.body.studentName;
  const password = req.body.studentPassword;
  const address = req.body.studentAddress;
  const branch = req.body.studentBranch;
  const cgpa = req.body.studentCgpa;
  const cgpaSem1 = req.body.studentCgpaSem1;
  const cgpaSem2 = req.body.studentCgpaSem2;
  const cgpaSem3 = req.body.studentCgpaSem3;
  const cgpaSem4 = req.body.studentCgpaSem4;
  const cgpaSem5 = req.body.studentCgpaSem5;
  const cgpaSem6 = req.body.studentCgpaSem6;
  const cgpaSem7 = req.body.studentCgpaSem7;
  const cgpaSem8 = req.body.studentCgpaSem8;
  const passoutYr = req.body.studentPassoutYr;
  const dob = req.body.studentDob;
  const pName1 = req.body.studentParent1;
  const pName2 = req.body.studentParent2;
  const pOcp1 = req.body.studentParentOcp1;
  const pOcp2 = req.body.studentParentOcp2;
  const skills = JSON.parse(req.body.json);
  const metric = req.body.studentMetric;
  const hsc = req.body.studentHsc;
  const email = req.body.studentEmail;
  const phone = req.body.studentPhone;

  console.log(skills);

  Student.findOne({roll:roll})
  .then(student=>{
    if(student){
      const err = new Error("This roll number is already registered. Contact admin for changes.")
      err.setHttpStatusCode = 200;
      throw err;
    }
    let semCgpaArray = [];
    semCgpaArray.push(cgpaSem1);
    semCgpaArray.push(cgpaSem2);
    semCgpaArray.push(cgpaSem3);
    semCgpaArray.push(cgpaSem4);
    semCgpaArray.push(cgpaSem5);
    semCgpaArray.push(cgpaSem6);
    semCgpaArray.push(cgpaSem7);
    semCgpaArray.push(cgpaSem8);
    const homeInfo = {
      parentName1:pName1,
      parentName2:pName2,
      occupation1:pOcp1,
      occupation2:pOcp2,
    };
    return bcrypt.hash(password,12)
    .then(hashedPassword=>{
      const newStud = new Student({
        roll:roll,
        name:name,
        password:hashedPassword,
        address:address,
        branch:branch,
        cgpa:cgpa,
        semCgpa:semCgpaArray,
        photoId:"no photo",
        placed:false,
        passoutYr:passoutYr,
        homeInfo:homeInfo,
        dob:dob,
        skills:skills,
        metricMarks:metric,
        hscMarks:hsc,
        email:email,
        phone:phone
      });
      return newStud.save();
    })
  })
  .then(student=>{
    const toSend = {
      message:"New student Added!",
      redirectRoute : "/student/login"
    }
    return res.send(JSON.stringify(toSend));
  })
  .catch(err=>{
    console.log(err);
    const responseMsg = err.message;
    res.status(500);
    res.send(JSON.stringify(responseMsg));
  });
};



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
        throw err;
      });
    } else {
      const err = new Error("Unrecognised roll no. Get registered first.");
      err.setHttpStatusCode = 200;
      throw err;
    }
  })
  .catch(err=>{
    console.log(err);
    return next(err);
  })
};

exports.getStudentHome=(req,res,next)=>{
  if(req.session.isLoggedIn){
    const id = req.session.student._id;
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
        const dt = new Date(student.dob);
        return res.render("student/dashboard",{
          student:student,
          dob:dt.toDateString(),
          isLoggedIn:req.session.isLoggedIn,
          mode:"student",
          previousYears:years
        });
      })
    })
    .catch(err=>{
      console.log(err);
      return next(err);
    })
  }else{
    res.redirect("/home");
  }
};

exports.getRecords=(req,res,next)=>{
  if(req.session.isLoggedIn){
    const year = req.params.year;
    console.log(year);
    Record.findOne({year:year})
    .then(record=>{
      if(!record){
        const err = new Error("No record found for this year");
        err.setHttpStatusCode = 200;
        throw err;
      }
      console.log(record);
      res.send(JSON.stringify(record));
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = err.message;
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    });
  }
}

exports.getEditForm = (req,res,next)=>{
  if(req.session.isLoggedIn){
    const roll = req.params.roll;
    console.log(roll);
    Student.findOne({roll:roll},{password:0})
    .then(student=>{
      if(!student){
        const err = new Error("No such student found!");
        err.setHttpStatusCode = 200;
        throw err;
      }
      res.send(JSON.stringify(student));
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = err.message;
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    });
  }
}

exports.postEditForm = (req,res,next)=>{
  if(req.session.isLoggedIn){
    console.log(req.body);
    const roll = req.params.roll;
    console.log(roll);
    Student.findOne({roll:roll})
    .then(student=>{
      if(!student){
        const err = new Error("No such student found!");
        err.setHttpStatusCode = 200;
        throw err;
      }
      student.name = req.body.studentName;
      student.address = req.body.studentAddress;
      student.branch = req.body.studentBranch;
      student.cgpa = req.body.studentCgpa;
      student.semCgpa[0] = req.body.studentCgpaSem1;
      student.semCgpa[1] = req.body.studentCgpaSem2;
      student.semCgpa[2] = req.body.studentCgpaSem3;
      student.semCgpa[3] = req.body.studentCgpaSem4;
      student.semCgpa[4] = req.body.studentCgpaSem5;
      student.semCgpa[5] = req.body.studentCgpaSem6;
      student.semCgpa[6] = req.body.studentCgpaSem7;
      student.semCgpa[7] = req.body.studentCgpaSem8;
      student.passoutYr = req.body.studentPassoutYr;
      student.dob = req.body.studentDob;
      student.homeInfo.parentName1 = req.body.studentParent1;
      student.homeInfo.parentName2 = req.body.studentParent2;
      student.homeInfo.occupation1 = req.body.studentParentOcp1;
      student.homeInfo.occupation2 = req.body.studentParentOcp2;
      student.metricMarks = req.body.studentMetric;
      student.hscMarks = req.body.studentHsc;
      student.email = req.body.studentEmail;
      student.phone = req.body.studentPhone;
      return student.save();
    })
    .then(savedDoc=>{
      const toSend = {
        redirectRoute : "/student/home",
        message: "Student data updated successfully"
      }
      res.send(JSON.stringify(toSend));
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = err.message;
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    })
  }
}

exports.postSkillAdd=(req,res,next)=>{
  if(req.session.isLoggedIn){
    console.log(req.body);
    const roll = req.params.roll;
    Student.findOne({roll:roll})
    .then(student=>{
      if(!student){
        const err = new Error("No such student found!");
        err.setHttpStatusCode = 200;
        throw err;
      }
      const addedSkills = JSON.parse(req.body.json);
      for(let i=0;i<addedSkills.length;i++){
        student.skills.push(addedSkills[i]);
      }
      return student.save();
    })
    .then(savedDoc=>{
      const toSend = {
        message:"Student skill updated!",
        redirectRoute:"/student/home"
      }
      res.send(JSON.stringify(toSend));
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = err.message;
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    })
  }
}

exports.getSkillDel = (req, res, next) => {
  if (req.session.isLoggedIn) {
    const roll = req.params.roll;
    Student.findOne({ roll: roll })
      .then((student) => {
        if (!student) {
          const err = new Error("No such student found!");
          err.setHttpStatusCode = 200;
          throw err;
        }
        const skills = student.skills;
        res.send(JSON.stringify(skills));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = err.message;
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  }
};

exports.postSkillDel=(req,res,next)=>{
  if (req.session.isLoggedIn) {
    console.log(req.body);
    const roll = req.params.roll;
    Student.findOne({ roll: roll })
      .then((student) => {
        if (!student) {
          const err = new Error("No such student found!");
          err.setHttpStatusCode = 200;
          throw err;
        }
        const skillIndices = JSON.parse(req.body.skillIndices);
        let newSkills = [];
        for(let i=0;i<student.skills.length;i++){
          if(!skillIndices.includes(i)){
            newSkills.push(student.skills[i]);
          }
        }
        student.skills = newSkills;
        return student.save();
      })
      .then((savedDoc) => {
        const toSend = {
          message: "Student skills updated!",
          redirectRoute: "/student/home",
        };
        res.send(JSON.stringify(toSend));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = err.message;
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  }
}

exports.logout=(req,res,next)=>{
  req.session.destroy(()=>{
    res.redirect("/home");
  });
};