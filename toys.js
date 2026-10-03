const express = require("express");
const { ToyModel, validateToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  try {
    const data = await ToyModel.find({}).limit(10).skip(skip);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const searchQ = req.query.s;
  try {
    const searchReg = new RegExp(searchQ, "i");
    const data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] }).limit(10).skip(skip);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/category/:catname", async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  try {
    const data = await ToyModel.find({ category: req.params.catname }).limit(10).skip(skip);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/prices", async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const min = req.query.min ? Number(req.query.min) : 0;
  const max = req.query.max ? Number(req.query.max) : Infinity;
  try {
    const data = await ToyModel.find({ price: { $gte: min, $lte: max } }).limit(10).skip(skip);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    const data = await ToyModel.findById(req.params.id);
    if (!data) return res.status(404).json({ msg: "Toy not found" });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await ToyModel.countDocuments({});
    return res.json({ count });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateToy(req.body);
  if (error) return res.status(400).json({ msg: error.details.message });
  try {
    const newToy = new ToyModel(req.body);
    newToy.user_id = req.tokenData._id;
    await newToy.save();
    return res.status(201).json(newToy);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:EDITID", auth, async (req, res) => {
  const { error } = validateToy(req.body);
  if (error) return res.status(400).json({ msg: error.details.message });
  try {
    const editId = req.params.EDITID;
    let data;
    
    if (req.tokenData.role === "ADMIN") {
      data = await ToyModel.updateOne({ _id: editId }, req.body);
    } else {
      data = await ToyModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body);
    }

    if (data.matchedCount === 0) return res.status(400).json({ msg: "Update failed. Unauthorized or toy not found." });
    return res.json({ msg: "Toy updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:DELID", auth, async (req, res) => {
  try {
    const delId = req.params.DELID;
    let data;

    if (req.tokenData.role === "ADMIN") {
      data = await ToyModel.deleteOne({ _id: delId });
    } else {
      data = await ToyModel.deleteOne({ _id: delId, user_id: req.tokenData._id });
    }

    if (data.deletedCount === 0) return res.status(400).json({ msg: "Delete failed. Unauthorized or toy not found." });
    return res.json({ msg: "Toy deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
