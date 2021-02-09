const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
        name: {
          type: String
        },
        image: {
          type: String
        },
        text: {
          type: String
        },
        link: {
            type: String
        }
      },
  {
    collection: 'materials'
  }
);

module.exports = mongoose.model('Material', materialSchema);
