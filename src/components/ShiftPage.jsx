import {
  checklistTemplate,
  demoProfile,
  kpiTargets,
  shiftOptions,
} from '../data'
import { formatFullDate, formatTime } from '../utils'
import Icon from './Icon'

export default function ShiftPage({
  selectedDate,
  selectedShift,
  record,
  saveMessage,
  onDateChange,
  onShiftChange,
  onItemChange,
  onKpiChange,
  onSave,
}) {
  const completeCount = record.items.filter((item) => item.done).length
  const totalCount = checklistTemplate.length
  const progress = Math.round((completeCount / totalCount) * 100)
  const selectedShiftName = shiftOptions.find((item) => item.id === selectedShift)?.name

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
          <span className="completion-count">{completeCount} von {totalCount} erledigt</span>
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

      <div className="save-bar card">
        <div className="save-indicator">
          <span className={`save-dot ${saveMessage.startsWith('Browser-Speicher') ? 'save-dot-error' : ''}`} />
          <span>{saveMessage || 'Änderungen werden in diesem Browser gespeichert.'}</span>
        </div>
        <button className="primary-button" type="button" onClick={onSave}>Zwischenspeichern <Icon name="check" size={17} /></button>
      </div>
      <p className="shift-footnote">Jedes Datum und jede Schicht hat einen eigenen Demo-Entwurf. Abschließen und PDF-Export folgen in einem späteren Meilenstein.</p>
    </section>
  )
}
