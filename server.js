'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jsonParser = require('body-parser').json();
const nodemailer = require('nodemailer');
const createError = require('http-errors');
const morgan = require('morgan');
const debug = require('debug')(`portfolio: Server`);

const PORT = process.env.PORT || 3000;
const app = express();

let mailRouter = new express.Router();
mailRouter.post('/eddiesportfolioapiwithcrappyauthentication', jsonParser, function(req, res, next) {
  debug('MESSAGE STUFF');
  let {sender, body, name, subject, secret} = req.body;
  if(secret !== process.env.APP_SECRET) return next(createError(401, 'Denied'));

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.gmailname}`,
      pass: `${process.env.gmailpass}`
    }
  });
  var mailOptions = {
    from: `${process.env.gmailname}`,
    to: `${process.env.gmailname}`,
    subject: `PORTFOLIO FOWARD: ${subject}`,
    text: `FROM: ${name}\n\n EMAIL: ${sender}\n\n\n${body}`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error) return next(createError(400, error));
    res.json(info);
    res.end();
  });



});

app.use(morgan('dev'));
app.use(cors());
app.use(mailRouter);


app.listen(PORT, () => {
  debug(`Server active on port : ${PORT}`);
});
