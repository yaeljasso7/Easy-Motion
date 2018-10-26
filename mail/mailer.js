const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

class Mailer {
  constructor() {
    this.mailer = process.env.MAILER;
    this[`config${this.mailer}`]();
    this.transporter.verify((err, success) => {
      if (err) {
        console.log(err);
      } else {
        console.log('SMTP Connect!', success);
      }
    });

    this.mailOptions = {
      from: '"Testing mailer" <testing@mailer.com>',
      subject: 'Hello ✔',
      text: 'Hello Testing?',
      html: '<b>Hello Testing?</b>',
    };
  }

  configEthereal() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  configGmail() {
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
  }

  sendMail(options) {
    this.transporter.sendMail({ ...this.mailOptions, ...options }, (err, info) => {
      if (err) {
        throw err;
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }
}

module.exports = new Mailer();
