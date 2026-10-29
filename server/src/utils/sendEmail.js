const nodemailer = require('nodemailer');
async function sendOTP(email, otp) {
  const user = (process.env.EMAIL_USER||'').trim();
  const pass = (process.env.EMAIL_PASS||'').replace(/\s+/g,'');
  if(!user || !pass) throw new Error('EMAIL_USER/EMAIL_PASS missing on Render');
  const t = nodemailer.createTransport({
    service: 'gmail',
    connectionTimeout: 10000,
    socketTimeout: 15000,
    auth: { user, pass }
  });
  await t.sendMail({
    from: user,
    to: email,
    subject: 'TrustShield Bank - Your OTP',
    html: '<h2>Your OTP is: <b>'+otp+'</b></h2><p>Valid for 3 minutes.</p>'
  });
}
module.exports = { sendOTP };
