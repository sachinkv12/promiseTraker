const mongoose = require('mongoose');

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
  createdAt :Date
});

const TGroupSchema = mongoose.model('TaskGroup', taskGroupSchema);

module.exports = TGroupSchema;
