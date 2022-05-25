const mongoose = require("mongoose");
const Student = require("../models/student");

const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cid:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  eligibility:{
    type: [{field:String,threshold:String}],
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  students:[String],
  estimateOffer:String,
  description:{
      type:String,
      required:true
  }
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
