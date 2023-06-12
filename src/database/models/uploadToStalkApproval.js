const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  requester: String,
  stalkedUser: String,

});;

module.exports = mongoose.model("uploadToStalkApproval", Schema);