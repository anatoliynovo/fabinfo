const mongoose = require('mongoose');

const safetySchema = new mongoose.Schema(
  {
        name: {
          type: String
        },
        file: {
          type: String
        }
      },
  {
    collection: 'safety'
  }
);

module.exports = mongoose.model('Safety', safetySchema);
