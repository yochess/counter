const mongoose = require('mongoose');

// model config
const counterSchema = mongoose.Schema({
  counter: Number
});
const Counter = mongoose.model('Counter', counterSchema);

const mailerSchema = mongoose.Schema({
  email: String,
  radio: String,
  time : { type : Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});
const Mailer = mongoose.model('Mailer', mailerSchema);

module.exports = {
  Counter,
  Mailer
};
