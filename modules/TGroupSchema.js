const mongoose = require("mongoose");

const taskGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
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
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
});

const TGroupSchema = mongoose.model("TaskGroup", taskGroupSchema);

module.exports = TGroupSchema;
