const bcrypt = require("bcryptjs");

const Teacher = require("../models/teacher");
const Record = require("../models/record");
const Student = require("../models/student");
const Notice = require("../models/notice");
const Company = require("../models/company");

exports.getSignup = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    return res.redirect("/teacher/home");
  }
  res.render("teacher/signup");
};

exports.postSignup = (req, res, next) => {
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
            gender: req.body.teacherGender,
            admin: false,
          });
          return newTeacher.save();
        });
    })
    .then((teacher) => {
      const toSend = {
        message: "New teacher Added!",
        redirectRoute: "/teacher/login",
      };
      return res.send(JSON.stringify(toSend));
    })
    .catch((err) => {
      console.log(err);
      const responseMsg = {
        message: err.message,
        redirectRoute: "/home",
      };
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    });
};

exports.getLogin = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    return res.redirect("/teacher/home");
  }
  res.render("teacher/login");
};

exports.postLogin = (req, res, next) => {
  const uid = req.body.teacherUid;
  console.log("login request for" + uid);
  const password = req.body.teacherPassword;
  Teacher.findOne({ uid: uid })
    .then((teacher) => {
      if (teacher) {
        return bcrypt.compare(password, teacher.password).then((doMatch) => {
          if (doMatch) {
            req.session.isTeacherLoggedIn = true;
            req.session.teacher = teacher;
            return req.session.save((err) => {
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
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

exports.getTeacherHome = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    const id = req.session.teacher._id;
    let years=[];
    Teacher.findOne({ _id: id })
    .then((teacher) => {
      if (!teacher) {
        const err = new Error("teacher not found!");
        return err;
      }
      return Record.find({})
      .then((records) => {
        records.forEach((rec) => {
          years.push(rec.year);
        });
      })
      .then(()=>{
        return Notice.find({}).sort({date:-1})
      })
      .then(notices => {
        const compNotices = [];
        const adminNotices =[];
        for(let i=0;i<notices.length;i++){
          if(notices[i].admin==true){
            adminNotices.push(notices[i]);
          }else{
            compNotices.push(notices[i]);
          }
        }
        return res.render("teacher/dashboard", {
          teacher: teacher,
          isTeacherLoggedIn: req.session.isTeacherLoggedIn,
          mode: "teacher",
          previousYears: years,
          notices:adminNotices,
          compNotices:compNotices
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
    Teacher.findOne({ uid: uid }, { password: 0, gender: 0 })
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

exports.getStudent = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {
    const roll = req.params.roll;
    console.log(roll);
    if (roll == 0) {
      Student.find({}, { password: 0, _id: 0, __v: 0 })
        .then((students) => {
          if (!students.length) {
            const err = new Error("No students found!");
            err.setHttpStatusCode = 200;
            throw err;
          }
          res.send(JSON.stringify(students));
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
    } else {
      Student.findOne({ roll: roll },{password:0,_id:0, __v:0})
        .then((student) => {
          if (!student) {
            const err = new Error("No student found!");
            err.setHttpStatusCode = 200;
            throw err;
          }
          res.send(JSON.stringify(student));
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
  }
};

exports.postFilterStudents=(req,res,next)=>{
  if(req.session.isTeacherLoggedIn){
    const gender = req.body.gender;
    const branch = req.body.branch;
    const status = req.body.status;
    const company = req.body.company;
    const name = req.body.name;
    console.log(gender,branch,status,company,name);
    const placedQuery = (req.body.status=="Placed")?true:false;
    const toSendStudents=[];
    Student.find({})
    .then(students=>{
      console.log(students.length);
      const genderFiltered =[];
      if(gender!="Select gender"){
        for(let i=0;i<students.length;i++){
          if(students[i].gender==gender){
            genderFiltered.push(students[i]);
          }
        }
      }
      const prev1 = (gender != "Select gender")?genderFiltered:students;
      const branchFiltered=[];
      if(branch!="Select branch"){
        for (let i = 0; i < prev1.length; i++) {
          if (prev1[i].branch == branch) {
            branchFiltered.push(prev1[i]);
          }
        }
      }
      const prev2 = (branch != "Select branch")?branchFiltered:prev1;
      const statusFiltered=[];
      if(status!="Select status"){
        for (let i = 0; i < prev2.length; i++) {
          if (prev2[i].placed == placedQuery) {
            statusFiltered.push(prev2[i]);
          }
        }
      }
      const prev3 = (status != "Select status") ? statusFiltered : prev2;
      const companyFiltered=[];
      for (let i = 0; i < prev3.length; i++) {
        if (prev3[i].company == company) {
          companyFiltered.push(prev3[i]);
        }
      }
      const prev4 = (company!="Select company")?companyFiltered:prev3;
      const nameFiltered=[];
      console.log(prev4);
        for (let i = 0; i < prev4.length; i++) {
          if (prev4[i].name == name) {
            nameFiltered.push(prev4[i]);
          }
        }
      return (name=="")?prev4:nameFiltered;
    })
    .then(students=>{
      res.send(JSON.stringify(students));
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = {
        message: err.message,
        redirectRoute: "/teacher/home",
      };
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    })
  }else{
    res.redirect("/home");
  }
}


exports.postNotice=(req,res,next)=>{
  if(req.session.isTeacherLoggedIn){
    const noticeBody = req.body.notice;
    const newNotice = new Notice({
      date:new Date(),
      body:noticeBody,
      author:{
        uid:req.session.teacher.uid,
        name:req.session.teacher.name,
        email:req.session.teacher.email
      },
      admin:(req.body.admin=="true")
    });
    newNotice.save()
    .then(savedDoc=>{
      const toSend = {
        message:"New notice added",
        redirectRoute:"/teacher/home"
      }
      res.send(JSON.stringify(toSend));
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = {
        message: err.message,
        redirectRoute: "/teacher/home",
      };
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    })
  }else{
    res.redirect("/home");
  }
}


exports.getBlock=(req,res,next)=>{
  if(req.session.isTeacherLoggedIn){
    let blocked;
    const roll = req.params.roll;
    Student.findOne({roll:roll})
    .then(student=>{
      if(!student){
       const err = new Error("No student found!");
       throw err; 
      }
      if(student.blocked){
        student.blocked=false;
        blocked = false;
      }else{
        student.blocked = true;
        blocked = true;
      }
      return student.save();
    })
    .then(savedDoc=>{
      const responseMsg={
        message:(blocked)?"Student blocked":"Student unblocked",
        redirectRoute:"/teacher/home"
      }
      res.send(JSON.stringify(responseMsg));
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = {
        message: err.message,
        redirectRoute: "/teacher/home",
      };
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    })
  }
}

exports.getPlaced=(req,res,next)=>{
  if (req.session.isTeacherLoggedIn) {
    let placed;
    const roll = req.params.roll;
    Student.findOne({ roll: roll })
      .then((student) => {
        if (!student) {
          const err = new Error("No student found!");
          throw err;
        }
        if (student.placed) {
          student.placed = false;
          placed = false;
        } else {
          student.placed = true;
          placed = true;
        }
        return student.save();
      })
      .then((savedDoc) => {
        const responseMsg = {
          message: placed ? "Student placed" : "Student Unplaced",
          redirectRoute: "/teacher/home",
        };
        res.send(JSON.stringify(responseMsg));
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
}

exports.getDeleteStudent=(req,res,next)=>{
  if (req.session.isTeacherLoggedIn) {
    console.log("in cone");
    const roll = req.params.roll;
    Student.findOne({ roll: roll })
      .then((student) => {
        if (!student) {
          const err = new Error("No student found!");
          throw err;
        }
        return Student.deleteOne({roll:roll})
      })
      .then((savedDoc) => {
        const responseMsg = {
          message: "Student deleted from the system",
          redirectRoute: "/teacher/home",
        };
        res.send(JSON.stringify(responseMsg));
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
}

exports.getReport=(req,res,next)=>{
  if(req.session.isTeacherLoggedIn){
    let totalCompanies = 0;
    const report = {};
    Company.find({})
    .then(companies=>{
      report.companies = companies;
      return Student.find({placed:true})
      .then(students=>{
        report.students=students;
        res.send(JSON.stringify(report));
      })
    })
    .catch(err=>{
      console.log(err);
      const responseMsg = {
        message: err.message,
        redirectRoute: "/teacher/home",
      };
      res.status(500);
      res.send(JSON.stringify(responseMsg));
    })
  }
}

exports.getCompanies = (req, res, next) => {
  if (req.session.isTeacherLoggedIn) {

    Company.find({}, { cid: 0, password: 0, _id: 0, __v: 0 })
      .then((companies) => {
        if (!companies.length) {
          const err = new Error("No companies found!");
          err.setHttpStatusCode = 200;
          throw err;
        }
        console.log(companies);
        res.send(JSON.stringify(companies));
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

// Companies participated : 
//                   <br>
//                   Students placed :>
//                   <br>
//                   Placement percentage : 98%
//                   <br>
//                   Departments participated : 14
//                   <br>
//                   Average package : 7 LPA