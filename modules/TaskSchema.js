const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskGroup: { type: String },
  taskName: { type: String },
  description: { type: String },
  people: { type: [String] },
  startDate: { type:String },
  endDate: { type: String },
  reminder: { type: String },
  status:{type: String},
  createdAt :Date

});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
