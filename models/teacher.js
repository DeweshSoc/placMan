const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender:{
    type:String,
    required:true
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  admin:{
    type:Boolean,
    required:true
  }
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
