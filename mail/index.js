const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

class Mailer {
  constructor() {
    this.oauth2Client = new OAuth2(
      process.env.ID_CLIENTE, // ClientID
      process.env.SECRET_CLIENTE, // Client Secret
      'https://developers.google.com/oauthplayground', // Redirect URL
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    /*
    this.accessToken = this.oauth2Client.getRequestHeaders()
      .then(res => res.credentials.refreshToken());
      */
    this.accessToken = this.oauth2Client.getAccessToken();

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'christopherx10x@gmail.com',
        clientId: process.env.ID_CLIENTE,
        clientSecret: process.env.SECRET_CLIENTE,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: this.accessToken,
      },
    });

    this.transporter.verify((err, success) => {
      if (err) {
        console.log(err);
      } else {
        console.log('SMTP Connect!', success);
        // console.log(this.transporter);
      }
    });

    this.mailOptions = {
      from: '"Testing mailer" <christopherx10x@gmail.com>',
      subject: 'Helloo ✔',
      text: 'Hello Testing?',
      html: '<b>Hello Testing?</b>',
    };

    this.changedOptions = {
      from: '"PasswordChange!" <christopherx10x@gmail.com>',
      subject: 'Helloo ✔',
      text: 'Hello Testing?',
      html: '<b>Exit Changed Pass!</b>',
    };

    this.recoverOptions = {
      from: '"Easy-Motion" <christopherx10x@gmail.com>',
      subject: 'Recover Pass ✔',
      // html: '<b>Hello Testing?</b>',
    };
  }

  sendMail(options) {
    this.transporter.sendMail({ ...this.mailOptions, ...options }, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }

  sendMailRecover(mail, token) {
    const data = { text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://easy-motion/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n', to: mail };
    // console.log('options:', options);
    this.transporter.sendMail({ ...this.recoverOptions, ...data }, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }

  sendMailChanged(options) {
    this.transporter.sendMail({ ...this.changedOptions, ...options }, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }
}

module.exports = new Mailer();
