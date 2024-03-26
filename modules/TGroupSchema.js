const mongoose = require("mongoose");

const taskGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    // required: true,
    // trim: true,
  }, 
  deptHead:[
    {
      id: String,name:String
    },
  ],
  projectLead:[
    {
      id: String,name:String
    },
  ],
  members: [
    {
      id: String,name:String
    },
  ],
  profilePic:{type:String},
 
  createdAt: Date,
});

const TGroupSchema = mongoose.model("TaskGroup", taskGroupSchema);

module.exports = TGroupSchema;
