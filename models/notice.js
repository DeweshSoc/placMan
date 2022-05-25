const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noticeSchema = new Schema({
  date:{
    type:Date,
    required:true
  },
  body:{
      type:String,
      required:true
  },
  author:{
      type:{
          uid:String,
          name:String,
          email:String
      },
      required:true
  },
  admin:Boolean
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
