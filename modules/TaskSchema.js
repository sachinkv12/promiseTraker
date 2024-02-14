
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  owner: { type: String },
  taskGroup: { type: String },
  taskName: { type: String },
  description: { type: String },
  people: [{ id: String, name: String }],
  startDate: { type: String },
  endDate: { type: String },
  reminder: { type: String },
  status: { type: String },
  createdAt: { type: Date }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

