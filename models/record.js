const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  year:{
      type:String,
      required:true
  },
  data:[{
      roll:Number,
      name:String,
      company:String,
      package:Number
  }]
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
