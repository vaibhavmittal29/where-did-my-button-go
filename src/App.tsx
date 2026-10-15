import { ComponentKitScreen } from './screens/ComponentKitScreen';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const screen = urlParams.get('screen') || 'kit';

  if (screen === 'kit') {
    return <ComponentKitScreen />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 'var(--space-4)',
      textAlign: 'center',
      padding: 'var(--space-6)'
    }}>
      <h1 style={{
        fontSize: 'var(--text-headline)',
        fontWeight: 700,
        fontFamily: 'var(--font-family-display)',
        color: 'var(--accent)'
      }}>
        STILL — Screen: {screen}
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 'var(--text-body)' }}>
        View the component kit at <a href="/?screen=kit" style={{ color: 'var(--accent)' }}>/?screen=kit</a>
      </p>
    </div>
  );
}
