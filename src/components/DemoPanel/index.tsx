import React from 'react';
import styles from './DemoPanel.module.css';
import { CameraStatus, CameraMode } from '../../state/cameraMachine';
import { Activity, Zap, Mic, RotateCcw, ShieldAlert, Users } from 'lucide-react';

export interface DemoPanelProps {
  status: CameraStatus;
  mode: CameraMode;
  steadiness: number;
  isHoldingSpace: boolean;
  isLowLight: boolean;
  groupReadyCount: number;
  onSetSteadiness: (val: number) => void;
  onTriggerShake: () => void;
  onToggleLowLight: () => void;
  onSetGroupReady: (count: number) => void;
  onTriggerVoice: (phrase: string) => void;
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
  onSetSteadiness,
  onTriggerShake,
  onToggleLowLight,
  onSetGroupReady,
  onTriggerVoice,
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
        <button
          className={styles.actionBtn}
          onClick={onReset}
          title="Reset to idle"
          style={{ padding: '4px 8px', fontSize: '11px' }}
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
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
          <span className={styles.statusVal} style={{ color: steadiness >= 0.7 ? 'var(--success)' : 'var(--accent)' }}>
            {(steadiness * 100).toFixed(0)}% {steadiness >= 0.7 ? '(Steady)' : '(Moving)'}
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

        <button className={styles.actionBtn} onClick={onTriggerShake}>
          <Activity size={14} color="var(--accent)" />
          <span>Simulate Sudden Shake</span>
        </button>
      </div>

      {/* Mode & Environment Scenarios */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Context & Edge Cases</span>
        <div className={styles.buttonGrid}>
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
          >
            <Mic size={14} color="var(--accent)" />
            <span>Say "Cheese"</span>
          </button>

          <button
            className={`${styles.actionBtn} ${mode === 'group' ? styles.actionBtnPrimary : ''}`}
            onClick={() => {
              if (mode !== 'group') onModeChange('group');
              else onSetGroupReady(groupReadyCount === 4 ? 3 : 4);
            }}
          >
            <Users size={14} />
            <span>{mode === 'group' ? (groupReadyCount === 4 ? 'All 4 Ready' : '3 of 4 Ready') : 'Group Mode'}</span>
          </button>

          <button
            className={`${styles.actionBtn} ${mode === 'doc' ? styles.actionBtnPrimary : ''}`}
            onClick={() => onModeChange(mode === 'doc' ? 'still' : 'doc')}
          >
            <Zap size={14} />
            <span>{mode === 'doc' ? 'Doc Mode' : 'Doc Mode'}</span>
          </button>
        </div>
      </div>

      {/* Core Interaction Checklist */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Interaction Guide</span>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>① <strong>Tap subject</strong> on viewfinder to place focus pin.</div>
          <div>② <strong>Hold steady</strong> ~0.8s (or hold Spacebar) to fill lock ring.</div>
          <div>③ <strong>Movement drains ring</strong> to prevent blurred shots.</div>
          <div>④ <strong>Moment Strip</strong> opens automatically — pick or autosave in 4s.</div>
        </div>
      </div>
    </aside>
  );
};
