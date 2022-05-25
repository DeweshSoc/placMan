const bcrypt = require("bcryptjs");


const Company = require("../models/company");
const Notice = require("../models/notice");

exports.getSignup = (req, res, next) => {
  if (!req.session.isCompanyLoggedIn) {
    return res.render("company/signup");
  }
  res.redirect("/company/home");
};

exports.postSignup = (req, res, next) => {
  console.log(req.body);
  const eligibility=[];
  const fields = JSON.parse(req.body.elegFields);
  const thresholds = JSON.parse(req.body.elegThresholds);
  for(let i=0;i<fields.length;i++){
    eligibility.push({
      field:fields[i],
      threshold : thresholds[i]
    })
  }
  Company.findOne({ cid: req.body.companyId })
    .then((company) => {
      if (company) {
        const err = new Error(
          "This uid is already registered. Contact admin for changes."
        );
        err.setHttpStatusCode = 200;
        throw err;
      }
      return bcrypt
        .hash(req.body.companyPassword, 12)
        .then((hashedPassword) => {

          const newCompany = new Company({
            name: req.body.companyName,
            cid: req.body.companyId,
            password: hashedPassword,
            category: req.body.companyCategory,
            email: req.body.companyEmail,
            phone: req.body.companyPhone,
            description: req.body.companyDescription,
            eligibility : eligibility,
            estimateOffer : req.body.estimateOffer
          });
          return newCompany.save();
        });
    })
    .then((company) => {
      const toSend = {
        message: "New company Added!",
        redirectRoute: "/company/login",
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
  if (req.session.isCompanyLoggedIn) {
    return res.redirect("/company/home");
  }
  res.render("company/login");
};


exports.postLogin = (req, res, next) => {
        const cid = req.body.companyId;
        console.log("login request for" + cid);
  const password = req.body.companyPassword;
  Company.findOne({ cid: cid })
  .then((company) => {
      if (company) {
          return bcrypt.compare(password, company.password).then((doMatch) => {
              if (doMatch) {
            req.session.isCompanyLoggedIn = true;
            req.session.company = company;
            return req.session.save((err) => {
              res.redirect("/company/home");
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
}


exports.getCompanyHome = (req, res, next) => {
  if (req.session.isCompanyLoggedIn) {
    const id = req.session.company._id;
    Company.findOne({ _id: id })
      .then((company) => {
        if (!company) {
          const err = new Error("Company not found!");
          return err;
        }
        return Notice.find({}).sort({ date: -1 })
        .then((notices) => {
          const compNotices = [];
          const adminNotices = [];
          for (let i = 0; i < notices.length; i++) {
            if (notices[i].admin == true) {
              adminNotices.push(notices[i]);
            } else {
              compNotices.push(notices[i]);
            }
          }
          res.render("company/dashboard", {
            company: company,
            isCompanyLoggedIn: req.session.isCompanyLoggedIn,
            mode: "company",
            compNotices:compNotices
          });
        })
      })
      .catch((err) => {
        console.log(err);
        return next(err);
      });
  } else {
    res.redirect("/home");
  }
};

exports.getEditProf=(req,res,nxt)=>{
  if (req.session.isCompanyLoggedIn) {
    const cid = req.params.cid;
    Company.findOne({ cid: cid }, { password: 0 })
      .then((company) => {
        if (!company) {
          const err = new Error("No such company found!");
          err.setHttpStatusCode = 200;
          throw err;
        }
        res.send(JSON.stringify(company));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = {
          message: err.message,
          redirectRoute: "/company/home",
        };
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  }
}

exports.postEditProf=(req,res,next)=>{
  if (req.session.isCompanyLoggedIn) {
    console.log(req.body);
    const cid = req.params.cid;
    console.log(cid);
    Company.findOne({ cid })
      .then((company) => {
        if (!company) {
          const err = new Error("No such company found!");
          err.setHttpStatusCode = 200;
          throw err;
        }
        company.name = req.body.companyName;
        company.email = req.body.companyEmail;
        company.phone = req.body.companyPhone;
        company.description = req.body.companyDescription;
        company.category = req.body.companyCategory;
        company.estimateOffer = req.body.companyOffer;
        return company.save();
      })
      .then((savedDoc) => {
        const toSend = {
          redirectRoute: "/company/home",
          message: "company data updated successfully",
        };
        res.send(JSON.stringify(toSend));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = {
          message: err.message,
          redirectRoute: "/company/home",
        };
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  }
}
exports.postNotice = (req, res, next) => {
  if (req.session.isCompanyLoggedIn) {
    console.log(req.body);
    const noticeBody = req.body.notice;
    const newNotice = new Notice({
      date: new Date(),
      body: noticeBody,
      author: {
        uid: req.session.company.cid,
        name: req.session.company.name,
        email: req.session.company.email,
      },
      admin: (req.body.admin == "true"),
    });
    newNotice
      .save()
      .then((savedDoc) => {
        const toSend = {
          message: "New notice added",
          redirectRoute: "/company/home",
        };
        res.send(JSON.stringify(toSend));
      })
      .catch((err) => {
        console.log(err);
        const responseMsg = {
          message: err.message,
          redirectRoute: "/company/home",
        };
        res.status(500);
        res.send(JSON.stringify(responseMsg));
      });
  } else {
    res.redirect("/home");
  }
};


exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
};