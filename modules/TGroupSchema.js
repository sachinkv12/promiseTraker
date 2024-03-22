const mongoose = require("mongoose");

const taskGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  // icon: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  createdAt: Date,
  // selectedItems: {
  //   type: String,
  //   // require: true,
  // },
  // name: {
  //   type: String,
  //   // required: true,
  // },
  members: [
    {
      userId: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  profilePic:{type:String},
  deptHead:{type:String},
  projectLead:{type:String},
});

const TGroupSchema = mongoose.model("TaskGroup", taskGroupSchema);

module.exports = TGroupSchema;
