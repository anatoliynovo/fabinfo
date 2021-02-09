/*
CRUD:
    - create
    - read
    - update
    - delete
*/

const express = require('express');
const router = express.Router();
const Material = require('../models/material.model');
const Station = require('../models/station.model');

/********************************* Materials (main) *******************************************/

// POST Material
router.post('/materials', (req, res) => {
  Material.create(new Material(req.body)).then(material => {
    res.send(material);
  });
});

// GET Materials
router.get('/materials', async (req, res) => {
  try {
    const materials = await Material.find().sort({ name: 1 });

    res.send(materials);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// PUT Material
router.put('/materials/:name', (req, res) => {
  Material.findOneAndUpdate(
    { name: req.params.name },
    {
      $set: {
        name: req.body.name,
        image: req.body.image,
        text: req.body.text,
        link: req.body.link
      }
    },
    { new: true }
  ).then(material => {
    console.log(material);
    res.send(material);
  });
});

// DELETE Material
router.delete('/materials/:id', (req, res) => {
  Material.findOneAndDelete({ _id: req.params.id }).then(material => {
    console.log(material);
    res.send(material);
  });
});

/********************************* Materials (device-view) *******************************************/

// POST Material
router.post('/stations/:name/:device/material', (req, res) => {
  console.log(req.body.name);
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    {
      $push: {
        'devices.$.material': {
          image: req.body.image,
          name: req.body.name,
          text: req.body.text,
          link: req.body.link
        }
      }
    },
    { new: true }
  ).then(device => {
    console.log(device);
    res.send(device);
  });
});

// GET Material (Element Length of List)
router.get('/stations/:name/:device/material', async (req, res, next) => {
  try {
    devices = await Station.findOne(
      { name: req.params.name },
      { devices: { $elemMatch: { name: req.params.device } } }
    );

    checklist = devices.devices[0].material;

    if ('devices.checklist' == null) {
      return res.status(404).json({
        message: 'Cannot find devices'
      });
    } else {
      res.send(checklist);
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
  next();
});

// PUT Material
router.put('/stations/:name/:device/changeMaterial', (req, res) => {
  console.log(req.body.materialId);
  const material = 'devices.$.material.' + req.body.position;
  console.log(material);
  console.log(req.body.material.name);
  console.log(req.body.material.text);
  console.log(req.body.material.link);
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    {
      $set: {
        [material]: {
          name: req.body.material.name,
          image: req.body.material.image,
          text: req.body.material.text,
          link: req.body.material.link
        }
      }
    },
    { new: true }
  ).then(material => {
    console.log(material);
    res.send(material);
  });
});

// DELETE Material
router.delete('/stations/:name/:device/deleteMaterial/:id', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $pull: { 'devices.$.material': { _id: req.params.id } } },
    { multi: true }
  ).then(workflow => {
    res.send(workflow);
  });
});

module.exports = router;
