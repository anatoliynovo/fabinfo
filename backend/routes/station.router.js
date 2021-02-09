/*
CRUD:
    - create
    - read
    - update
    - delete
*/

const express = require('express');
const router = express.Router();
const Station = require('../models/station.model');
const multer = require('multer');

const upload = multer({});

/********************************* STATIONS *******************************************/

// POST Station
router.post('/stations', (req, res) => {
  Station.create(new Station({ name: req.body.name })).then(station => {
    console.log(station);
  });
});

//GET All Stations
router.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find();
    res.send(stations);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// PUT Station (Name)
router.put('/stations/:name', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name },
    { $set: { name: req.body.name } },
    { new: true }
  ).then(station => {
    console.log(station);
    res.send(station);
  });
});

// DELETE Station
router.delete('/stations/:id', (req, res) => {
  Station.findOneAndRemove({ _id: req.params.id }).then(station => {
    console.log(station);
    res.send(station);
  });
});

/********************************* DEVICES *******************************************/

// POST Device
router.post('/stations/:name', (req, res) => {
  const deviceName = req.body.name.trim();
  Station.findOneAndUpdate(
    { name: req.params.name },
    { $push: { devices: { name: deviceName, image: req.body.image } } },
    { new: true }
  ).then(device => {
    console.log(device);
    res.send(device);
  });
});

// POST cloned Device
router.post('/stations/clone/:name', (req, res) => {
  console.log(req.params.name);
  console.log(req.body.name);

  Station.findOneAndUpdate(
    { name: req.params.name },
    {
      $push: {
        devices: {
          name: req.body.name,
          manual: req.body.manual,
          workflows: req.body.workflows,
          material: req.body.material,
          overview: req.body.overview
        }
      }
    },
    { new: true }
  ).then(device => {
    console.log(device);
    res.send(device);
  });
});

//GET All Devices in Station
router.get('/stations/:name', async (req, res, next) => {
  try {
    devices = await Station.findOne({ name: req.params.name }).distinct(
      'devices'
    );
    if (devices == null) {
      return res.status(404).json({
        message: 'Cannot find devices'
      });
    } else {
      res.send(devices);
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
  next();
});

// GET One Device in Devices (for detailed device-view)
router.get('/stations/:name/:device', async (req, res, next) => {
  try {
    // get device with the name from url
    devices = await Station.findOne(
      { name: req.params.name },
      { devices: { $elemMatch: { name: req.params.device } } }
    );

    // if no devices with this name available or only _id is returned
    if (devices == null || Object.keys(devices.toObject()).length == 1) {
      return res.status(404).json({
        message: 'Cannot find any information of device'
      });
    } else {
      res.send(devices);
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
  next();
});

//PUT Device
router.put('/stations/:name/:device', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $set: { 'devices.$.name': req.body.name, 'devices.$.image': req.body.image } },
    { new: true }
  ).then(device => {
    console.log(device);
    res.send(device);
  });
});

// DELETE Device
router.delete('/stations/:name/:id', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name },
    { $pull: { devices: { _id: req.params.id } } },
    { new: true }
  ).then(device => {
    console.log(device);
    res.send(device);
  });
});

/******************************************************************************/ 

// -------------------------------- Overview --------------------------------- //

// POST File (img) --> Upload file (passed from Angular input field) to DB and store as base64 string
router.post(
  '/stations/:name/:device/upload/overview',
  upload.single('file'),
  (req, res) => {
    const encodedImg = req.file.buffer.toString('base64');
    Station.findOneAndUpdate(
      { name: req.params.name, 'devices.name': req.params.device },
      { $push: { 'devices.$.overview': encodedImg } },
      { new: true }
    ).then(img => {
      console.log(img);
      res.send(img);
    });
  }
);

// DELETE File (img)
router.delete('/stations/:name/:device/deleteOverview/:img', (req, res) => {
  console.log('Image: ' + req.params.img);
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $pop: { 'devices.$.overview': -1 } },
    { new: true }
  ).then(img => {
    console.log(img);
    res.send(img);
  });
});

// -------------------------------- Workflows --------------------------------- //

// POST Workflow
router.post('/stations/:name/:device/addWorkflow', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $push: { 'devices.$.workflows': { name: req.body.name } } },
    { new: true }
  ).then(workflow => {
    console.log('Workflow: ' + workflow);
    res.send(workflow);
  });
});

// GET Workflows
router.get('/stations/:name/:device/workflows', async (req, res, next) => {
  try {
    workflow = await Station.distinct('devices.workflows', {
      name: req.params.name,
      'devices.name': req.params.device
    });
    res.send(workflow);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
  next();
});

//PUT Workflow
router.put('/stations/:name/:device/editWorkflow/:workflow', (req, res) => {
  const workflow = 'devices.$.workflows.' + req.body.position;
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $set: { [workflow]: req.body.workflow } },
    { new: true }
  ).then(workflow => {
    res.send(workflow);
  });
});

// DELETE Workflow
router.delete(
  '/stations/:name/:device/deleteWorkflow/:id',
  (req, res) => {
    Station.findOneAndUpdate(
      { name: req.params.name, 'devices.name': req.params.device },
      { $pull: { 'devices.$.workflows': { _id: req.params.id } } },
      { new: true }
    ).then(workflow => {
      res.send(workflow);
    });
  }
);

// --- Workflow Steps --- //

// POST Step (of workflow)
router.post('/stations/:name/:device/workflow/step', (req, res) => {
  const workflowStep = 'devices.$.workflows.' + req.body.position + '.steps';
  Station.findOneAndUpdate(
    {
      name: req.params.name,
      'devices.name': req.params.device,
      'devices.workflows.name': req.body.workflow
    },
    {
      $push: {
        [workflowStep]: {
          number: req.body.number,
          image: req.body.image,
          text: req.body.text,
          checkpoint: req.body.checkpoint
        }
      }
    },
    { new: true }
  ).then(step => {
    res.send(step);
  });
});

// GET Step (of workflow)
router.get('/stations/:name/:device/workflow/steps', async (req, res, next) => {
  try {
    steps = await Station.distinct('devices.workflows.steps', {
      name: req.params.name,
      'devices.name': req.params.device
    });
    res.send(steps);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
  next();
});

//PUT Step (of workflow)
router.put(
  '/stations/:name/:device/editWorkflowStep/:steppos/:workflowpos',
  (req, res) => {
    console.log('Position Workflow: ' + req.params.workflowpos);
    console.log('Step Position: ' + req.params.steppos);

    const step =
      'devices.$.workflows.' +
      req.params.workflowpos +
      '.steps.' +
      req.params.steppos;

    Station.findOneAndUpdate(
      { name: req.params.name, 'devices.name': req.params.device },
      { $set: { [step]: req.body } },
      { new: true }
    ).then(step => {
      console.log(step);
      res.send(step);
    });
  }
);

// DELETE Step (of workflow)
router.delete(
  '/stations/:name/:device/deleteWorkflowStep/:id/:workflow/:workflowpos',
  (req, res) => {
    
    const stepPos =
      'devices.$.workflows.' + req.params.workflowpos + '.steps';
    console.log(stepPos);

    Station.findOneAndUpdate(
      {
        name: req.params.name,
        'devices.name': req.params.device,
        'devices.workflows.name': req.params.workflow
      },
      { $pull: { [stepPos]: { _id: req.params.id } } },
      { new: true }
    ).then(step => {
      console.log('Result: ' + step);
      res.send(step);
    });
  }
);

// -------------------------------- Manual --------------------------------- //

// POST Manual
router.post('/stations/:name/:device/addManual', (req, res) => {
  console.log(req.body);
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $push: { 'devices.$.manual': req.body } },
    { new: true }
  ).then(manual => {
    res.send(manual);
  });
});

//GET ALL Manual Elements in Devices
router.get('/stations/:name/:device/manuals', async (req, res, next) => {
  try {
    manual = await Station.distinct('devices.manual', {
      name: req.params.name,
      'devices.name': req.params.device
    });
    res.send(manual);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
  next();
});

//PUT Manual
router.put('/stations/:name/:device/editManual/:manual', (req, res) => {
  const manual = 'devices.$.manual.' + req.body.position;
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $set: { [manual]: req.body.manual } },
    { new: true }
  ).then(manual => {
    res.send(manual);
  });
});

// DELETE Manual
router.delete('/stations/:name/:device/deleteManual/:id', (req, res) => {
  Station.findOneAndUpdate(
    { name: req.params.name, 'devices.name': req.params.device },
    { $pull: { 'devices.$.manual': { _id: req.params.id } } },
    { new: true }
  ).then(manual => {
    res.send(manual);
  });
});

module.exports = router;
