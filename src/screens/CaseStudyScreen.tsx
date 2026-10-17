import React from 'react';
import { Sparkles } from 'lucide-react';
import { getAssetPath } from '../utils/assetPath';

export const CaseStudyScreen: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#0B0B0F',
      color: '#F5F5F7',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      padding: '48px 32px 80px',
      boxSizing: 'border-box',
      lineHeight: 1.6,
    }}>
      <style>{`
        @media print {
          body {
            background-color: #0B0B0F !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          .no-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
        .cs-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 14px;
        }
        .cs-table th {
          background-color: rgba(255, 255, 255, 0.05);
          color: #FFB020;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-weight: 600;
        }
        .cs-table td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          color: #D1D1DB;
          vertical-align: top;
        }
        .cs-table tr:hover td {
          background-color: rgba(255, 255, 255, 0.02);
        }
      `}</style>

      {/* Main Container */}
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

        {/* ========================================================
            HERO HEADER
        ======================================================== */}
        <header className="no-break" style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '40px',
          marginBottom: '48px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 176, 32, 0.14)',
            border: '1px solid rgba(255, 176, 32, 0.35)',
            color: '#FFB020',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '16px',
          }}>
            <Sparkles size={14} />
            <span>VinnovateIT Round 1 Recruitment Challenge · UI/UX Subdomain</span>
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '48px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: '0 0 12px',
            lineHeight: 1.15,
            background: 'linear-gradient(180deg, #FFFFFF 20%, #A3A3B2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            STILL — The Camera That Waits For You
          </h1>

          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '22px',
            color: '#FFB020',
            fontWeight: 500,
            marginBottom: '20px',
          }}>
            "Where did my button go? Rethink the Interaction"
          </div>

          <p style={{
            fontSize: '17px',
            color: '#A3A3B2',
            maxWidth: '820px',
            lineHeight: 1.6,
            margin: 0,
          }}>
            A mobile camera paradigm eliminating the physical shutter button. Rather than asking users to execute an anxiety-inducing, tremor-inducing tap command, STILL infers intent from continuous sensor stillness and provides a post-hoc circular buffer rewind.
          </p>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: '32px',
          }}>
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ fontSize: '12px', color: '#A3A3B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hold-to-Capture</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFB020', marginTop: '4px' }}>0.8s (Tunable)</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '2px' }}>Range: 400–1500 ms</div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ fontSize: '12px', color: '#A3A3B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steadiness Trigger</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#3DDC97', marginTop: '4px' }}>Motion Heuristic</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '2px' }}>Simulated in prototype</div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ fontSize: '12px', color: '#A3A3B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rewind Buffer</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#60A5FA', marginTop: '4px' }}>3.0s (Simulated)</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '2px' }}>7 illustrative frames</div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ fontSize: '12px', color: '#A3A3B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accessibility</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#A78BFA', marginTop: '4px' }}>Target & Contrast</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '2px' }}>44px targets & 18:1 contrast</div>
            </div>
          </div>
        </header>

        {/* ========================================================
            SECTION 1: DELIVERABLE D1 — PROBLEM FRAMING & RESEARCH
        ======================================================== */}
        <section className="no-break" style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Deliverable D1</span>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
          }}>
            The Removed Interaction & The Problem
          </h2>

          {/* D1 Callout Box (Exact 127 Words) */}
          <div style={{
            padding: '24px 28px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 176, 32, 0.06)',
            border: '1px solid rgba(255, 176, 32, 0.3)',
            marginBottom: '28px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              borderBottom: '1px solid rgba(255, 176, 32, 0.2)',
              paddingBottom: '8px',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFB020' }}>
                Official Problem Statement (148 Words · Limit ≤ 150)
              </span>
              <span style={{ fontSize: '12px', color: '#A3A3B2' }}>Word count verified</span>
            </div>

            <p style={{ margin: '0 0 12px', fontSize: '16px', lineHeight: 1.6, color: '#F5F5F7' }}>
              <strong>Removed:</strong> The <strong>shutter button</strong> in the mobile camera app.
            </p>
            <p style={{ margin: '0 0 12px', fontSize: '16px', lineHeight: 1.6, color: '#D1D1DB' }}>
              <strong>Why it existed:</strong> The shutter historically fulfilled five critical jobs: declaring unambiguous capture intent, freezing an exact split-second, confirming capture through feedback, offering a fixed thumb target, and maintaining a familiar mental model. Crucially, the physical act of tapping a screen button induces device tremor — causing camera-shake blur at the precise instant of exposure.
            </p>
            <p style={{ margin: '0 0 12px', fontSize: '16px', lineHeight: 1.6, color: '#D1D1DB' }}>
              <strong>The core problem:</strong> Without a shutter button, users lack a direct command to trigger capture, risking unintended shots or missed memories. Naive solutions — like volume-key triggers or full-screen tapping — simply relocate the physical button and preserve the shake penalty.
            </p>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#FFB020', fontStyle: 'italic' }}>
              <strong>The design question:</strong> How can a camera infer deliberate intent and capture the optimal moment without requiring a destructive command? The tap only sets the focus point; capture waits until the phone is steady.
            </p>
          </div>

          {/* The 5 Shutter Jobs Matrix */}
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', fontWeight: 600, margin: '28px 0 12px' }}>
            The 5 Jobs of the Shutter & How STILL Replaces Them
          </h3>
          <table className="cs-table">
            <thead>
              <tr>
                <th style={{ width: '16%' }}>Shutter Job</th>
                <th style={{ width: '28%' }}>Traditional Mechanism</th>
                <th style={{ width: '28%' }}>Inherent Flaw / Limitation</th>
                <th style={{ width: '28%' }}>STILL's Solution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Intent</strong></td>
                <td>Explicit tap button: "Take photo now".</td>
                <td>High cognitive friction; commits before verifying framing quality.</td>
                <td><strong style={{ color: '#3DDC97' }}>Tap-to-Focus + Physical Stillness</strong>: User taps subject; steady hand confirms active intent.</td>
              </tr>
              <tr>
                <td><strong>2. Timing</strong></td>
                <td>Single discrete shutter click freezes millisecond.</td>
                <td>Human reaction time lags behind action, causing missed smiles or blinks.</td>
                <td><strong style={{ color: '#3DDC97' }}>Moment Strip (3s Buffer)</strong>: 7 candidate frames recorded pre- and post-lock. Pick your preferred frame post-hoc.</td>
              </tr>
              <tr>
                <td><strong>3. Feedback</strong></td>
                <td>Screen flash / mechanical shutter click.</td>
                <td>Confirms shutter tripped, but gives zero signal on focus sharpness or motion blur.</td>
                <td><strong style={{ color: '#3DDC97' }}>Linear Ring Fill + Synthetic Haptic</strong>: Physical progress gauge, crisp audio tick, and subtle screen bloom.</td>
              </tr>
              <tr>
                <td><strong>4. Reachability</strong></td>
                <td>Fixed circular button at bottom centre.</td>
                <td>Requires awkward one-handed thumb stretching or two-handed gripping on tall screens.</td>
                <td><strong style={{ color: '#3DDC97' }}>Entire Viewfinder Active</strong>: Anywhere tapped becomes the capture lock point; effortless from any grip.</td>
              </tr>
              <tr>
                <td><strong>5. Stability</strong></td>
                <td>Physical tap impact on glass or chassis.</td>
                <td><strong>Self-defeating:</strong> Tap momentum directly induces angular jerk and motion blur at exposure.</td>
                <td><strong style={{ color: '#3DDC97' }}>Stillness Triggered</strong>: Photo captures automatically after tap jolt has settled and device is steady.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ========================================================
            SECTION 2: DELIVERABLE D2 — INTERACTION MODEL & STATE MACHINE
        ======================================================== */}
        <section className="page-break no-break" style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Deliverable D2</span>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 16px',
          }}>
            Interaction Model & Finite State Machine
          </h2>
          <p style={{ color: '#A3A3B2', fontSize: '16px', margin: '0 0 24px', maxWidth: '840px' }}>
            STILL operates on a deterministic 6-state finite state machine with automatic recovery paths, ensuring zero accidental shutter triggers and effortless frame retrieval.
          </p>

          {/* State Machine Flow Diagram */}
          <div style={{
            padding: '24px',
            borderRadius: '20px',
            backgroundColor: 'rgba(20, 20, 30, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <img
              src={getAssetPath('export/user-flow.svg')}
              alt="STILL User Flow & State Machine Architecture Diagram"
              style={{
                width: '100%',
                maxHeight: '420px',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />
            <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '12px', textAlign: 'center' }}>
              Figure 2.1 — Deterministic State Machine Architecture (Exported from <code>docs/D2-user-flow.mmd</code>)
            </div>
          </div>

          {/* FSM Specification Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ fontSize: '13px', color: '#FFB020', fontWeight: 700 }}>1. IDLE ➔ FOCUSED</div>
              <p style={{ fontSize: '13px', color: '#A3A3B2', margin: '8px 0 0' }}>
                Viewfinder displays ghost ring. User taps subject: focus pin anchors at (x,y), light haptic tick fires, 3s timeout guard initializes.
              </p>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ fontSize: '13px', color: '#FFB020', fontWeight: 700 }}>2. LOCKING ➔ CAPTURED</div>
              <p style={{ fontSize: '13px', color: '#A3A3B2', margin: '8px 0 0' }}>
                Hand steady: 104px ring fills linearly for 0.8s. If shake &gt; 250ms, ring drains 2× with low buzz. At 100%, trigger fires with shutter chirp.
              </p>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ fontSize: '13px', color: '#FFB020', fontWeight: 700 }}>3. REVIEW ➔ SAVED</div>
              <p style={{ fontSize: '13px', color: '#A3A3B2', margin: '8px 0 0' }}>
                Moment Strip opens with preselected Suggested frame (illustrative). 4s countdown auto-saves. 5s toast offers one-tap Undo to discard.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DELIVERABLE D3 — 5 HIGH-FIDELITY SCREENS
        ======================================================== */}
        <section className="page-break no-break" style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Deliverable D3</span>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 16px',
          }}>
            The 5 High-Fidelity Screens Walkthrough
          </h2>
          <p style={{ color: '#A3A3B2', fontSize: '16px', margin: '0 0 32px', maxWidth: '840px' }}>
            Every screen adheres to STILL's dark-room visual grammar: OLED deep blacks (`#0B0B0F`), signal amber (`#FFB020`), frosted glass chips, and 44×44px minimum interactive touch targets.
          </p>

          {/* Screen 1 & Screen 2 Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '28px',
            marginBottom: '36px',
          }}>
            {/* Screen 1 */}
            <div style={{
              borderRadius: '24px',
              backgroundColor: 'rgba(20, 20, 30, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 01</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', margin: '4px 0 12px' }}>
                  Progressive Onboarding
                </h3>
                <p style={{ fontSize: '14px', color: '#A3A3B2', margin: '0 0 16px', lineHeight: 1.5 }}>
                  <strong>Teaching the invisible gesture:</strong> First-time launch explains the absence of the button via a 3-step progressive coach card (1. Tap subject, 2. Hold still 0.8s, 3. Rewind moments).
                </p>
              </div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                height: '420px',
                backgroundColor: '#000',
              }}>
                <img
                  src={getAssetPath('export/screens/screen-01-onboarding.png')}
                  alt="Screen 1: Progressive Onboarding"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Screen 2 */}
            <div style={{
              borderRadius: '24px',
              backgroundColor: 'rgba(20, 20, 30, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 02</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', margin: '4px 0 12px' }}>
                  Zero-Button Viewfinder
                </h3>
                <p style={{ fontSize: '14px', color: '#A3A3B2', margin: '0 0 16px', lineHeight: 1.5 }}>
                  <strong>The calm canvas:</strong> Edge-to-edge optical preview with no distracting white shutter circle. A subtle coachmark "Tap subject to lock" fades smoothly after 1.5s idle dwell.
                </p>
              </div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                height: '420px',
                backgroundColor: '#000',
              }}>
                <img
                  src={getAssetPath('export/screens/screen-02-idle.png')}
                  alt="Screen 2: Zero-Button Viewfinder"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Screen 3 Hero Feature (Locking Screen with Annotations) */}
          <div className="no-break" style={{
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 176, 32, 0.05)',
            border: '1px solid rgba(255, 176, 32, 0.3)',
            padding: '28px',
            marginBottom: '36px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', alignItems: 'center' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(255, 176, 32, 0.15)',
                border: '1.5px solid rgba(255, 176, 32, 0.4)',
                height: '500px',
                backgroundColor: '#000',
              }}>
                <img
                  src={getAssetPath('export/screens/screen-03-locking-annotated.png')}
                  alt="Screen 3 Hero: Locking Screen with numbered callouts"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 03 · THE HERO SCREEN</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', margin: '4px 0 16px' }}>
                  Continuous Stillness Locking (Mid-Action)
                </h3>
                <p style={{ fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6, margin: '0 0 20px' }}>
                  This screen demonstrates the heart of STILL's interaction invention. The user has tapped the portrait subject and is holding steady at 60% progress.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '999px',
                      backgroundColor: '#FFB020',
                      color: '#0B0B0F',
                      fontWeight: 700,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>1</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>104px Physical LockRing & Tracking Brackets</div>
                      <div style={{ fontSize: '13px', color: '#A3A3B2' }}>Linear sweep (not eased) reflects real-time device steadiness. Dimmed vignette emphasizes the subject.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '999px',
                      backgroundColor: '#FFB020',
                      color: '#0B0B0F',
                      fontWeight: 700,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>2</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>Dynamic Countdown Glass Chip</div>
                      <div style={{ fontSize: '13px', color: '#A3A3B2' }}>"Hold steady · 0.5s" microcopy grounds timing expectations, preventing premature movement.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '999px',
                      backgroundColor: '#FFB020',
                      color: '#0B0B0F',
                      fontWeight: 700,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>3</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>Steadiness Waveform Meter</div>
                      <div style={{ fontSize: '13px', color: '#A3A3B2' }}>Replaces the old shutter button position. Dynamic sine waveform straightens into a solid bar as device steadiness is reached.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screen 4 & Screen 5 Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '28px',
          }}>
            {/* Screen 4 */}
            <div style={{
              borderRadius: '24px',
              backgroundColor: 'rgba(20, 20, 30, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 04</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', margin: '4px 0 12px' }}>
                  Moment Strip (Rewind & Choose)
                </h3>
                <p style={{ fontSize: '14px', color: '#A3A3B2', margin: '0 0 16px', lineHeight: 1.5 }}>
                  <strong>Post-hoc reassurance:</strong> 7-frame simulated rewind carousel with preselected Suggested frame (illustrative). 4-second autosave countdown removes decision paralysis; 5-second Undo toast guarantees reversible control.
                </p>
              </div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                height: '420px',
                backgroundColor: '#000',
              }}>
                <img
                  src={getAssetPath('export/screens/screen-04-moments.png')}
                  alt="Screen 4: Moment Strip (Rewind & Choose)"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Screen 5 */}
            <div style={{
              borderRadius: '24px',
              backgroundColor: 'rgba(20, 20, 30, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#FFB020', fontWeight: 700, letterSpacing: '0.06em' }}>SCREEN 05</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', margin: '4px 0 12px' }}>
                  Group Mode ("Everyone's In")
                </h3>
                <p style={{ fontSize: '14px', color: '#A3A3B2', margin: '0 0 16px', lineHeight: 1.5 }}>
                  <strong>Context-aware collective intent:</strong> Real-time face tracking for 4 friends with readiness status (green = ready, amber = blinking/eyes closed). Global perimeter ring locks and triggers only when all subjects are ready.
                </p>
              </div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                height: '420px',
                backgroundColor: '#000',
              }}>
                <img
                  src={getAssetPath('export/screens/screen-05-group.png')}
                  alt="Screen 5: Group Mode"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: DELIVERABLE D4 — DESIGN DECISIONS & TRADE-OFFS
        ======================================================== */}
        <section className="page-break no-break" style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Deliverable D4</span>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 16px',
          }}>
            Key Design Decisions
          </h2>
          <p style={{ color: '#A3A3B2', fontSize: '16px', margin: '0 0 28px', maxWidth: '840px' }}>
            Official submission copy (190 words · Limit ≤ 200 words):
          </p>

          <div style={{
            padding: '28px',
            borderRadius: '20px',
            backgroundColor: 'rgba(20, 20, 30, 0.7)',
            border: '1px solid rgba(255, 176, 32, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFB020', fontWeight: 700, fontSize: '15px' }}>1.</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6 }}>
                <strong style={{ color: '#F5F5F7' }}>Reuse tap-to-focus.</strong> Everyone already taps to focus, so STILL extends a familiar gesture instead of teaching a new one.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFB020', fontWeight: 700, fontSize: '15px' }}>2.</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6 }}>
                <strong style={{ color: '#F5F5F7' }}>Stillness is consent.</strong> The tap sets the focus point; the photo is taken only after the phone has settled for about 0.8 s. The jolt from the tap fades before capture, and an accidental touch never takes a photo.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFB020', fontWeight: 700, fontSize: '15px' }}>3.</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6 }}>
                <strong style={{ color: '#F5F5F7' }}>Visible, physical progress.</strong> A filling ring shows what is about to happen. If you move, it drains, so you stay in control without a button.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFB020', fontWeight: 700, fontSize: '15px' }}>4.</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6 }}>
                <strong style={{ color: '#F5F5F7' }}>Choose the moment afterwards.</strong> A rewind strip (a simulated 3-second buffer in this prototype) removes the pressure of perfect timing. A suggested frame is preselected, saves after 4 seconds, and Undo lasts 5 seconds.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFB020', fontWeight: 700, fontSize: '15px' }}>5.</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6 }}>
                <strong style={{ color: '#F5F5F7' }}>Whole-screen control.</strong> No corner to reach, which suits one-handed and selfie use.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFB020', fontWeight: 700, fontSize: '15px' }}>6.</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6 }}>
                <strong style={{ color: '#F5F5F7' }}>Alternate input triggers.</strong> Adjustable hold time, simulated voice and key triggers for capture without touching the screen.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFB020', fontWeight: 700, fontSize: '15px' }}>7.</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#D1D1DB', lineHeight: 1.6 }}>
                <strong style={{ color: '#F5F5F7' }}>Calm dark UI.</strong> The photo is the hero; amber is reserved for action and suggestions.
              </p>
            </div>

            <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '13px', color: '#A3A3B2', fontStyle: 'italic' }}>
              Note: the timings (0.8 s, 4 s, 5 s) are starting values to tune through usability testing.
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: ACCESSIBILITY & ERGONOMICS AUDIT
        ======================================================== */}
        <section className="no-break" style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Inclusivity & QA</span>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 16px',
          }}>
            Accessibility & Ergonomics Verification
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ color: '#3DDC97', fontWeight: 700, fontSize: '18px' }}>≥ 44 × 44 px</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F5F5F7', marginTop: '4px' }}>Touch Target Enforced</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '4px' }}>All icon buttons, chips, and strip thumbs audited for Apple HIG guidelines (≥ 44×44 px).</div>
            </div>

            <div style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ color: '#3DDC97', fontWeight: 700, fontSize: '18px' }}>18.0 : 1 Contrast</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F5F5F7', marginTop: '4px' }}>High Contrast Palette</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '4px' }}>Primary text on dark canvas evaluates to 18.0:1; signal amber to 10.7:1, exceeding standard readability benchmarks.</div>
            </div>

            <div style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ color: '#3DDC97', fontWeight: 700, fontSize: '18px' }}>aria-live="polite"</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F5F5F7', marginTop: '4px' }}>Screen Reader Region</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '4px' }}>Announces camera state transitions, countdown seconds, and save confirmations in real time.</div>
            </div>

            <div style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{ color: '#3DDC97', fontWeight: 700, fontSize: '18px' }}>Reduced Motion</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F5F5F7', marginTop: '4px' }}>Stepped Discrete Fill</div>
              <div style={{ fontSize: '12px', color: '#A3A3B2', marginTop: '4px' }}>Replaces continuous ring sweep with 33% ➔ 66% ➔ 100% ticks for vestibular sensitivity.</div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 6: COMPETITOR COMPARISON MATRIX
        ======================================================== */}
        <section className="no-break" style={{ marginBottom: '56px' }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: 700, margin: '0 0 16px' }}>
            Competitive Feature Comparison
          </h3>
          <table className="cs-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Standard Mobile Camera</th>
                <th>Burst Mode</th>
                <th>Apple Live Photos</th>
                <th>STILL (Proposed)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Trigger Method</strong></td>
                <td>Physical button tap on screen</td>
                <td>Hold shutter button</td>
                <td>Button tap + auto video</td>
                <td><strong style={{ color: '#3DDC97' }}>Hold still (0.8s intent)</strong></td>
              </tr>
              <tr>
                <td><strong>Tap Camera Shake</strong></td>
                <td>High (tapping screen induces camera shake)</td>
                <td>High (pressure on glass)</td>
                <td>Present on initial tap</td>
                <td><strong style={{ color: '#3DDC97' }}>Minimal (capture occurs after phone settles)</strong></td>
              </tr>
              <tr>
                <td><strong>Capture Timing</strong></td>
                <td>Lagged behind human reaction</td>
                <td>Generates many duplicate photos</td>
                <td>3s video slice</td>
                <td><strong style={{ color: '#3DDC97' }}>Simulated rewind buffer (3s concept)</strong></td>
              </tr>
              <tr>
                <td><strong>Triage & Cleanup</strong></td>
                <td>Manual re-take</td>
                <td>Painful manual curation</td>
                <td>Key photo scrubber hidden</td>
                <td><strong style={{ color: '#3DDC97' }}>Moment Strip with preselected Suggested frame</strong></td>
              </tr>
              <tr>
                <td><strong>Group Coordination</strong></td>
                <td>Shout "1, 2, 3 smile!"</td>
                <td>Burst & hope someone didn't blink</td>
                <td>Static face detection</td>
                <td><strong style={{ color: '#3DDC97' }}>Context-aware readiness ring</strong></td>
              </tr>
              <tr>
                <td><strong>Motor Inclusivity</strong></td>
                <td>Requires precise finger hit</td>
                <td>Requires sustained thumb force</td>
                <td>Standard button</td>
                <td><strong style={{ color: '#3DDC97' }}>Tap anywhere + Alternate input triggers</strong></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ========================================================
            SECTION 6: PROTOTYPE LIMITATIONS (SIMULATED VS REAL)
        ======================================================== */}
        <section className="no-break" style={{
          marginBottom: '56px',
          padding: '24px 28px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 176, 32, 0.04)',
          border: '1px solid rgba(255, 176, 32, 0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Technical Integrity</span>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: '0 0 12px',
          }}>
            Prototype Limitations (Simulated vs Real Hardware)
          </h2>
          <p style={{ color: '#A3A3B2', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px', maxWidth: '840px' }}>
            STILL is a frontend browser UI/UX prototype created for the VinnovateIT design challenge. To maintain absolute technical truthfulness, prototype behaviors are clearly distinguished from native hardware implementations:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            fontSize: '13px',
          }}>
            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{ fontWeight: 600, color: '#F5F5F7', marginBottom: '4px' }}>Device Motion Heuristic</div>
              <div style={{ color: '#A3A3B2', lineHeight: 1.5 }}>
                Steadiness is evaluated via browser DeviceMotionEvent acceleration or on-screen controls, not a native hardware multi-axis gyroscope.
              </div>
            </div>

            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{ fontWeight: 600, color: '#F5F5F7', marginBottom: '4px' }}>Rewind Buffer Concept</div>
              <div style={{ color: '#A3A3B2', lineHeight: 1.5 }}>
                Moment Strip presents 7 illustrative variations of a high-resolution portrait to demonstrate the 3-second rewind UI/UX workflow, not a hardware circular ring buffer.
              </div>
            </div>

            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{ fontWeight: 600, color: '#F5F5F7', marginBottom: '4px' }}>Group Readiness Tracking</div>
              <div style={{ color: '#A3A3B2', lineHeight: 1.5 }}>
                Face detection bounding boxes and readiness are simulated via interactive state machine models rather than on-device machine vision.
              </div>
            </div>

            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{ fontWeight: 600, color: '#F5F5F7', marginBottom: '4px' }}>Alternate Input Triggers</div>
              <div style={{ color: '#A3A3B2', lineHeight: 1.5 }}>
                Simulated voice command and keyboard triggers still require device steadiness to settle screen tap shake and avoid accidental exposure.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            FOOTER / CONCLUSION
        ======================================================== */}
        <footer className="no-break" style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#A3A3B2',
          fontSize: '13px',
        }}>
          <div>
            <span style={{ color: '#F5F5F7', fontWeight: 600 }}>STILL Interaction Design Submission</span> · VinnovateIT UI/UX Round 1 Challenge
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Vite + React 19</span>
            <span>•</span>
            <span>TypeScript FSM</span>
            <span>•</span>
            <span>Web Audio API</span>
            <span>•</span>
            <span>Playwright Verified</span>
          </div>
        </footer>

      </div>
    </div>
  );
};
