require('dotenv').config()
const mongoose = require('mongoose')

const dbConnectionURL = `mongodb://localhost:27017/createDiagrams`

function dbConnect() {
  mongoose.connect(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) return console.log(err)
    return console.log('Success connected to createDiagrams database')
  })
}

module.exports = dbConnect
