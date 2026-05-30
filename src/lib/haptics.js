// Lightweight haptic feedback. Uses the Vibration API where available
// (Android Chrome, some others). iOS Safari ignores navigator.vibrate, but
// degrades silently — there's no web API for the Taptic Engine yet, so this
// is best-effort and never throws.
function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export const haptics = {
  // A light tick — for toggles, selections, taps.
  light() {
    if (canVibrate()) {
      try { navigator.vibrate(8); } catch {}
    }
  },
  // A medium thud — for confirming an action (done, save).
  medium() {
    if (canVibrate()) {
      try { navigator.vibrate(16); } catch {}
    }
  },
  // A success pattern — for the "all done" celebration.
  success() {
    if (canVibrate()) {
      try { navigator.vibrate([12, 40, 24]); } catch {}
    }
  },
  // A warning buzz — for errors.
  error() {
    if (canVibrate()) {
      try { navigator.vibrate([40, 30, 40]); } catch {}
    }
  },
};
