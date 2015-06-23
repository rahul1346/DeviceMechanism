var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/user-devices", {native_parser:true});

module.exports = db;
module.exports.toObjectID = mongo.helper.toObjectID;