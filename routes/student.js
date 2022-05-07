const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student");

router.get("/login", studentController.getLogin);
router.post("/login",studentController.postLogin);
router.get("/home",studentController.getStudentHome);

module.exports = router;
