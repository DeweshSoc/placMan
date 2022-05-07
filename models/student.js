const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  roll:{
      type: String,
      required: true
  },
  password:{
      type: String,
      requires: true
  },
  address:{
      type: String,
      required: true
  },
  cgpa:{
      type: Number,
      required:true
  },
  semCgpa:{
      type:[Number],
      required: true
  },
  photoId:{
      type: String,
      required:true
  },
  placed: Boolean,
  company: String
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
