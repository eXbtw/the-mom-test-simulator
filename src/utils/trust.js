// Hidden rapport score the persona uses to modulate how open it is —
// not shown in the UI, just fed into the persona's reply generation.
const DELTAS = {
  leading_question: -8,
  hypothetical: -5,
  pitching: -12,
  good_question: 10,
  neutral: 0,
}

export function computeTrust(messages) {
  let trust = 50
  for (const m of messages) {
    if (m.role === 'user' && m.evalType && DELTAS[m.evalType] !== undefined) {
      trust = Math.max(0, Math.min(100, trust + DELTAS[m.evalType]))
    }
  }
  return trust
}
