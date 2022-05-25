const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company");

router.get("/signup", companyController.getSignup);
router.post("/signup", companyController.postSignup);
router.get("/login", companyController.getLogin);
router.post("/login", companyController.postLogin);
router.get("/home", companyController.getCompanyHome);
router.get("/edit/:cid",companyController.getEditProf);
router.post("/edit/:cid",companyController.postEditProf);
router.post("/notice",companyController.postNotice);
// router.get("/records/:year", companyController.getRecords);
router.get("/logout", companyController.logout);
module.exports = router;
