async function sendOTP(email, otp) {
  const apiKey = (process.env.MAILJET_API_KEY||'').trim();
  const secretKey = (process.env.MAILJET_SECRET_KEY||'').trim();
  const fromEmail = (process.env.EMAIL_USER||'').trim();
  if(!apiKey || !secretKey) throw new Error('MAILJET_API_KEY/SECRET_KEY missing on Render');
  if(!fromEmail) throw new Error('EMAIL_USER missing on Render');
  const auth = Buffer.from(apiKey+':'+secretKey).toString('base64');
  const res = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: { 'Authorization': 'Basic '+auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Messages: [{
        From: { Email: fromEmail, Name: 'TrustShield Bank' },
        To: [{ Email: email }],
        Subject: 'TrustShield Bank - Your OTP',
        HTMLPart: '<h2>Your OTP is: <b>'+otp+'</b></h2><p>Valid for 3 minutes.</p>'
      }]
    })
  });
  if(!res.ok){
    const txt = await res.text();
    throw new Error('Mailjet error '+res.status+': '+txt.slice(0,200));
  }
}
module.exports = { sendOTP };
