const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacher");

router.get("/signup", teacherController.getSignup);
router.post("/signup", teacherController.postSignup);
router.get("/login", teacherController.getLogin);
router.post("/login", teacherController.postLogin);
router.get("/home",teacherController.getTeacherHome);
router.get("/records/:year", teacherController.getRecords);
router.get("/edit/:uid", teacherController.getEditForm);
router.post("/edit/:uid", teacherController.postEditForm);
router.get("/student/:roll", teacherController.getStudent);
router.post("/filter",teacherController.postFilterStudents);
router.post("/notices",teacherController.postNotice);
router.get("/block/:roll",teacherController.getBlock);
router.get("/place/:roll",teacherController.getPlaced);
router.get("/delete/:roll",teacherController.getDeleteStudent);
router.get("/company",teacherController.getCompanies);
router.get("/report",teacherController.getReport);
router.get("/logout", teacherController.logout);
module.exports = router;

