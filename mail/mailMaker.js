
/**
 * Returns an object with the mail options as attributes
 * @constructor
 */
function MailMaker() {
  /**
   * Options for Confirm message
   * @param  {String} mail  - Email to send the message
   * @param  {String} token - Token to attach in the message
   * @return {Object} - The confirm message options
   */
  const confirm = (mail, token) => ({
    from: process.env.MAIL_FROM,
    to: mail,
    subject: 'Confirm your Email',
    text: `https://easy-motion.herokuapp.com/auth/confirm?key=${token}`,
    html: `<b>https://easy-motion.herokuapp.com/auth/confirm?key=${token}</b>`,
  });

  /**
   * Options for Reset password message
   * @param  {String} mail  - Email to send the message
   * @param  {String} token - Token to attach in the message
   * @return {Object} - The reset message options
   */
  const reset = (mail, token) => ({
    from: process.env.MAIL_FROM,
    to: mail,
    subject: 'Reset your Account Password',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
          + `https://easy-motion.herokuapp.com/auth/reset?key=${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    html: `<b>https://easy-motion.herokuapp.com/auth/reset?key=${token}</b>`,
  });

  /**
   * Options for password change message
   * @param  {String} mail  - Email to send the message
   * @param  {String} token - Token to attach in the message
   * @return {Object} - The password changed message options
   */
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
