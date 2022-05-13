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
      required: true
  },
  gender:{
      type:String,
      required:true
  },
  dob:{
      type: Date,
      required:true
  },
  homeInfo:{
      type: {parentName1:String, parentName2:String, occupation1: String, occupation2:String},
      required:true
  },
  address:{
      type: String,
      required: true
  },
  branch:{
      type:String,
      required: true,
  },
  cgpa:{
      type: Number,
      required:true
  },
  semCgpa:{
      type:[Number],
      required: true
  },
  passoutYr:{
      type:String,
      required:true
  },
  skills:{
      type:[String],
      required:true
  },
  metricMarks:{
      type:Number,
      required:true
  },
  hscMarks:{
      type:Number,
      required:true
  },
  email:{
      type:String,
      required:true
  },
  phone:{
      type:String,
      required:true
  },
  placed: Boolean,
  company: String
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

