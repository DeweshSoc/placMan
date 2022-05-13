const bcrypt = require("bcryptjs");


const Teacher = require("../models/teacher");
const Record = require("../models/record");


exports.getSignup = (req,res,next)=>{
    if (req.session.isTeacherLoggedIn) {
      return res.redirect("/teacher/home");
    }
    res.render("teacher/signup");
}

exports.postSignup = (req,res,next)=>{
    console.log(req.body);
    Teacher.findOne({ uid: req.body.teacherUid })
      .then((teacher) => {
        if (teacher) {
          const err = new Error(
            "This uid is already registered. Contact admin for changes."
          );
          err.setHttpStatusCode = 200;
          throw err;
        }
        return bcrypt
          .hash(req.body.teacherPassword, 12)
          .then((hashedPassword) => {
            const newTeacher = new Teacher({
              name: req.body.teacherName,
              uid: req.body.teacherUid,
              password: hashedPassword,
              department: req.body.teacherDept,
              email: req.body.teacherEmail,
              phone: req.body.teacherPhone,
              gender:req.body.teacherGender,
              admin:false
            });
            return newTeacher.save();
          });
      })
      .then(teacher => {
        const toSend = {
          message: "New teacher Added!",
          redirectRoute: "/teacher/login",
        };
        return res.send(JSON.stringify(toSend));
      })
      .catch(err => {
        console.log(err);
        const responseMsg = {
          message: err.message,
          redirectRoute: "/home",
        };
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
}

exports.getLogin = (req,res,next)=>{
    if (req.session.isTeacherLoggedIn) {
      return res.redirect("/teacher/home");
    }
    res.render("teacher/login");
}

exports.postLogin = (req,res,next)=>{
  const uid = req.body.teacherUid;
  console.log("login request for"+ uid);
  const password = req.body.teacherPassword;
  Teacher.findOne({ uid: uid })
  .then(teacher => {
    if (teacher) {
      return bcrypt.compare(password, teacher.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isTeacherLoggedIn = true;
          req.session.teacher = teacher;
          return req.session.save(err => {
            res.redirect("/teacher/home");
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

exports.getTeacherHome = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    const id = req.session.teacher._id;
    Teacher.findOne({ _id: id })
      .then((teacher) => {
        if (!teacher) {
          const err = new Error("teacher not found!");
          return err;
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
            return res.render("teacher/dashboard", {
              teacher: teacher,
              isTeacherLoggedIn: req.session.isTeacherLoggedIn,
              mode: "teacher",
              previousYears: years,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return next(err);
      });
  } else {
    res.redirect("/home");
  }
};

exports.getRecords = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    const year = req.params.year;
    console.log(year);
    Record.findOne({ year: year })
      .then((record) => {
        if (!record) {
          const err = new Error("No record found for this year");
          err.setHttpStatusCode = 200;
          throw err;
        }
        console.log(record);
        res.send(JSON.stringify(record));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = {
          message: err.message,
          redirectRoute: "/teacher/home",
        };
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  }
};

exports.getEditForm = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    const uid = req.params.uid;
    // console.log(uid);
    Teacher.findOne({ uid: uid }, { password: 0, gender:0 })
      .then((teacher) => {
        if (!teacher) {
          const err = new Error("No such teacher found!");
          err.setHttpStatusCode = 200;
          throw err;
        }
        res.send(JSON.stringify(teacher));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = {
          message: err.message,
          redirectRoute: "/teacher/home",
        };
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  }
};

exports.postEditForm = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    console.log(req.body);
    const uid = req.params.uid;
    console.log(uid);
    Teacher.findOne({ uid })
      .then((teacher) => {
        if (!teacher) {
          const err = new Error("No such teacher found!");
          err.setHttpStatusCode = 200;
          throw err;
        }
        teacher.name = req.body.teacherName;
        teacher.email = req.body.teacherEmail;
        teacher.phone = req.body.teacherPhone;
        teacher.department = req.body.teacherDept;
        return teacher.save();
      })
      .then((savedDoc) => {
        const toSend = {
          redirectRoute: "/teacher/home",
          message: "teacher data updated successfully",
        };
        res.send(JSON.stringify(toSend));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = {
          message: err.message,
          redirectRoute: "/teacher/home",
        };
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  }
};



exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
};