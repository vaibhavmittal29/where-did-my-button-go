import {
  HOLD_TIME_MS,
  LOW_LIGHT_MULTIPLIER,
  CANDIDATE_FRAMES,
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
  | { type: 'VOICE_TRIGGER'; phrase?: string }
  | { type: 'VOLUME_KEY' }
  | { type: 'MODE_CHANGE'; mode: CameraMode }
  | { type: 'SET_LOW_LIGHT'; isLowLight: boolean }
  | { type: 'SET_GROUP_READY'; count: number }
  | { type: 'RESET' };

export const initialCameraState: CameraState = {
  status: 'IDLE',
  focusPoint: null,
  progress: 0,
  mode: 'still',
  isLowLight: false,
  selectedFrameIndex: 3, // middle frame (0..6)
  bestFrameIndex: 3,
  statusMessage: null,
  savedPhoto: false,
  canUndo: false,
  groupReadyCount: 3,
  groupTotalCount: 4,
};

export function getEffectiveHoldTime(isLowLight: boolean): number {
  return isLowLight ? HOLD_TIME_MS * LOW_LIGHT_MULTIPLIER : HOLD_TIME_MS;
}

export function cameraReducer(state: CameraState, action: CameraAction): CameraState {
  switch (action.type) {
    case 'TAP_SUBJECT': {
      return {
        ...state,
        status: 'FOCUSED',
        focusPoint: { x: action.x, y: action.y },
        progress: 0,
        statusMessage: null,
        canUndo: false,
      };
    }

    case 'STEADY_OK': {
      if (state.status !== 'FOCUSED') return state;
      return {
        ...state,
        status: 'LOCKING',
        statusMessage: state.isLowLight ? 'Low light — hold a bit longer' : 'Hold steady',
      };
    }

    case 'STEADY_TICK': {
      if (state.status !== 'LOCKING') return state;
      const holdTime = getEffectiveHoldTime(state.isLowLight);
      const nextProgress = Math.min(1, state.progress + action.dt / holdTime);
      if (nextProgress >= 1) {
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
        statusMessage: 'Hold still',
      };
    }

    case 'PROGRESS_COMPLETE': {
      if (state.status !== 'LOCKING') return state;
      return {
        ...state,
        status: 'CAPTURED',
        progress: 1,
        statusMessage: 'Captured!',
      };
    }

    case 'ANIM_DONE': {
      if (state.status === 'CANCELLED') {
        // Pin remains at focusPoint so user can retry instantly
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
      // Voice trigger bypasses tap if phone is steady
      return {
        ...state,
        status: 'CAPTURED',
        progress: 1,
        statusMessage: `Voice capture: "${action.phrase || 'Cheese'}"`,
      };
    }

    case 'VOLUME_KEY': {
      // Accessibility fallback trigger
      return {
        ...state,
        status: 'CAPTURED',
        progress: 1,
        statusMessage: 'Accessibility capture (Volume key)',
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

    case 'SET_GROUP_READY': {
      return {
        ...state,
        groupReadyCount: action.count,
      };
    }

    case 'RESET': {
      return {
        ...initialCameraState,
        mode: state.mode,
        isLowLight: state.isLowLight,
      };
    }

    default:
      return state;
  }
}
