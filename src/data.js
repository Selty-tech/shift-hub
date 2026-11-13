export const demoProfile = {
  name: 'Erika Musterfrau',
  role: 'Schichtleitung · Demo',
  initials: 'EM',
  restaurant: 'Bistro Morgenrot',
}

export const shiftOptions = [
  { id: 'early', name: 'Frühschicht', short: 'Früh', color: 'sunrise' },
  { id: 'mid', name: 'Mittelschicht', short: 'Mitte', color: 'daylight' },
  { id: 'late', name: 'Spätschicht', short: 'Spät', color: 'evening' },
]

export const kpiTargets = {
  r2p: { label: 'R2P', target: 90, unit: 'Sekunden' },
  eope: { label: 'EOPE', target: 120, unit: 'Sekunden' },
}

export const demoReadings = { r2p: 84, eope: 109 }

export const checklistTemplate = [
  {
    id: 'team-briefing',
    category: 'Team',
    title: 'Kurze Schichtübergabe durchführen',
    detail: 'Wichtige Hinweise und offene Punkte für diese fiktive Schicht gemeinsam durchgehen.',
  },
  {
    id: 'guest-area',
    category: 'Bereiche',
    title: 'Gästebereich vorbereiten',
    detail: 'Sitzbereiche, Eingangsbereich und Wegweiser auf einen ordentlichen Zustand prüfen.',
  },
  {
    id: 'service-stations',
    category: 'Ausstattung',
    title: 'Arbeitsstationen prüfen',
    detail: 'Kontrollieren, ob die benötigten Arbeitsmittel für die Schicht bereitliegen.',
  },
  {
    id: 'handover-notes',
    category: 'Übergabe',
    title: 'Offene Aufgaben festhalten',
    detail: 'Noch nicht erledigte Punkte mit einer kurzen Notiz für die nächste Schicht markieren.',
  },
  {
    id: 'closing-review',
    category: 'Abschluss',
    title: 'Schichtstand gemeinsam prüfen',
    detail: 'Zum Schichtende die erledigten und noch offenen Aufgaben kurz zusammenfassen.',
  },
]

export const demoTeam = [
  { name: 'Max Mustermann', role: 'Service' },
  { name: 'Erika Musterfrau', role: 'Schichtleitung' },
  { name: 'Robin Beispiel', role: 'Küche' },
  { name: 'Kim Sommer', role: 'Service' },
]

export const upcomingContent = {
  announcement: {
    label: 'Team-Update',
    title: 'Neue Ideen für die Winterkarte',
    body: 'In dieser Demo gibt es ab Montag eine erfundene Birnen-Ingwer-Kreation zum Probieren.',
    date: '13. November',
  },
  training: {
    label: 'Training · Demo',
    title: 'Allergenhinweise im Gespräch',
    due: 'Fällig am 18. November',
  },
  event: {
    time: '15:00',
    title: 'Ideenrunde zur Winterkarte',
    place: 'Teamraum · Demo-Termin',
  },
}

export function createShiftDraft(date, shiftId) {
  return {
    date,
    shiftId,
    items: checklistTemplate.map((task) => ({
      id: task.id,
      done: false,
      notes: '',
      checkedAt: null,
      checkedBy: null,
    })),
    r2pValue: '',
    eopeValue: '',
    updatedAt: null,
  }
}
