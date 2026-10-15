export default function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '16px',
      textAlign: 'center',
      padding: '24px'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFB020' }}>
        STILL — setup OK
      </h1>
      <p style={{ color: '#A3A3B2', fontSize: '16px', maxWidth: '400px' }}>
        Phase 0 initialized: Vite + React + TypeScript scaffold ready.
      </p>
    </div>
  );
}
