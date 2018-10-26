
function MailMaker() {
  const confirm = (mail, token) => ({
    from: process.env.MAIL_FROM,
    to: mail,
    subject: 'Confirm your Email',
    text: `http://easy-motion/auth/confirm?key=${token}`,
    html: `<b>http://easy-motion/auth/confirm?key=${token}</b>`,
  });

  const reset = (mail, token) => ({
    from: process.env.MAIL_FROM,
    to: mail,
    subject: 'Reset your Account Password',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
          + `http://easy-motion/auth/reset?key=${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    html: `<b>http://easy-motion/auth/reset?key=${token}</b>`,
  });

  const passwordChanged = mail => ({
    from: process.env.MAIL_FROM,
    to: mail,
    subject: 'Password changed',
    text: 'Your account password has been changed!',
  });

  return {
    confirm,
    reset,
    passwordChanged,
  };
}

module.exports = MailMaker();
