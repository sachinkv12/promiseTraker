const express = require("express");
const Task = require("../modules/TaskSchema");
const app = express.Router();
app.get("/tasks", async (req, res) => {
  try {
    const taskGroups = await Task.find().sort({ createdAt: -1 });
    res.json(taskGroups);
  } catch (error) {
    console.error("Error fetching task groups:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/tasks/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const newStatus = req.body.status;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    const taskGroups = await Task.find().sort({ createdAt: -1 });
    res.json(taskGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/countCompletedTasks", async (req, res) => {
  try {
    // Count tasks where status is 'Completed'
    const completedCount = await Task.countDocuments({ status: "Completed" });

    // Count total tasks
    const totalCount = await Task.countDocuments();

    // Return both counts in the response
    res.json({ completedCount, totalCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching counts", error: error.message });
  }
});

// app.get("/countCompletedTasks/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params; // Extract userId from request parameters

//     // Count tasks where status is 'Completed' and userId matches the specified userId
//     const completedCount = await Task.countDocuments({ status: "Completed", userId: userId });

//     // Count total tasks for the specified userId
//     const totalCount = await Task.countDocuments({ userId: userId });

//     // Return both counts in the response
//     res.json({ completedCount, totalCount });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching counts", error: error.message });
//   }
// });

app.get("/countTasksByGroup/:taskGroupName", async (req, res) => {
  try {
    // Get the task group name from path parameters
    const { taskGroupName } = req.params;

    // Count tasks where status is 'Completed' and belongs to the specific task group
    const completedCount = await Task.countDocuments({
      taskGroup: taskGroupName,
      status: "Completed",
    });

    // Count total tasks in the specific task group
    const totalCount = await Task.countDocuments({
      taskGroup: taskGroupName,
    });

    // Return both counts in the response
    res.json({ completedCount, totalCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching counts", error: error.message });
  }
});

app.put("/category/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { category, status,remark } = req.body;

    const updatedCategory = await Task.findByIdAndUpdate(
      taskId,
      { $set: { category, status,remark } },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Task not found" });
    }

    const taskGroups = await Task.find().sort({ createdAt: -1 });
    res.json(taskGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
