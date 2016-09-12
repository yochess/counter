// import gmail, password, and Mailer model
/*
  Mailer model consists of an
    - email field,
    - a radio field (one, two, five, or zero) in minutes
    - updated field (last updated)
*/
const config = require('./config.js');
const Mailer = require('./models.js').Mailer;

// setup for nodemailer and transporter
// note: this setup is specifically used for gmail accounts
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(`smtps://${config.gmail}%40gmail.com:${config.password}@smtp.gmail.com`);

// find the current time
const currentTime = new Date();
const oneMinute = 60 * 1000;

// connect to mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/counter');

// find only those where the radio is set to one, two, or five minutes
Mailer.find({radio: /one|two|five/}, (err, results) => {

  // perform a task in sync
  /*
    The task performs 3 tasks
      - doTask (checks whether the email of the model needs to be emailed)
      - if so, send an email
      - once sent, update the updated field of the model
    Once all three tasks are performed, the connection is closed
  */
  Promise.all(results.map(result => {
    return doTask(result);
  }))
  .then(results => {
    results.forEach(result => {
      if (result !== 'no match') {
        console.log(`${result.accepted} has been sent a message!`);
      }
    });
    console.log('all done!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('There is an error that you need to fix: ', err);
    mongoose.connection.close();
  })
});

// checks whether the requirement is met
function doTask(result) {
  return new Promise((resolve, reject) => {
    const lastUpdated = result.updated;
    const difference = currentTime.getTime() - lastUpdated.getTime();

    if ((result.radio === 'one'  && difference >= oneMinute    ) ||
        (result.radio === 'two'  && difference >= oneMinute * 2) ||
        (result.radio === 'five' && difference >= oneMinute * 5)) {
      sendMail(result, resolve, reject);
    } else {
      resolve('no match');
    }
  });
}

// if the requirement is met, sends an email
function sendMail(result, resolve, reject) {
  // setup e-mail data with unicode symbols
  const mailOptions = {
    from: `"Annoying Mailer 👥" <${config.gmail}@gmail.com>`, // sender address
    to: `${result.email}`, // list of receiver
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return reject(err);
    }
    updateModel(result, info, resolve);
  });
}

// once an email is sent, update the model
function updateModel(result, info, resolve, reject) {
  result.update({
    updated: currentTime
  }, (err, result) => {
    if (err) {
      return resolve(err);
    }
    resolve(info);
  });
}
