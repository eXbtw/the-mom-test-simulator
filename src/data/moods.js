// Client-visible mood catalogue — labels only. The actual behavioral prompt
// text lives server-side in api/persona.js so the client only ever sends an
// id, not free-text instructions, to the model.
export const MOODS = [
  { id: 'rushed', label: 'Спешит' },
  { id: 'friendly', label: 'Дружелюбен' },
  { id: 'skeptical', label: 'Скептичен' },
  { id: 'agreeable', label: 'Соглашается со всем' },
]

export function pickRandomMood() {
  return MOODS[Math.floor(Math.random() * MOODS.length)]
}
