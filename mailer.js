const config = require('./config.js');
const Mailer = require('./models.js').Mailer;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/counter');

Mailer.find({radio: /one|two|five/}, (err, results) => {
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

  // mongoose.connection.close();
});

const currentTime = new Date();
const oneMinute = 60 * 1000;

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

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(`smtps://${config.gmail}%40gmail.com:${config.password}@smtp.gmail.com`);



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
