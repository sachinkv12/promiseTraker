const express = require("express");
const Task = require("../modules/TaskSchema");
const Notification = require("../modules/Notification");
const app = express.Router();
const { Expo } = require("expo-server-sdk");

const expo = new Expo();

app.post("/tasks", async (req, res) => {
  try {
    const {
      owner,
      taskGroup,
      taskName,
      description,
      people,
      startDate,
      endDate,
      reminder,
    } = req.body;

    // Create a new task object
    // const peopleArray = Array.isArray(people) ? 
    // people.map(person => (typeof person === 'object' ? person : { id: person, name: person })) :
    // [{ id: people, name: people }];
    const newTask = new Task({
      owner,
      taskGroup,
      taskName,
      description,
      people,
      startDate,
      endDate,
      reminder,
      createdAt: new Date(),
    });

    // Use the asynchronous function to add the task
    await newTask.save();

    for (const assignedUser of people) {
      const { id, name } = assignedUser;

      const newNotification = new Notification({
        title: `${owner} assigning task to you`,
        description: `New task: ${taskName}`,
        // time: reminder, // Adjust as needed
        status: "pending",
        userid: id, // Assign user id to userid
        owner: `${owner}`,
        created: new Date(),
      });

      await newNotification.save();
    }

    const allTasks = await Task.find();
    res.status(201).json({ newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Use the 'find' method to get notifications for a particular user
    const userNotifications = await Notification.find({ userid: userId });

    // Send the retrieved notifications as a JSON response
    res.json(userNotifications);
  } catch (error) {
    console.error('Error retrieving user notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
