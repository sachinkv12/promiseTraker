const express = require('express');
const TGroupSchema = require('../modules/TGroupSchema')
const app = express.Router();

app.post('/TGroups', async (req, res) => {
    try {
      const { groupName, icon } = req.body;
  
      if (!groupName || !icon) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const newTaskGroup = new TGroupSchema({ groupName, icon,createdAt: new Date() });
  
      // Save the task group to the database
      const savedTaskGroup = await newTaskGroup.save();
      const allTaskGroups = await TGroupSchema.find();

  
      res.status(201).json({ savedTaskGroup, allTaskGroups });
    } catch (error) {
      console.error('Error creating task group:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

    app.get('/TGroups', async (req, res) => {
    try {
      const taskGroups = await TGroupSchema.find().sort({ createdAt: -1 });
  
      res.json(taskGroups);
    } catch (error) {
      console.error('Error fetching task groups:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports=app;
