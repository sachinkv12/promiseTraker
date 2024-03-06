const express = require("express");
const Task = require("../modules/TaskSchema");
const Notification = require("../modules/Notification");
const UserSchema = require("../modules/UserSchema");
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
    const ownerId = owner.id; // Extracting owner id
    const ownerName = owner.name;
    const newTask = new Task({
      owner, // Assigning owner id as a string
      taskGroup,
      taskName,
      description,
      people,
      startDate,
      endDate,
      reminder,
      createdAt: new Date(),
    });

    // Use the asynchronous function to add the taskz
    let taskNew = await newTask.save();
    // console.log("task",taskNew);
    const taskId = taskNew._id;

    for (const assignedUser of people) {
      const { id, name } = assignedUser;

      const newNotification = new Notification({
        title: `${ownerName} assigning task to you`,
        description: `New task: ${taskName}`,
        status: "pending",
        userid: id, // Assign user id to userid
        owner: `${ownerName}`,
        taskId: taskId,
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

app.post("/notifications/reply", async (req, res) => {
  try {
    const { userId, taskId, status,comment  } = req.body;

    // Retrieve the task information to get ownerName and taskName
    const user = await UserSchema.findById(userId);
    // console.log("user",user)

    // Fetch task information
    const task = await Task.findById(taskId);
    // console.log(task)
    const taskName = task.taskName;
    const ownerId = task.owner.id;
    // console.log(ownerId);
    let description = `Task: ${taskName}`;
    if (comment) {
      description += `\nComment: ${comment}`; // Append comment to the description
    }
    const newNotification = new Notification({
      title: `${user.name} ${
        status === "accepted" ? "accepted" : "rejected"
      } the task`,
      description: `Task: ${taskName}`,
      status: status,
      userid: ownerId, // Send the notification to the task owner
      owner: user.name,
      taskId: taskId,
      created: new Date(),
    });

    await newNotification.save();

    res.status(201).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error replying to task notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Use the 'find' method to get notifications for a particular user
    const userNotifications = await Notification.find({ userid: userId });

    // Send the retrieved notifications as a JSON response
    res.json(userNotifications);
  } catch (error) {
    console.error("Error retrieving user notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
