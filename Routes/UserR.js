// const { default: mongoose } = require("mongoose");

const { json } = require("express");
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

Router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // console.log('user',userId)
    const profile = await UserSchema.findById(userId);

    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Router.get("/registeredNames", async (req, res) => {
  try {
    const getData = await UserSchema.find();
    const names = getData.map((item) => item.name);

    res.json(names);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = Router;
