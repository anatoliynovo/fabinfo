/*
CRUD:
    - create
    - read
    - update
    - delete
*/

const express = require('express');
const router = express.Router();
const Safety = require('../models/safety.model');

/********************************* Safety *******************************************/

// POST Items
router.post('/safety', (req, res) => {
  Safety.create(new Safety(req.body)).then(item => {
    res.send(item);
  });
});

// GET Items
router.get('/safety', async (req, res) => {
  try {
    const items = await Safety.find();
    res.send(items);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// PUT Items
router.put('/safety/:name', (req, res) => {
  console.log(req.params.name);
  Safety.findOneAndUpdate(
    { name: req.params.name },
    { $set: { name: req.body.name, file: req.body.file } },
    { new: true }
  ).then(item => {
    console.log(item);
    res.send(item);
  });
});

// DELETE Items
router.delete('/safety/:id', (req, res) => {
  Safety.findOneAndDelete({ _id: req.params.id }).then(item => {
    console.log(item);
    res.send(item);
  });
});

module.exports = router;
