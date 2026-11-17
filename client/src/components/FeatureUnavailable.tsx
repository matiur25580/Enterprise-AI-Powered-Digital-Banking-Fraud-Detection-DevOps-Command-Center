export default function FeatureUnavailable() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#0a1628', color: '#fff' }}>
      <section style={{ maxWidth: 480, padding: 28, borderRadius: 16, background: '#111f3a', textAlign: 'center' }}>
        <h2>Feature temporarily unavailable</h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>This feature previously used mock or in-memory data. It has been disabled until persistent storage, user-level authorization, audit logging and automated tests are ready.</p>
        <a href="/" style={{ color: '#93c5fd' }}>Return to home</a>
      </section>
    </main>
  );
}
