const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student");

router.get("/login", studentController.getLogin);
router.post("/login",studentController.postLogin);
router.get("/home",studentController.getStudentHome);
router.get("/records/:year",studentController.getRecords);
router.get("/logout",studentController.logout);
module.exports = router;
