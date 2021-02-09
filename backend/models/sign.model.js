const mongoose = require('mongoose');

const signsSchema = new mongoose.Schema(
  {
        name: {
          type: String
        },
        image: {
          type: String
        }
      },
  {
    collection: 'signs'
  }
);

module.exports = mongoose.model('Signs', signsSchema);
