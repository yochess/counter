const express = require('express');
const path = require('path');
const app = express();

// database config
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/counter');

// model config
const counterSchema = mongoose.Schema({
    counter: Number
});
const Counter = mongoose.model('Counter', counterSchema);

// view config
app.set('view engine', 'ejs');
app.set('views', __dirname);

// static page config
app.use(express.static(path.join(__dirname, 'public')));

// API: put request to increment counter
app.put('/api/getCounter/:id', (req, res) => {
  const id = req.params.id;

  Counter.findOneAndUpdate({id: id}, {$inc: {counter: 1}}, {
    upsert: true,
    returnNewDocument: true
  }, (err, result) => {
    console.log('result', result);
    return res.send(result);
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
