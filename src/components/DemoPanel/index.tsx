import React from 'react';
import styles from './DemoPanel.module.css';
import { CameraStatus, CameraMode } from '../../state/cameraMachine';
import { STEADY_THRESHOLD } from '../../state/constants';
import { Activity, Zap, Mic, RotateCcw, ShieldAlert, Users, Volume2, VolumeX } from 'lucide-react';

export interface DemoPanelProps {
  status: CameraStatus;
  mode: CameraMode;
  steadiness: number;
  isHoldingSpace: boolean;
  isLowLight: boolean;
  groupReadyCount: number;
  isMuted?: boolean;
  isRealSensorEnabled?: boolean;
  sensorStatusText?: string;
  sensorError?: string | null;
  onToggleMute?: () => void;
  onToggleRealSensor?: () => void;
  onSetSteadiness: (val: number) => void;
  onTriggerShake: () => void;
  onToggleLowLight: () => void;
  onSetGroupReady: (count: number) => void;
  onTriggerVoice: (phrase: string) => void;
  onTriggerVolumeKey?: () => void;
  onReset: () => void;
  onModeChange: (mode: CameraMode) => void;
}

export const DemoPanel: React.FC<DemoPanelProps> = ({
  status,
  mode,
  steadiness,
  isHoldingSpace,
  isLowLight,
  groupReadyCount,
  isMuted = false,
  isRealSensorEnabled = false,
  sensorStatusText,
  sensorError,
  onToggleMute,
  onToggleRealSensor,
  onSetSteadiness,
  onTriggerShake,
  onToggleLowLight,
  onSetGroupReady,
  onTriggerVoice,
  onTriggerVolumeKey,
  onReset,
  onModeChange,
}) => {
  return (
    <aside className={styles.panel} aria-label="STILL Interaction Demo Panel">
      <div className={styles.header}>
        <div className={styles.title}>
          <span>STILL Lab</span>
          <span className={styles.badge}>Live Demo</span>
        </div>
        <div role="group" aria-label="Demo panel quick actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onToggleMute && (
            <button
              className={styles.actionBtn}
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Audio & Haptics' : 'Mute Audio & Haptics'}
              style={{ minHeight: '44px', minWidth: '44px', padding: '8px 12px', fontSize: '11px', color: isMuted ? 'var(--text-muted)' : 'var(--accent)' }}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isMuted ? 'Muted' : 'Sound'}</span>
            </button>
          )}
          <button
            className={styles.actionBtn}
            onClick={onReset}
            title="Reset to idle"
            style={{ minHeight: '44px', minWidth: '44px', padding: '8px 12px', fontSize: '11px' }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Live State Machine Status */}
      <div className={styles.statusCard}>
        <div className={styles.statusRow}>
          <span>State:</span>
          <span className={styles.statusVal}>{status}</span>
        </div>
        <div className={styles.statusRow}>
          <span>Mode:</span>
          <span className={styles.statusVal}>{mode.toUpperCase()}</span>
        </div>
        <div className={styles.statusRow}>
          <span>Steadiness:</span>
          <span className={styles.statusVal} style={{ color: steadiness >= STEADY_THRESHOLD ? 'var(--success)' : 'var(--accent)' }}>
            {(steadiness * 100).toFixed(0)}% {steadiness >= STEADY_THRESHOLD ? '(Steady)' : '(Moving)'}
          </span>
        </div>
      </div>

      {/* Sensor / Steadiness Control */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Physical Sensor Intent</span>
        <div className={styles.sliderContainer}>
          <div className={styles.row}>
            <span style={{ fontSize: '12px' }}>Steadiness Level</span>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{(steadiness * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={steadiness}
            onChange={(e) => onSetSteadiness(parseFloat(e.target.value))}
            className={styles.sliderTrack}
            aria-label="Adjust phone steadiness"
          />
        </div>

        <div className={styles.keyboardHint}>
          <span className={`${styles.kbd} ${isHoldingSpace ? styles.kbdActive : ''}`}>Spacebar</span>
          <span>Hold to steady (96%), release to move</span>
        </div>

        <div role="group" aria-label="Steadiness simulation controls" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button className={styles.actionBtn} onClick={onTriggerShake}>
            <Activity size={14} color="var(--accent)" />
            <span>Simulate Sudden Shake</span>
          </button>

          {onToggleRealSensor && (
            <button
              className={`${styles.actionBtn} ${isRealSensorEnabled ? styles.actionBtnPrimary : ''}`}
              onClick={onToggleRealSensor}
              title="Device motion heuristic (uses browser devicemotion acceleration when supported/permitted; coarse heuristic in mobile browsers)"
            >
              <Activity size={14} />
              <span>Device motion (acceleration heuristic) ({sensorStatusText || (isRealSensorEnabled ? 'Active' : 'Off')})</span>
            </button>
          )}

          {sensorError && (
            <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '2px' }}>
              {sensorError}
            </div>
          )}
        </div>
      </div>

      {/* Mode & Environment Scenarios */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Context & Edge Cases</span>
        <div role="group" aria-label="Context and trigger scenario controls" className={styles.buttonGrid}>
          <button
            className={`${styles.actionBtn} ${isLowLight ? styles.actionBtnPrimary : ''}`}
            onClick={onToggleLowLight}
          >
            <ShieldAlert size={14} />
            <span>{isLowLight ? 'Low Light (1.5x)' : 'Normal Light'}</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={() => onTriggerVoice('Cheese')}
            title="Simulate hands-free voice command trigger (prototype simulation)"
          >
            <Mic size={14} color="var(--accent)" />
            <span>Voice: "Cheese" (Sim)</span>
          </button>

          <button
            className={`${styles.actionBtn} ${mode === 'group' ? styles.actionBtnPrimary : ''}`}
            onClick={() => {
              if (mode !== 'group') onModeChange('group');
              else onSetGroupReady(groupReadyCount === 4 ? 3 : 4);
            }}
            title="Group mode auto-capture (simulated face tracking)"
          >
            <Users size={14} />
            <span>{mode === 'group' ? (groupReadyCount === 4 ? 'All 4 Ready' : '3 of 4 Ready') : 'Group Mode (Sim)'}</span>
          </button>

          <button
            className={`${styles.actionBtn} ${mode === 'doc' ? styles.actionBtnPrimary : ''}`}
            onClick={() => onModeChange(mode === 'doc' ? 'still' : 'doc')}
            title="Document edge detection layout (prototype simulation)"
          >
            <Zap size={14} />
            <span>{mode === 'doc' ? 'Doc Mode' : 'Doc Mode (Sim)'}</span>
          </button>

          {onTriggerVolumeKey && (
            <button
              className={styles.actionBtn}
              onClick={onTriggerVolumeKey}
              title="Simulated physical volume key trigger ('C' key; requires phone held steady, avoids tap shake)"
              style={{ gridColumn: 'span 2' }}
            >
              <Volume2 size={14} color="var(--accent)" />
              <span>Simulated Volume Key ('C')</span>
            </button>
          )}
        </div>
      </div>

      {/* Core Interaction Checklist */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Interaction Guide</span>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>① <strong>Tap subject</strong> on viewfinder to place focus pin.</div>
          <div>② <strong>Hold steady</strong> ~0.8s (or hold Spacebar) to fill lock ring.</div>
          <div>③ <strong>Movement drains ring</strong> to prevent blurred shots.</div>
          <div>④ <strong>Moment Strip</strong> opens automatically — pick or autosave in 4s.</div>
        </div>
      </div>
    </aside>
  );
};
