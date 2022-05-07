const ObjectId = require("mongoose").Types.ObjectId;
const path = require("path");

exports.checkValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};

exports.convertId = (id) => {
  return new ObjectId(id);
};

exports.rootPath = path.dirname(require.main.filename);

exports.examDuration = 7200000;
