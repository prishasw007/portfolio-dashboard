const express = require("express");
const router = express.Router();
const AccountSetting = require("../models/AccountSetting");

// Create a new account setting
router.post("/", async (req, res) => {
  try {
    const setting = new AccountSetting(req.body);
    await setting.save();
    res.status(201).json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all account settings
router.get("/", async (req, res) => {
  try {
    const settings = await AccountSetting.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one by ID
router.get("/:id", async (req, res) => {
  try {
    const setting = await AccountSetting.findById(req.params.id);
    if (!setting) return res.status(404).json({ error: "Not found" });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Update by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await AccountSetting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Delete by ID 
router.delete("/:id", async (req, res) => {
  try {
    await AccountSetting.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
