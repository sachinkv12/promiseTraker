const express = require("express");
const TGroupSchema = require("../modules/TGroupSchema");
const Task = require("../modules/TaskSchema");

const app = express.Router();
app.post("/TGroups", async (req, res) => {
  try {
    const { groupName, icon, members } = req.body;
    // console.log('body ',req.body)
    //          if (!groupName || !icon || !members) {
    //           return res.status(400).json({ error: 'Missing required fields' });
    //         }

    // Create a new task object
    const newTaskGroup = new TGroupSchema({
      groupName,
      icon,
      members,
      createdAt: new Date(),
    });

    // await newGroup.save();
    const savedTaskGroup = await newTaskGroup.save();
    const allTaskGroups = await TGroupSchema.find();
    res.status(201).json({ savedTaskGroup, allTaskGroups });
  } catch (error) {
    console.error("Error adding newGroup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/TGroups", async (req, res) => {
  try {
    const taskGroups = await TGroupSchema.find().sort({ createdAt: -1 });

    res.json(taskGroups);
  } catch (error) {
    console.error("Error fetching task groups:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;

// app.get("/TGroups", async (req, res) => {
//   // console.log(req)
//   try {
//     const taskGroups = await TGroupSchema.find().sort({ createdAt: -1 });
//     // console.log(res)

//     res.json(taskGroups);
//   } catch (error) {
//     console.error("Error fetching task groups:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//getting tasks using task group id

app.get("/tasks/:taskGroupId", async (req, res) => {
  try {
    const taskGroupId = req.params.taskGroupId;

    // Find the TaskGroup by ID
    const taskGroup = await TGroupSchema.findById(taskGroupId);
    console.log(taskGroup, "get");

    if (!taskGroup) {
      return res.status(404).json({ message: "TaskGroup not found" });
    }

    // Find all tasks with the specified taskGroupId
    const tasks = await Task.find({ "taskGroup.id": taskGroupId });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/TGroup/:TGroupId", async (req, res) => {
  const TGroupId = req.params.TGroupId; // Ensure TGroupId is only the _id value

  const { groupName, icon, members } = req.body;

  try {
    const updatedTGroup = await TGroupSchema.findByIdAndUpdate(
      TGroupId,
      { groupName, icon, members },
      { new: true }
    );

    if (!updatedTGroup) {
      return res.status(404).json({ message: "TGroup not found" });
    }

    res.json(updatedTGroup);
    // console.log(updatedTGroup, "update");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/members/:TGroupId", async (req, res) => {
  const TGroupId = req.params.TGroupId;

  try {
    // Use populate to get members based on TGroupId
    const tgroup = await TGroupSchema.findOne({ _id: TGroupId }).populate(
      "members"
    );

    if (!tgroup) {
      return res
        .status(404)
        .json({ message: "TGroup not found for the specified TGroupId" });
    }

    const members = tgroup.members;
    res.json(members);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use Mongoose's findOneAndDelete to find and delete the document by ID
    const deletedTask = await TGroupSchema.findOneAndDelete({ _id: id });

    if (deletedTask) {
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = app;
