const express=require('express')
const Task =(require('../modules/TaskSchema'))
const app = express.Router();
app.get('/tasks', async (req, res) => {
  try {
    const taskGroups = await Task.find().sort({ createdAt: -1 });
    res.json(taskGroups);
  } catch (error) {
    console.error('Error fetching task groups:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
  });
  app.put('/tasks/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const newStatus = req.body.status;
  
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $set: { status: newStatus } },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      const taskGroups = await Task.find().sort({ createdAt: -1 });
      res.json(taskGroups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  

  module.exports=app;
  
 