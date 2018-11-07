const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = new express();

const { SG_API_KEY } = process.env;
sgMail.setApiKey(SG_API_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views', './views/pages');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'JP Medallon | Full Stack Developer',
    mailSent: false
  });
});

app.get('/portfolio/:project', (req, res) => {
  res.render(`portfolio/${req.params.project}`, { title: 'My Portfolio' });
});

app.post('/contact', (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  res.render('index', {
    title: `Thanks ${firstName}`,
    firstName,
    mailSent: true
  });
  const msg = {
    to: 'jpmedallon@gmail.com',
    from: email,
    subject: `Portfolio contact from ${firstName} ${lastName}`,
    text: message
  };
  sgMail.send(msg);
});

app.get('*', (req, res) => {
  res.send('Page not found 404').status(404);
});
const port = process.env.PORT || 8000;

/* eslint no-console: 0 */
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
