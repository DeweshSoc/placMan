const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student");

router.get("/signup",studentController.getSignup);
router.post("/signup",studentController.postSignup);
router.get("/login", studentController.getLogin);
router.post("/login",studentController.postLogin);
router.get("/home",studentController.getStudentHome);
router.get("/records/:year",studentController.getRecords);
router.get("/edit/:roll",studentController.getEditForm);
router.post("/edit/:roll",studentController.postEditForm);
router.post("/skills/add/:roll",studentController.postSkillAdd);
router.get("/skills/del/:roll",studentController.getSkillDel);
router.post("/skills/del/:roll",studentController.postSkillDel);
router.get("/apply/:roll/:cid",studentController.getApply)
router.get("/company",studentController.getCompanies);
router.get("/logout",studentController.logout);
module.exports = router;
