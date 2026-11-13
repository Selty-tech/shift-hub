import {
  checklistTemplate,
  demoProfile,
  demoReadings,
  demoTeam,
  kpiTargets,
  shiftOptions,
  upcomingContent,
} from '../data'
import { addDays, formatFullDate, localDateKey } from '../utils'
import Icon from './Icon'

function getProgress(record) {
  const complete = record.items.filter((item) => item.done).length
  return { complete, total: checklistTemplate.length, percent: Math.round((complete / checklistTemplate.length) * 100) }
}

function getKpiValue(record, key) {
  const entered = record[`${key}Value`]
  return entered !== '' && entered !== undefined && Number.isFinite(Number(entered))
    ? Number(entered)
    : demoReadings[key]
}

function KpiCard({ kpiKey, value }) {
  const metric = kpiTargets[kpiKey]
  const onTarget = value <= metric.target

  return (
    <article className="kpi-card kpi-card-compact">
      <div className="kpi-card-top">
        <span className="kpi-name">{metric.label}</span>
        <span className={`status-pill ${onTarget ? 'status-good' : 'status-attention'}`}>
          {onTarget ? 'Im Ziel' : 'Über Ziel'}
        </span>
      </div>
      <div className="kpi-value-row">
        <strong>{value}<span> s</span></strong>
        <span className="kpi-target">Ziel ≤ {metric.target} s</span>
      </div>
      <p className="kpi-caption">Fiktiver Demo-Wert · niedrigere Werte sind besser</p>
    </article>
  )
}

function WeekPicker({ weekStart, selectedDate, todayKey, onDateChange, onWeekChange, onToday }) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const monthLabel = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(weekStart)

  return (
    <section className="week-card card" aria-label="Woche und Datum auswählen">
      <div className="week-heading">
        <div>
          <p className="eyebrow">Woche auswählen</p>
          <h2>{monthLabel}</h2>
        </div>
        <div className="week-controls">
          <button className="icon-button" type="button" onClick={() => onWeekChange(-1)} aria-label="Vorherige Woche">
            <Icon name="left" />
          </button>
          <button className="today-button" type="button" onClick={onToday}>Heute</button>
          <button className="icon-button" type="button" onClick={() => onWeekChange(1)} aria-label="Nächste Woche">
            <Icon name="right" />
          </button>
        </div>
      </div>
      <div className="week-days">
        {days.map((date) => {
          const key = localDateKey(date)
          const chosen = key === selectedDate
          return (
            <button
              key={key}
              type="button"
              className={`day-button ${chosen ? 'day-selected' : ''} ${key === todayKey ? 'day-today' : ''}`}
              onClick={() => onDateChange(key)}
              aria-pressed={chosen}
              aria-label={formatFullDate(key)}
            >
              <span>{new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(date).replace('.', '')}</span>
              <strong>{date.getDate()}</strong>
              <small>{new Intl.DateTimeFormat('de-DE', { month: 'short' }).format(date).replace('.', '')}</small>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function HomePage({
  selectedDate,
  selectedShift,
  todayKey,
  weekStart,
  record,
  onDateChange,
  onWeekChange,
  onToday,
  onOpenShift,
}) {
  const progress = getProgress(record)
  const shift = shiftOptions.find((option) => option.id === selectedShift)

  return (
    <>
      <section className="welcome-card">
        <div>
          <p className="eyebrow">{formatFullDate(selectedDate)}</p>
          <h1>Hallo, Erika<span className="wave">✳</span></h1>
          <p className="welcome-subtitle">Dein fiktiver Überblick für <strong>{demoProfile.restaurant}</strong>.</p>
        </div>
        <div className="profile-summary">
          <span className="avatar">{demoProfile.initials}</span>
          <span><strong>{demoProfile.name}</strong><small>{demoProfile.role}</small></span>
        </div>
      </section>

      <section className="demo-notice" aria-label="Demo-Hinweis">
        <span className="notice-mark"><Icon name="spark" size={18} /></span>
        <p>Portfolio-Demo — alle Personen, Einträge und Betriebsdaten sind fiktiv.</p>
      </section>

      <section className="dashboard-grid dashboard-grid-top" aria-label="Neuigkeiten und Aufgaben">
        <article className="card announcement-card">
          <div className="card-label-row">
            <span className="card-icon card-icon-mint"><Icon name="bell" /></span>
            <span className="status-pill status-new">Neuigkeiten</span>
          </div>
          <p className="eyebrow">{upcomingContent.announcement.label} · {upcomingContent.announcement.date}</p>
          <h2>{upcomingContent.announcement.title}</h2>
          <p className="card-copy">{upcomingContent.announcement.body}</p>
          <div className="content-tag"><Icon name="spark" size={15} /> Fiktive Aktion</div>
        </article>

        <article className="card training-reminder">
          <div className="card-label-row">
            <span className="card-icon card-icon-lilac"><Icon name="training" /></span>
            <span className="status-pill status-upcoming">Offen</span>
          </div>
          <p className="eyebrow">Deine Demo-Aufgabe</p>
          <h2>{upcomingContent.training.title}</h2>
          <p className="card-copy">{upcomingContent.training.due}</p>
          <span className="planned-caption">Trainingsmodul folgt in einem späteren Meilenstein.</span>
        </article>
      </section>

      <WeekPicker
        weekStart={weekStart}
        selectedDate={selectedDate}
        todayKey={todayKey}
        onDateChange={onDateChange}
        onWeekChange={onWeekChange}
        onToday={onToday}
      />

      <section className="dashboard-grid dashboard-grid-main" aria-label="Schichtübersicht">
        <article className="card shift-summary-card">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Ausgewählter Tag</p>
              <h2>{shift?.name ?? 'Schicht'}</h2>
            </div>
            <span className={`shift-dot shift-dot-${shift?.color ?? 'daylight'}`} aria-hidden="true" />
          </div>
          <div className="team-summary-heading">
            <span className="card-icon card-icon-peach"><Icon name="users" /></span>
            <span><strong>4 Personen geplant</strong><small>Fiktive Besetzung für diese Demo</small></span>
          </div>
          <div className="team-chips">
            {demoTeam.map((member) => <span className="team-chip" key={member.name}>{member.name}</span>)}
          </div>
          <div className="progress-summary">
            <div className="progress-heading">
              <span>Schichtcheckliste</span>
              <strong>{progress.complete} / {progress.total}</strong>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Schichtcheckliste"
              aria-valuemin="0"
              aria-valuemax={progress.total}
              aria-valuenow={progress.complete}
            >
              <span style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
          <button className="primary-button" type="button" onClick={onOpenShift}>
            Schicht öffnen <Icon name="arrow" size={18} />
          </button>
        </article>

        <article className="card kpi-summary-card">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Kennzahlen · Demo</p>
              <h2>Heute im Blick</h2>
            </div>
            <span className="card-icon card-icon-yellow"><Icon name="clock" /></span>
          </div>
          <div className="kpi-grid">
            <KpiCard kpiKey="r2p" value={getKpiValue(record, 'r2p')} />
            <KpiCard kpiKey="eope" value={getKpiValue(record, 'eope')} />
          </div>
          <p className="small-note">Fiktive Beispielwerte. Im Schichtbereich kannst du eigene Demo-Werte eintragen.</p>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid-bottom" aria-label="Weitere Demo-Informationen">
        <article className="card event-card">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Fiktiver Termin</p>
              <h2>{upcomingContent.event.title}</h2>
            </div>
            <span className="event-time">{upcomingContent.event.time}</span>
          </div>
          <p className="card-copy">{upcomingContent.event.place}</p>
        </article>
        <article className="card issues-card">
          <p className="eyebrow">Übersicht · Demo</p>
          <div className="issue-row"><span className="issue-icon issue-icon-rose"><Icon name="message" size={18} /></span><span><strong>2 offene Rückmeldungen</strong><small>Fiktive Beispiele · Modul folgt später</small></span></div>
          <div className="issue-row"><span className="issue-icon issue-icon-blue"><Icon name="repair" size={18} /></span><span><strong>1 Wartungsmeldung in Arbeit</strong><small>Fiktives Beispiel · Modul folgt später</small></span></div>
        </article>
      </section>
    </>
  )
}
