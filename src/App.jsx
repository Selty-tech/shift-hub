import { useRef, useState } from 'react'
import {
  createShiftDraft,
  demoProfile,
} from './data'
import {
  addDays,
  dateFromKey,
  formatTime,
  localDateKey,
  shiftKey,
  startOfWeek,
} from './utils'
import Icon from './components/Icon'
import HomePage from './components/HomePage'
import PlannedPage from './components/PlannedPage'
import ShiftPage from './components/ShiftPage'
import './App.css'

const STORAGE_KEY = 'shifthub-portfolio-demo-v1'

const navigation = [
  { id: 'shift', label: 'Schicht', icon: 'check' },
  { id: 'roster', label: 'Dienstplan', icon: 'calendar', planned: true },
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'training', label: 'Training', icon: 'training', planned: true },
  { id: 'more', label: 'Mehr', icon: 'more' },
]

function readSavedRecords() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { records: {}, message: '' }

    const saved = JSON.parse(raw)
    if (saved?.version !== 1 || !saved.records || typeof saved.records !== 'object') {
      return { records: {}, message: 'Gespeicherte Demo-Daten konnten nicht gelesen werden.' }
    }
    return { records: saved.records, message: '' }
  } catch {
    return { records: {}, message: 'Browser-Speicher ist nicht verfügbar. Änderungen bleiben nur bis zum Schließen dieser Seite erhalten.' }
  }
}

function App() {
  const [loaded] = useState(readSavedRecords)
  const [records, setRecords] = useState(loaded.records)
  const recordsRef = useRef(loaded.records)
  const [activePage, setActivePage] = useState('home')
  const [todayKey] = useState(() => localDateKey(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => localDateKey(new Date()))
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [selectedShift, setSelectedShift] = useState('early')
  const [saveMessage, setSaveMessage] = useState(loaded.message)

  const recordKey = shiftKey(selectedDate, selectedShift)
  const currentRecord = records[recordKey] ?? createShiftDraft(selectedDate, selectedShift)
  const storageError = /Browser-Speicher|nicht gelesen|nicht zurückgesetzt/i.test(saveMessage)

  function saveRecords(nextRecords, message = 'Zuletzt gespeichert') {
    recordsRef.current = nextRecords
    setRecords(nextRecords)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, records: nextRecords }))
      setSaveMessage(`${message} · ${formatTime(new Date().toISOString())}`)
    } catch {
      setSaveMessage('Browser-Speicher ist nicht verfügbar. Änderungen bleiben nur bis zum Schließen dieser Seite erhalten.')
    }
  }

  function updateCurrentRecord(patch) {
    const existing = recordsRef.current[recordKey] ?? createShiftDraft(selectedDate, selectedShift)
    const nextRecord = { ...existing, ...patch, updatedAt: new Date().toISOString() }
    saveRecords({ ...recordsRef.current, [recordKey]: nextRecord })
  }

  function updateChecklistItem(itemId, patch) {
    const existing = recordsRef.current[recordKey] ?? createShiftDraft(selectedDate, selectedShift)
    const items = existing.items.map((item) => {
      if (item.id !== itemId) return item
      const nextDone = patch.done === undefined ? item.done : patch.done
      return {
        ...item,
        ...patch,
        checkedBy: patch.done === true ? demoProfile.name : patch.done === false ? null : item.checkedBy,
        checkedAt: patch.done === true ? new Date().toISOString() : patch.done === false ? null : item.checkedAt,
        done: nextDone,
      }
    })
    updateCurrentRecord({ items })
  }

  function saveDraft() {
    const existing = recordsRef.current[recordKey] ?? currentRecord
    const nextRecord = { ...existing, updatedAt: new Date().toISOString() }
    saveRecords({ ...recordsRef.current, [recordKey]: nextRecord }, 'Entwurf gespeichert')
  }

  function resetDemo() {
    if (!window.confirm('Alle gespeicherten Checklisten und Demo-Eingaben in diesem Browser zurücksetzen?')) return
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      recordsRef.current = {}
      setRecords({})
      setSaveMessage('Demo-Daten in diesem Browser zurückgesetzt.')
    } catch {
      setSaveMessage('Browser-Speicher konnte nicht zurückgesetzt werden.')
    }
    setActivePage('home')
  }

  function handleWeekChange(amount) {
    const newWeek = addDays(weekStart, amount * 7)
    setWeekStart(newWeek)
    setSelectedDate(localDateKey(newWeek))
  }

  function goToToday() {
    const today = new Date()
    setWeekStart(startOfWeek(today))
    setSelectedDate(localDateKey(today))
  }

  function handleDateChange(value) {
    if (!value) return
    setSelectedDate(value)
    setWeekStart(startOfWeek(dateFromKey(value)))
  }

  const nav = (
    <nav className="app-navigation" aria-label="Hauptnavigation">
      {navigation.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''} ${item.planned ? 'nav-item-planned' : ''}`}
          onClick={() => setActivePage(item.id)}
          aria-current={activePage === item.id ? 'page' : undefined}
        >
          <span className="nav-icon"><Icon name={item.icon} size={22} /></span>
          <span className="nav-text">{item.label}</span>
          {item.planned && <span className="nav-planned-label">Geplant</span>}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
      <header className="topbar">
        <a className="brand-lockup" href="#home" onClick={(event) => { event.preventDefault(); setActivePage('home') }} aria-label="ShiftHub, Home">
          <span className="brand-mark"><span>S</span><i /></span>
          <span className="brand-name">Shift<span>Hub</span></span>
        </a>
        <div className="topbar-right">
          <span className="demo-chip"><span /> Portfolio-Demo</span>
          <button className="reset-button" type="button" onClick={resetDemo}><Icon name="reset" size={16} /><span>Demo zurücksetzen</span></button>
        </div>
      </header>

      <div className="app-layout">
        <aside className="desktop-sidebar">
          <div className="sidebar-label">MENÜ</div>
          {nav}
          <div className="sidebar-spacer" />
          <div className="sidebar-profile"><span className="avatar avatar-small">{demoProfile.initials}</span><span><strong>{demoProfile.name}</strong><small>Schichtleitung · Demo</small></span></div>
        </aside>

        <main id="main-content" className="main-content" data-page={activePage}>
          {storageError && activePage !== 'shift' && <div className="storage-alert" role="alert">{saveMessage}</div>}
          {activePage === 'home' && (
            <HomePage
              selectedDate={selectedDate}
              selectedShift={selectedShift}
              todayKey={todayKey}
              weekStart={weekStart}
              record={currentRecord}
              onDateChange={handleDateChange}
              onWeekChange={handleWeekChange}
              onToday={goToToday}
              onOpenShift={() => setActivePage('shift')}
            />
          )}
          {activePage === 'shift' && (
            <ShiftPage
              selectedDate={selectedDate}
              selectedShift={selectedShift}
              record={currentRecord}
              saveMessage={saveMessage}
              onDateChange={handleDateChange}
              onShiftChange={setSelectedShift}
              onItemChange={updateChecklistItem}
              onKpiChange={(key, value) => updateCurrentRecord({ [`${key}Value`]: value })}
              onSave={saveDraft}
            />
          )}
          {['roster', 'training', 'more'].includes(activePage) && (
            <PlannedPage page={activePage} onShowHome={() => setActivePage('home')} />
          )}
          <footer className="content-footer">
            <span>ShiftHub · ein persönliches Lernprojekt mit fiktiven Beispieldaten</span>
            <span>Deine Änderungen bleiben in diesem Browser.</span>
          </footer>
        </main>
      </div>
      <div className="mobile-navigation">{nav}</div>
    </div>
  )
}

export default App
