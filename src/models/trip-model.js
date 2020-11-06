const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const diagramSchema = Schema({
  link: String,
  name: {
    unique: true,
    required: true,
    type: String
  },
  labels: {
    unique: true,
    required: true,
    type: String
  },
  data: {
    required: true,
    type: []
  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Diagram', diagramSchema)
