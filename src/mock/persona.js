// Mock stand-in for Агент-Респондент (Persona). Real version will call an LLM
// with the persona system prompt from the PRD.

const SOCIALLY_NICE_REPLIES = [
  'Да, звучит неплохо, наверное, купил бы что-то такое.',
  'В целом да, было бы полезно, почему нет.',
]

const REAL_PAIN_REPLIES = [
  'Честно? В прошлый раз машина простояла три недели, пока страховая тянула с выплатой — водитель всё это время сидел без работы.',
  'Была история: ДТП по вине третьей стороны, а разбирались почти месяц. За это время потеряли примерно 40 рейсов.',
  'Текучка водителей — отдельная боль. Обучаем нового, а он через пару месяцев уходит в такси.',
]

const NEUTRAL_REPLIES = [
  'Ну, смотря что вы имеете в виду.',
  'Можете уточнить вопрос?',
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getPersonaReply(triggerType) {
  if (triggerType === 'hypothetical' || triggerType === 'leading_question') {
    return pickRandom(SOCIALLY_NICE_REPLIES)
  }
  if (triggerType === 'good_question') {
    return pickRandom(REAL_PAIN_REPLIES)
  }
  return pickRandom(NEUTRAL_REPLIES)
}
