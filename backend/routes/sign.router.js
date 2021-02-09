/*
CRUD:
    - create
    - read
    - update
    - delete
*/

const express = require('express');
const router = express.Router();
const Signs = require('../models/sign.model');
const Station = require('../models/station.model');

/********************************* Signs *******************************************/

// POST Signs
router.post('/signs', (req, res) => {
  Signs.create(new Signs(req.body)).then(sign => {
    res.send(sign);
  });
});

// GET Signs
router.get('/signs', async (req, res) => {
  try {
    const signs = await Signs.find();
    res.send(signs);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// PUT Signs
router.put('/signs/:name', (req, res) => {
  Signs.findOneAndUpdate(
    { name: req.params.name },
    { $set: { name: req.body.name, image: req.body.image } },
    { new: true }
  ).then(sign => {
    console.log(sign);
    res.send(sign);
  });
});

// DELETE Signs
router.delete('/signs/:id', (req, res) => {
  Signs.findOneAndDelete({ _id: req.params.id }).then(sign => {
    console.log(sign);
    res.send(sign);
  });
});

/********************************* Signs in Device *******************************************/
// POST Signs in Device
router.post('/stations/:name/:device/signs', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $push: { 'devices.$.signs': req.body } },
    { new: true }
  ).then(signs => {
    console.log('Signs: ' + signs);
    res.send(signs);
  });
});

// DELETE Signs in Device
router.delete('/stations/:name/:device/deleteSign/:id', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $pull: { 'devices.$.signs': { _id: req.params.id } } },
    { new: true }
  ).then(sign => {
    res.send(sign);
  });
});

module.exports = router;
