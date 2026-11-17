export default function VerifyOtp() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#0a1628', color: '#fff' }}>
      <section style={{ maxWidth: 440, padding: 28, borderRadius: 16, background: '#111f3a', textAlign: 'center' }}>
        <h2>Two-factor / Email verification unavailable</h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>The previous OTP screen did not verify delivery or securely validate a code. It has been disabled until a hashed, expiring, rate-limited verification workflow is implemented. No OTP has been sent and no account state has changed.</p>
        <a href="/login" style={{ color: '#93c5fd' }}>Return to login</a>
      </section>
    </main>
  );
}
