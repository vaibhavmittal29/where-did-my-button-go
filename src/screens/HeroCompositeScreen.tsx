import React from 'react';
import { OnboardingScreen } from './OnboardingScreen';
import { ViewfinderIdleScreen } from './ViewfinderIdleScreen';
import { LockingScreen } from './LockingScreen';
import { MomentStripScreen } from './MomentStripScreen';
import { GroupModeScreen } from './GroupModeScreen';
import { Sparkles, ShieldCheck, Activity, Eye } from 'lucide-react';

export const HeroCompositeScreen: React.FC = () => {
  return (
    <div style={{
      width: '2400px',
      height: '1350px',
      backgroundColor: '#07070A',
      backgroundImage: `
        radial-gradient(circle at 50% -10%, rgba(255, 176, 32, 0.15) 0%, transparent 60%),
        radial-gradient(circle at 10% 90%, rgba(61, 220, 151, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 90% 90%, rgba(255, 176, 32, 0.08) 0%, transparent 50%)
      `,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '48px 64px 44px',
      boxSizing: 'border-box',
      color: '#F5F5F7',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Subtle Grid Accent Lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Header Block */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 176, 32, 0.12)',
            border: '1px solid rgba(255, 176, 32, 0.35)',
            color: '#FFB020',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            <Sparkles size={14} />
            <span>VinnovateIT Round 1 Challenge · UI/UX Subdomain</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '56px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              margin: 0,
              background: 'linear-gradient(180deg, #FFFFFF 30%, #A3A3B2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              STILL
            </h1>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '28px',
              color: '#FFB020',
              fontWeight: 500,
            }}>
              The Camera That Waits For You.
            </span>
          </div>

          <p style={{
            fontSize: '18px',
            color: '#A3A3B2',
            margin: '8px 0 0',
            maxWidth: '880px',
            lineHeight: 1.4,
          }}>
            Rethinking the shutter button from first principles: replacing the disruptive tap command with continuous physical sensor stillness and post-hoc rewind.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}>
          <div style={{
            padding: '12px 18px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Activity size={20} color="#FFB020" />
            <div>
              <div style={{ fontSize: '11px', color: '#A3A3B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interaction Model</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#F5F5F7' }}>0.8s Stillness Lock</div>
            </div>
          </div>

          <div style={{
            padding: '12px 18px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Eye size={20} color="#3DDC97" />
            <div>
              <div style={{ fontSize: '11px', color: '#A3A3B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rolling Buffer</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#F5F5F7' }}>3.0s Moment Strip</div>
            </div>
          </div>

          <div style={{
            padding: '12px 18px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <ShieldCheck size={20} color="#60A5FA" />
            <div>
              <div style={{ fontSize: '11px', color: '#A3A3B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zero Camera Blur</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#F5F5F7' }}>Tap Jitter Eliminated</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Row: 5 High-Resolution Devices */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        margin: '24px 0',
      }}>
        {/* Device 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '390px',
            height: '844px',
            transform: 'scale(0.86)',
            transformOrigin: 'top center',
            borderRadius: '48px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255,255,255,0.12)',
            marginBottom: '-118px',
          }}>
            <OnboardingScreen pureDevice={true} />
          </div>
          <div style={{
            padding: '8px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 01</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>Progressive Onboarding</div>
          </div>
        </div>

        {/* Device 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '390px',
            height: '844px',
            transform: 'scale(0.86)',
            transformOrigin: 'top center',
            borderRadius: '48px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255,255,255,0.12)',
            marginBottom: '-118px',
          }}>
            <ViewfinderIdleScreen pureDevice={true} />
          </div>
          <div style={{
            padding: '8px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 02</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>Zero-Button Viewfinder</div>
          </div>
        </div>

        {/* Device 3 (Hero - Slightly Emphasized) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '390px',
            height: '844px',
            transform: 'scale(0.90)',
            transformOrigin: 'top center',
            borderRadius: '48px',
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(255, 176, 32, 0.2), 0 0 0 2px rgba(255,176,32,0.4)',
            marginBottom: '-84px',
          }}>
            <LockingScreen pureDevice={true} />
          </div>
          <div style={{
            padding: '8px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 176, 32, 0.14)',
            border: '1px solid rgba(255, 176, 32, 0.4)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 03 · HERO</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>Locking Steadiness (60%)</div>
          </div>
        </div>

        {/* Device 4 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '390px',
            height: '844px',
            transform: 'scale(0.86)',
            transformOrigin: 'top center',
            borderRadius: '48px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255,255,255,0.12)',
            marginBottom: '-118px',
          }}>
            <MomentStripScreen pureDevice={true} />
          </div>
          <div style={{
            padding: '8px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 04</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>Moment Strip Rewind</div>
          </div>
        </div>

        {/* Device 5 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '390px',
            height: '844px',
            transform: 'scale(0.86)',
            transformOrigin: 'top center',
            borderRadius: '48px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255,255,255,0.12)',
            marginBottom: '-118px',
          }}>
            <GroupModeScreen pureDevice={true} />
          </div>
          <div style={{
            padding: '8px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 05</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>Group Readiness Mode</div>
          </div>
        </div>
      </main>

      {/* Footer Banner */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderRadius: '20px',
        backgroundColor: 'rgba(20, 20, 30, 0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>Interaction Formula:</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '13px',
            color: '#A3A3B2',
          }}>
            <span style={{ color: '#FFB020', fontWeight: 600 }}>Tap Subject</span>
            <span>➔</span>
            <span style={{ color: '#FFB020', fontWeight: 600 }}>0.8s Steady Hold</span>
            <span>➔</span>
            <span style={{ color: '#3DDC97', fontWeight: 600 }}>Physical Ring Fill</span>
            <span>➔</span>
            <span style={{ color: '#60A5FA', fontWeight: 600 }}>Buffer Review & Autosave</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', color: '#A3A3B2' }}>
          <span>WCAG Accessible</span>
          <span>•</span>
          <span>Dual Haptic Feedback</span>
          <span>•</span>
          <span>Voice & Physical Fallbacks</span>
          <span>•</span>
          <span style={{ color: '#FFB020', fontWeight: 600 }}>Designed for VinnovateIT 2026</span>
        </div>
      </footer>
    </div>
  );
};
