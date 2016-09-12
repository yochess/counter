const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// database config
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/counter');

// model config
const counterSchema = mongoose.Schema({
  counter: Number
});
const Counter = mongoose.model('Counter', counterSchema);

const mailerSchema = mongoose.Schema({
  email: String,
  radio: String,
  time : { type : Date, default: Date.now }
});
const Mailer = mongoose.model('Mailer', mailerSchema);

// view config
app.set('view engine', 'ejs');
app.set('views', __dirname);

// bodyParser config
app.use(bodyParser.json())

// static page config
app.use(express.static(path.join(__dirname, 'public')));

// API: put request to increment counter
app.put('/api/getCounter/:id', (req, res) => {
  const id = req.params.id;

  Counter.findOneAndUpdate(
  {id: id},
  {$inc: {counter: 1} },
  {upsert: true, returnNewDocument: true},
  (err, result) => {
    return res.send(result);
  });
});

// API: mailer
app.post('/api/subscribe', (req, res) => {
  const email = req.body.email;
  const radio = req.body.radio;

  Mailer.findOne({email}, (err, result) => {
    if (result) {
      return result.update({email, radio}, (err, result) => {
        return res.send('updated!');
      })
    }
    return Mailer.create({email, radio}, (err, result) => {
      return res.status(201).send('created!');
    });

  });
});

// main page
app.get('/', (req, res) => {
  res.render('index');
});

// serving server on port 3000
app.listen(3000, () => {
  console.log('app is running!');
});
