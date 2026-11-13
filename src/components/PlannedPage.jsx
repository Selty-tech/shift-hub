import Icon from './Icon'

const laterModules = [
  { title: 'Kennzahlen', detail: 'Fiktive Werte im Home-Dashboard und in der Schicht-Eingabe.', active: true },
  { title: 'Reparaturen', detail: 'Fiktive Meldungen anlegen und nach Status filtern.' },
  { title: 'Reklamationen', detail: 'Rückmeldungen mit einer passenden Nachverfolgung dokumentieren.' },
  { title: 'Dokumentation', detail: 'Abgeschlossene Schichtberichte und Trainingsverlauf ansehen.' },
  { title: 'Einstellungen', detail: 'Darstellung und weitere Demo-Optionen kommen später hinzu.' },
  { title: 'Lernmaterialien & Aktionen', detail: 'Eigene Teamhinweise, Lernkarten und Aktionsinfos lesen.' },
]

export default function PlannedPage({ page, onShowHome }) {
  const isMore = page === 'more'
  const title = page === 'roster' ? 'Dienstplan' : page === 'training' ? 'Training' : 'Weitere Bereiche'
  const eyebrow = page === 'roster' ? 'Geplant · nächster Meilenstein' : page === 'training' ? 'Geplant · späterer Meilenstein' : 'Weitere Module · geplant'
  const description = page === 'roster'
    ? 'Der Monatsplan mit Teamübersicht und persönlichen Schichten entsteht als nächster Ausbau.'
    : page === 'training'
      ? 'Hier kommen Trainingszuweisungen und ein fiktiver Lernverlauf hinzu.'
      : 'Reparaturen, Rückmeldungen und Dokumentation werden in späteren Schritten ergänzt.'

  return (
    <section className="planned-page">
      <div className="page-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="planned-banner card">
        <span className="planned-icon"><Icon name={page === 'roster' ? 'calendar' : page === 'training' ? 'training' : 'more'} size={25} /></span>
        <div>
          <span className="planned-label">{isMore ? 'Übersicht' : 'Noch nicht interaktiv'}</span>
          <h2>{isMore ? 'Schritt für Schritt' : 'In Vorbereitung'}</h2>
          <p>{isMore ? 'Kennzahlen sind bereits im Home-Bereich verfügbar. Die übrigen Module sind geplant und noch nicht interaktiv.' : 'Dieser Bereich ist sichtbar als Teil der geplanten App-Struktur. Es werden noch keine Funktionen vorgetäuscht.'}</p>
        </div>
      </div>
      {isMore && (
        <div className="planned-module-list">
          {laterModules.map((module, index) => (
            <article className="card planned-module" key={module.title}>
              <span className="module-number">0{index + 1}</span>
              <div><h2>{module.title}</h2><p>{module.detail}</p></div>
              {module.active ? (
                <button className="module-link" type="button" onClick={onShowHome}>Ansehen <Icon name="arrow" size={15} /></button>
              ) : (
                <span className="status-pill status-planned">Geplant</span>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
