const express = require('express');
const path = require('path')
const app = express();

// database config
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/counter');

// model config
const counterSchema = mongoose.Schema({
    counter: String
});
const Counter = mongoose.model('Counter', counterSchema);

// view config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.'))

// static page config
app.use(express.static(path.join(__dirname, 'public')));

// API: put request to increment counter
app.put('/api/getCounter', (req, res) => {
  Counter.findOne({}, (err, counter) => {
    if (!counter) {
      Counter.create({counter: '0'}).then(result => {
        return res.send(result);
      });
    } else {
      const newCounter = +counter.counter +1;
      Counter.findOne({}, (err, counter) => {
        counter.counter = newCounter;
        counter.save((err, result) => {
          return res.send(result);
        });
      });
    }
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
