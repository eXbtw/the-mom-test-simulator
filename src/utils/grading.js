const GRADES = [
  { min: 80, label: 'Senior Researcher' },
  { min: 60, label: 'Middle Researcher' },
  { min: 40, label: 'Junior Researcher' },
  { min: 0, label: 'Novice Researcher' },
]

export function gradeForScore(score) {
  return GRADES.find((g) => score >= g.min).label
}
