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
router.get("/logout", teacherController.logout);
module.exports = router;

