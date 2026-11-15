import { useState } from 'react'
import {
  checklistTemplate,
  demoProfile,
  kpiTargets,
  shiftOptions,
  validateShiftCompletion,
} from '../data'
import { formatFullDate, formatTime } from '../utils'
import Icon from './Icon'

const completedAtFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' })

export default function ShiftPage({
  selectedDate,
  selectedShift,
  record,
  records,
  saveMessage,
  onDateChange,
  onShiftChange,
  onItemChange,
  onKpiChange,
  onSave,
  onFinalize,
  onOpenCompleted,
}) {
  const [validationError, setValidationError] = useState('')
  const [persistenceWarningKey, setPersistenceWarningKey] = useState('')
  const completeCount = record.items.filter((item) => item.done).length
  const totalCount = checklistTemplate.length
  const progress = Math.round((completeCount / totalCount) * 100)
  const selectedShiftName = shiftOptions.find((item) => item.id === selectedShift)?.name
  const isFinalized = Boolean(record.finalizedAt)
  const recordKey = `${record.date}::${record.shiftId}`
  const persistenceWarning = persistenceWarningKey === recordKey
  const completedRecords = Object.values(records)
    .filter((entry) => entry?.finalizedAt)
    .sort((left, right) => right.finalizedAt.localeCompare(left.finalizedAt))

  function requestFinalization() {
    const errors = validateShiftCompletion(record)
    if (errors.length > 0) {
      setValidationError(`Zum Abschließen fehlen noch Angaben: ${errors.join(' ')}`)
      return
    }
    setValidationError('')
    if (!onFinalize()) {
      setPersistenceWarningKey(recordKey)
    }
  }

  function printReport() {
    window.print()
  }

  const finalizedLabel = record.finalizedAt
    ? completedAtFormatter.format(new Date(record.finalizedAt))
    : ''

  return (
    <section className="shift-page">
      <div className="page-heading">
        <p className="eyebrow">Dein Schichtbereich</p>
        <h1>Schichtcheckliste</h1>
        <p>Arbeite die fiktiven Aufgaben für den ausgewählten Tag und die Schicht durch.</p>
      </div>

      <div className="shift-controls card">
        <label className="date-field">
          <span>Datum</span>
          <input type="date" value={selectedDate} onChange={(event) => onDateChange(event.target.value)} />
        </label>
        <div className="shift-type-picker" role="group" aria-label="Schicht auswählen">
          {shiftOptions.map((shift) => (
            <button
              key={shift.id}
              type="button"
              className={`shift-choice ${selectedShift === shift.id ? 'shift-choice-selected' : ''}`}
              onClick={() => onShiftChange(shift.id)}
              aria-pressed={selectedShift === shift.id}
            >
              <span className={`shift-dot shift-dot-${shift.color}`} aria-hidden="true" />{shift.name}
            </button>
          ))}
        </div>
      </div>

      <section className="shift-owner-card card" aria-label="Fiktive Schichtleitung">
        <span className="avatar avatar-small">{demoProfile.initials}</span>
        <span><small>Fiktive Schichtleitung</small><strong>{demoProfile.name}</strong></span>
        <span className="owner-role">Demo</span>
      </section>

      <section className="checklist-panel card" aria-labelledby="checklist-title">
        <div className="checklist-panel-header">
          <div>
            <p className="eyebrow">{formatFullDate(selectedDate)} · {selectedShiftName}</p>
            <h2 id="checklist-title">Aufgaben für die Schicht</h2>
          </div>
          <span className="completion-count">{isFinalized ? 'Abgeschlossen' : `${completeCount} von ${totalCount} erledigt`}</span>
        </div>
        <div
          className="progress-track progress-track-large"
          role="progressbar"
          aria-label="Schichtcheckliste"
          aria-valuemin="0"
          aria-valuemax={totalCount}
          aria-valuenow={completeCount}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="checklist-items">
          {checklistTemplate.map((task) => {
            const item = record.items.find((savedItem) => savedItem.id === task.id) ?? { done: false, notes: '', checkedAt: null, checkedBy: null }
            const checkboxId = `task-${selectedDate}-${selectedShift}-${task.id}`
            return (
              <article className={`checklist-item ${item.done ? 'checklist-item-done' : ''}`} key={task.id}>
                <div className="checklist-row">
                  <input
                    className="task-checkbox"
                    id={checkboxId}
                    type="checkbox"
                    checked={item.done}
                    disabled={isFinalized}
                    onChange={(event) => onItemChange(task.id, { done: event.target.checked })}
                  />
                  <label className="task-label" htmlFor={checkboxId}>
                    <span className="task-title">{task.title}</span>
                    <span className="task-meta">{task.category}{item.done && item.checkedAt ? ` · Erledigt ${formatTime(item.checkedAt)} von ${item.checkedBy}` : ''}</span>
                  </label>
                  <details className="task-details">
                    <summary aria-label={`Details zu: ${task.title}`}><span>Details</span><Icon name="right" size={17} /></summary>
                    <div className="task-details-body">
                      <p>{task.detail}</p>
                      <label className="note-field">
                        <span>Notiz (optional)</span>
                        <textarea
                          value={item.notes ?? ''}
                          maxLength={240}
                          rows={2}
                          disabled={isFinalized}
                          placeholder="Fiktive Notiz zur Aufgabe …"
                          onChange={(event) => onItemChange(task.id, { notes: event.target.value })}
                        />
                      </label>
                    </div>
                  </details>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="card kpi-entry-card" aria-labelledby="kpi-entry-title">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Manuelle Eingabe · Demo</p>
            <h2 id="kpi-entry-title">Schicht-Kennzahlen</h2>
          </div>
          <span className="card-icon card-icon-yellow"><Icon name="clock" /></span>
        </div>
        <p className="card-copy">Nur fiktive Beispielwerte. Es gibt keine Verbindung zu Kassen, Sensoren oder anderen Restaurant-Systemen.</p>
        <div className="kpi-input-grid">
          {Object.entries(kpiTargets).map(([key, metric]) => {
            const value = record[`${key}Value`] ?? ''
            const numericValue = value === '' ? null : Number(value)
            const onTarget = numericValue !== null && Number.isFinite(numericValue) && numericValue <= metric.target
            return (
              <label className="kpi-input-field" key={key}>
                <span className="kpi-input-label">{metric.label}<small>Ziel ≤ {metric.target} s</small></span>
                <span className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    max="999"
                    step="1"
                    inputMode="numeric"
                    placeholder="Wert"
                    value={value}
                    disabled={isFinalized}
                    onChange={(event) => onKpiChange(key, event.target.value)}
                    aria-label={`${metric.label} Ist-Wert in Sekunden`}
                  />
                  <span>Sek.</span>
                </span>
                {numericValue !== null && Number.isFinite(numericValue) && (
                  <small className={`input-status ${onTarget ? 'text-good' : 'text-attention'}`}>
                    {onTarget ? 'Im Ziel' : 'Über Ziel'} · Demo-Wert
                  </small>
                )}
              </label>
            )
          })}
        </div>
      </section>

      {isFinalized ? (
        <section className="completion-panel card" aria-labelledby="completion-title">
          <div>
            <p className="eyebrow">{persistenceWarning ? 'Abgeschlossen · nicht dauerhaft gespeichert' : 'Schichtbericht gespeichert'}</p>
            <h2 id="completion-title">Diese Schicht ist abgeschlossen</h2>
            <p>Abgeschlossen am {finalizedLabel}. {persistenceWarning ? 'Der Bericht ist bis zum Schließen dieser Seite verfügbar.' : 'Der Bericht bleibt in diesem Browser verfügbar.'}</p>
            {persistenceWarning && <p className="validation-error" role="alert">Abgeschlossen, aber nicht dauerhaft gespeichert. Browser-Speicher ist nicht verfügbar. Erstelle jetzt ein PDF, bevor du diese Seite schließt.</p>}
          </div>
          <button className="primary-button" type="button" onClick={printReport}>Als PDF speichern <Icon name="download" size={17} /></button>
          <p className="export-help">Der Browser öffnet den Druckdialog. Wähle dort „Als PDF speichern“.</p>
        </section>
      ) : (
        <>
          <div className="save-bar card">
            <div className="save-indicator">
              <span className={`save-dot ${saveMessage.startsWith('Browser-Speicher') ? 'save-dot-error' : ''}`} />
              <span>{saveMessage || 'Änderungen werden in diesem Browser gespeichert.'}</span>
            </div>
            <button className="secondary-button" type="button" onClick={onSave}>Zwischenspeichern <Icon name="check" size={17} /></button>
          </div>
          <section className="completion-panel card" aria-labelledby="completion-title">
            <div>
              <p className="eyebrow">Letzter Schritt</p>
              <h2 id="completion-title">Schicht abschließen</h2>
              <p>Zum Erstellen des Berichts müssen alle Aufgaben erledigt und beide Kennzahlen eingetragen sein.</p>
            </div>
            <button className="primary-button" type="button" onClick={requestFinalization}>Abschließen &amp; Bericht erstellen <Icon name="check" size={17} /></button>
            {validationError && <p className="validation-error" role="alert">{validationError}</p>}
          </section>
        </>
      )}

      <section className="shift-history card" aria-labelledby="shift-history-title">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Nur in diesem Browser</p>
            <h2 id="shift-history-title">Abgeschlossene Schichten</h2>
          </div>
          <span className="completion-count">{completedRecords.length}</span>
        </div>
        {completedRecords.length === 0 ? (
          <p className="history-empty">Hier erscheinen Schichtberichte, sobald du eine Schicht abschließt.</p>
        ) : (
          <ul className="history-list">
            {completedRecords.map((entry) => {
              const shiftName = shiftOptions.find((shift) => shift.id === entry.shiftId)?.name ?? 'Schicht'
              const isCurrent = entry.date === selectedDate && entry.shiftId === selectedShift
              return (
                <li className="history-item" key={`${entry.date}::${entry.shiftId}`}>
                  <div>
                    <strong>{formatFullDate(entry.date)} · {shiftName}</strong>
                    <span>Abgeschlossen {completedAtFormatter.format(new Date(entry.finalizedAt))}</span>
                  </div>
                  <button className="secondary-button" type="button" onClick={() => onOpenCompleted(entry.date, entry.shiftId)}>
                    {isCurrent ? 'Angezeigt' : 'Bericht öffnen'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {isFinalized && (
        <article className="print-report card" id="shift-report">
          <header className="report-header">
            <div>
              <span className="report-brand">ShiftHub</span>
              <span className="report-disclaimer">Fiktive Portfolio-Demo · keine Betriebsdaten</span>
            </div>
            <span className="report-status">Abgeschlossen</span>
          </header>
          <p className="eyebrow">Schichtbericht</p>
          <h1>{formatFullDate(record.date)}</h1>
          <p className="report-subtitle">{selectedShiftName} · {demoProfile.restaurant} · {demoProfile.name}</p>
          <p className="report-time">Abgeschlossen: {finalizedLabel}</p>

          <h2>Kennzahlen</h2>
          <div className="report-kpis">
            {Object.entries(kpiTargets).map(([key, metric]) => (
              <div className="report-kpi" key={key}>
                <span>{metric.label}</span>
                <strong>{record[`${key}Value`]} Sek.</strong>
                <small>Ziel ≤ {metric.target} Sek.</small>
              </div>
            ))}
          </div>

          <h2>Aufgaben</h2>
          <ol className="report-task-list">
            {checklistTemplate.map((task) => {
              const item = record.items.find((savedItem) => savedItem.id === task.id)
              return (
                <li key={task.id}>
                  <div className="report-task-title"><strong>{task.title}</strong><span>Erledigt</span></div>
                  <small>{task.category} · {formatTime(item?.checkedAt)} · {item?.checkedBy ?? demoProfile.name}</small>
                  {item?.notes && <p>{item.notes}</p>}
                </li>
              )
            })}
          </ol>
          <footer className="report-footer">Erstellt mit ShiftHub · Alle Namen und Beispieldaten sind fiktiv.</footer>
        </article>
      )}
      <p className="shift-footnote">Entwürfe und abgeschlossene Schichtberichte bleiben lokal in diesem Browser und werden nicht hochgeladen.</p>
    </section>
  )
}
