const express=require('express')
const Task =(require('../modules/TaskSchema'))
const app = express.Router();
app.post('/tasks', async (req, res) => {
    try {
      const {
        taskGroup,
        taskName,
        description,
        people,
        startDate,
        endDate,
        reminder,
      } = req.body;
  
    
  
      // Create a new task object
      const newTask = new Task ({
        taskGroup,
        taskName,
        description,
        people,
        startDate,
        endDate,
        reminder,
        createdAt: new Date()
      });
  
      // Use the asynchronous function to add the task
      await newTask.save();  
      // Respond with the newly created task
      // res.status(201).json([newTask]);
      const allTasks = await Task.find();
      res.status(201).json(allTasks);

      // console.log('data',newTask)
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports=app;