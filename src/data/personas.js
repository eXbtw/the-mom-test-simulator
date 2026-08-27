// Persona catalogue for onboarding. Each entry maps to a system prompt for
// the future Агент-Респондент; for now the mock in src/mock/persona.js only
// distinguishes replies by trigger type, not by persona.
export const PERSONAS = [
  {
    id: 'fleet-owner',
    name: 'Игорь Соколов',
    role: 'Владелец корпоративного автопарка (B2B)',
    difficulty: 'Hard',
    description:
      'Управляет 50 автомобилями. Главная головная боль — простои машин из-за ДТП, проблемы со страховыми выплатами и текучка водителей.',
  },
]
