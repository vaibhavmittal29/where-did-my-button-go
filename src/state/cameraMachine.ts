import {
  HOLD_TIME_MS,
  HOLD_TIME_MIN_MS,
  HOLD_TIME_MAX_MS,
  LOW_LIGHT_MULTIPLIER,
  CANDIDATE_FRAMES,
  VOICE_SUPPORTED_PHRASES,
} from './constants';

export type CameraStatus =
  | 'IDLE'
  | 'FOCUSED'
  | 'LOCKING'
  | 'CANCELLED'
  | 'CAPTURED'
  | 'REVIEW'
  | 'SAVED';

export type CameraMode = 'still' | 'group' | 'doc';

export interface CameraState {
  status: CameraStatus;
  focusPoint: { x: number; y: number } | null;
  progress: number; // 0.0 to 1.0
  mode: CameraMode;
  isLowLight: boolean;
  baseHoldTime: number; // tunable hold time (400 - 1500 ms)
  selectedFrameIndex: number;
  bestFrameIndex: number;
  statusMessage: string | null;
  savedPhoto: boolean;
  canUndo: boolean;
  groupReadyCount: number;
  groupTotalCount: number;
}

export type CameraAction =
  | { type: 'TAP_SUBJECT'; x: number; y: number }
  | { type: 'STEADY_OK' }
  | { type: 'STEADY_TICK'; dt: number }
  | { type: 'UNSTEADY'; durationMs?: number }
  | { type: 'TIMEOUT_FOCUS' }
  | { type: 'PROGRESS_COMPLETE' }
  | { type: 'ANIM_DONE' }
  | { type: 'PICK_FRAME'; index: number }
  | { type: 'TIMEOUT_REVIEW' }
  | { type: 'UNDO' }
  | { type: 'VOICE_TRIGGER'; phrase?: string; isSteady?: boolean }
  | { type: 'VOLUME_KEY'; isSteady?: boolean }
  | { type: 'MODE_CHANGE'; mode: CameraMode }
  | { type: 'SET_LOW_LIGHT'; isLowLight: boolean }
  | { type: 'SET_HOLD_TIME'; holdTimeMs: number }
  | { type: 'SET_GROUP_READY'; count: number }
  | { type: 'RESET' };

export const initialCameraState: CameraState = {
  status: 'IDLE',
  focusPoint: null,
  progress: 0,
  mode: 'still',
  isLowLight: false,
  baseHoldTime: HOLD_TIME_MS,
  selectedFrameIndex: 3, // middle frame (0..6)
  bestFrameIndex: 3,
  statusMessage: null,
  savedPhoto: false,
  canUndo: false,
  groupReadyCount: 3,
  groupTotalCount: 4,
};

export function getEffectiveHoldTime(isLowLight: boolean, baseHoldTime: number = HOLD_TIME_MS): number {
  return isLowLight ? baseHoldTime * LOW_LIGHT_MULTIPLIER : baseHoldTime;
}

export function canCapture(state: CameraState): boolean {
  if (['CAPTURED', 'REVIEW', 'SAVED'].includes(state.status)) {
    return false;
  }
  if (state.mode === 'group' && state.groupReadyCount < state.groupTotalCount) {
    return false;
  }
  return true;
}

export function cameraReducer(state: CameraState, action: CameraAction): CameraState {
  switch (action.type) {
    case 'TAP_SUBJECT': {
      // Disallow focus anchoring while reviewing, saving, or capturing
      if (['CAPTURED', 'REVIEW', 'SAVED'].includes(state.status)) {
        return state;
      }
      // Tap sets focus point but NEVER triggers capture on its own
      return {
        ...state,
        status: 'FOCUSED',
        focusPoint: { x: Math.max(0, Math.min(100, action.x)), y: Math.max(0, Math.min(100, action.y)) },
        progress: 0,
        statusMessage: null,
        canUndo: false,
      };
    }

    case 'STEADY_OK': {
      // Can only start locking from FOCUSED state
      if (state.status !== 'FOCUSED') return state;
      // P0-01: In group mode, cannot start locking unless all faces are ready
      if (state.mode === 'group' && state.groupReadyCount < state.groupTotalCount) {
        return {
          ...state,
          statusMessage: `Group not ready (${state.groupReadyCount}/${state.groupTotalCount} faces ready) — hold steady`,
        };
      }
      return {
        ...state,
        status: 'LOCKING',
        statusMessage: state.isLowLight ? 'Low light — hold a bit longer' : 'Hold steady',
      };
    }

    case 'STEADY_TICK': {
      if (state.status !== 'LOCKING') return state;
      // P2-02: Reject negative or non-finite deltas
      if (typeof action.dt !== 'number' || !Number.isFinite(action.dt) || action.dt <= 0) {
        return state;
      }
      // P0-01: In group mode, if readiness is lost mid-lock, cancel lock back to CANCELLED
      if (state.mode === 'group' && state.groupReadyCount < state.groupTotalCount) {
        return {
          ...state,
          status: 'CANCELLED',
          statusMessage: `Group not ready (${state.groupReadyCount}/${state.groupTotalCount} faces ready) — hold steady`,
        };
      }
      const holdTime = getEffectiveHoldTime(state.isLowLight, state.baseHoldTime);
      const nextProgress = Math.min(1, Math.max(0, state.progress + action.dt / holdTime));
      if (nextProgress >= 1) {
        // P0-01: Centralized canCapture check before transitioning to CAPTURED
        if (!canCapture(state)) {
          return state;
        }
        return {
          ...state,
          status: 'CAPTURED',
          progress: 1,
          statusMessage: 'Captured!',
        };
      }
      return {
        ...state,
        progress: nextProgress,
      };
    }

    case 'UNSTEADY': {
      if (state.status !== 'LOCKING') return state;
      return {
        ...state,
        status: 'CANCELLED',
        statusMessage: 'Too much movement — hold still',
      };
    }

    case 'TIMEOUT_FOCUS': {
      if (state.status !== 'FOCUSED') return state;
      return {
        ...state,
        status: 'IDLE',
        focusPoint: null,
        progress: 0,
        statusMessage: 'Hold still',
      };
    }

    case 'PROGRESS_COMPLETE': {
      // P0-06: In normal still/doc mode, capture can ONLY complete from 'LOCKING'
      // In group mode, auto-capture can complete from IDLE or FOCUSED hands-free ONLY IF all faces are ready
      if (state.mode === 'group') {
        if (!['LOCKING', 'FOCUSED', 'IDLE'].includes(state.status)) return state;
        if (state.groupReadyCount < state.groupTotalCount) {
          return state;
        }
      } else {
        if (state.status !== 'LOCKING') return state;
      }
      return {
        ...state,
        status: 'CAPTURED',
        progress: 1,
        statusMessage: 'Captured!',
      };
    }

    case 'ANIM_DONE': {
      if (state.status === 'CANCELLED') {
        // Pin remains at focusPoint so user can retry immediately without re-tapping
        return {
          ...state,
          status: 'FOCUSED',
          progress: 0,
        };
      }
      if (state.status === 'CAPTURED') {
        return {
          ...state,
          status: 'REVIEW',
          selectedFrameIndex: state.bestFrameIndex,
          statusMessage: 'Pick your favourite moment',
        };
      }
      return state;
    }

    case 'PICK_FRAME': {
      if (state.status !== 'REVIEW') return state;
      const clampedIndex = Math.max(0, Math.min(CANDIDATE_FRAMES - 1, action.index));
      return {
        ...state,
        selectedFrameIndex: clampedIndex,
      };
    }

    case 'TIMEOUT_REVIEW': {
      if (state.status !== 'REVIEW') return state;
      return {
        ...state,
        status: 'SAVED',
        savedPhoto: true,
        canUndo: true,
        statusMessage: 'Saved · Undo',
      };
    }

    case 'UNDO': {
      if (state.status !== 'SAVED' || !state.canUndo) return state;
      return {
        ...state,
        status: 'IDLE',
        focusPoint: null,
        progress: 0,
        savedPhoto: false,
        canUndo: false,
        statusMessage: 'Photo removed',
      };
    }

    case 'VOICE_TRIGGER': {
      // Guarded hands-free capture flow (P0-05):
      // 1. Reject if already captured, in review, or saved
      if (!['IDLE', 'FOCUSED', 'LOCKING'].includes(state.status)) {
        return state;
      }

      // 2. In Group Mode, require groupReadyCount >= groupTotalCount
      if (state.mode === 'group' && state.groupReadyCount < state.groupTotalCount) {
        return {
          ...state,
          statusMessage: `Group not ready (${state.groupReadyCount}/${state.groupTotalCount} faces ready) — hold steady`,
        };
      }

      // 3. Accept only supported phrases ('Capture' or 'Cheese')
      const phrase = (action.phrase || 'Cheese').trim().toLowerCase();
      const isSupported = (VOICE_SUPPORTED_PHRASES as readonly string[]).includes(phrase);
      if (!isSupported) {
        return {
          ...state,
          statusMessage: `Voice command ignored: "${action.phrase || ''}". Use "Capture" or "Cheese".`,
        };
      }

      // 4. Require action.isSteady === true (strict boolean check)
      if (action.isSteady !== true) {
        return {
          ...state,
          statusMessage: 'Device moving — hold steady for voice capture',
        };
      }

      // 5. Capture cleanly
      return {
        ...state,
        status: 'CAPTURED',
        focusPoint: state.focusPoint || { x: 50, y: 50 },
        progress: 1,
        statusMessage: `Voice capture: "${phrase === 'capture' ? 'Capture' : 'Cheese'}"`,
      };
    }

    case 'VOLUME_KEY': {
      // Accessibility fallback trigger (P0-05):
      // 1. Reject if camera is already captured, reviewing, or saved
      if (!['IDLE', 'FOCUSED', 'LOCKING'].includes(state.status)) {
        return state;
      }

      // 2. In Group Mode, require groupReadyCount >= groupTotalCount
      if (state.mode === 'group' && state.groupReadyCount < state.groupTotalCount) {
        return {
          ...state,
          statusMessage: `Group not ready (${state.groupReadyCount}/${state.groupTotalCount} faces ready) — hold steady`,
        };
      }

      // 3. Require action.isSteady === true (strict boolean check)
      if (action.isSteady !== true) {
        return {
          ...state,
          statusMessage: 'Device moving — hold steady for fallback capture',
        };
      }

      return {
        ...state,
        status: 'CAPTURED',
        focusPoint: state.focusPoint || { x: 50, y: 50 },
        progress: 1,
        statusMessage: 'Accessibility capture (Simulated volume key)',
      };
    }

    case 'MODE_CHANGE': {
      return {
        ...state,
        mode: action.mode,
        status: 'IDLE',
        focusPoint: null,
        progress: 0,
        statusMessage: null,
      };
    }

    case 'SET_LOW_LIGHT': {
      return {
        ...state,
        isLowLight: action.isLowLight,
      };
    }

    case 'SET_HOLD_TIME': {
      const clamped = Math.max(HOLD_TIME_MIN_MS, Math.min(HOLD_TIME_MAX_MS, action.holdTimeMs));
      return {
        ...state,
        baseHoldTime: clamped,
      };
    }

    case 'SET_GROUP_READY': {
      const clamped = Math.max(0, Math.min(state.groupTotalCount, action.count));
      const lostReadiness = state.mode === 'group' && state.status === 'LOCKING' && clamped < state.groupTotalCount;
      return {
        ...state,
        groupReadyCount: clamped,
        status: lostReadiness ? 'CANCELLED' : state.status,
        statusMessage: lostReadiness
          ? `Group not ready (${clamped}/${state.groupTotalCount} faces ready) — hold steady`
          : state.statusMessage,
      };
    }

    case 'RESET': {
      return {
        ...initialCameraState,
        mode: state.mode,
        isLowLight: state.isLowLight,
        baseHoldTime: state.baseHoldTime,
        groupReadyCount: initialCameraState.groupReadyCount,
        groupTotalCount: initialCameraState.groupTotalCount,
      };
    }

    default:
      return state;
  }
}
