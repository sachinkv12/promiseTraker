// const { default: mongoose } = require("mongoose");

// const { json } = require("express");
const UserSchema = require("../modules/UserSchema");
const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");

const storage = multer.memoryStorage(); // Store the file as a Buffer in memory
const upload = multer({ storage: storage });

Router.post("/registration", async (req, res) => {
  const { name, mobilenumber, email, password } = req.body;

  try {
    const existinguser = await UserSchema.findOne({ email: email });
    if (existinguser) {
      return res.status(400).json({ message: "already registerd" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newRegister = new UserSchema({
      name,
      mobilenumber,
      email,
      password: hashedPassword,
    });
    await newRegister.save();
    res.status(201).json({ message: "registration successfuly" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});
Router.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await UserSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profilePic = req.body.profilePic;
    // }

    // Update department if provided
    if (req.body.department) {
      user.department = req.body.department;
    }

    // Update designation if provided
    if (req.body.designation) {
      user.designation = req.body.designation;
    }

    await user.save();

    // Respond with the updated user
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if userId is not provided or not a valid ObjectId
    if (!userId) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await UserSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data as a JSON response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

Router.get("/registeredNames", async (req, res) => {
  try {
    const getData = await UserSchema.find();

    const userNames = getData.map((item) => ({
      id: item._id,
      name: item.name,
    }));

    res.json(userNames);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Router.get('/registeredNames', async (req, res) => {
//   // console.log('sachi')
//   try {
//       const users = await UserSchema.find({}, '_id name');
//       const simplifiedUsers = users.map(user => ({ _id: user._id, name: user.name }));
//       res.json(simplifiedUsers);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
module.exports = Router;
