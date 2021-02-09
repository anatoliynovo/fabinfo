const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    devices: [
      {
        name: {
          type: String
        },
        image: {
          type: String
        },
        overview: {
          type: []
        },
        material: {
          type: [
            {
              image: {
                type: String
              },
              name: {
                type: String
              },
              text: {
                type: String
              },
              link: {
                type: String
              }
            }
          ]
        },
        workflows: {
          type: [
            {
              name: {
                type: String
              },
              steps: {
                type: [
                  {
                    number: {
                      type: Number
                    },
                    image: {
                      type: String
                    },
                    text: {
                      type: String
                    },
                    checkpoint: {
                      type: String
                    }
                  }
                ]
              }
            }
          ]
        },
        manual: {
          type: [
            {
              link: String
            }
          ]
        },
        signs: {
          type: [
            {
              name: {
                type: String
              },
              image: {
                type: String
              }
            }
          ]
        }
      }
    ]
  },
  {
    collection: 'stations'
  }
);

module.exports = mongoose.model('Station', stationSchema);
