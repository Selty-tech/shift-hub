# ShiftHub

A mobile-first portfolio demo for organizing fictional restaurant shift information. The interface and records are being built from scratch, inspired by a practical problem I experienced as a shift leader: details spread across paper checklists and chat messages can be difficult to find during a busy shift.

This is an independent portfolio implementation. It is not the original workplace app and has not been deployed at a workplace.

> **Portfolio-Demo — alle Personen, Einträge und Betriebsdaten sind fiktiv.**

## Current milestone

See [TASKS.md](./TASKS.md) for the persistent milestone list and session workflow.

- German mobile-first interface with desktop navigation.
- Home dashboard with fictional team updates, training reminder, scheduled demo team, checklist progress, and fictional KPI readings.
- Date and shift selection for Frühschicht, Mittelschicht, and Spätschicht.
- Expandable checklist details and optional notes.
- Manual demo input for R2P and EOPE. The configurable demo targets are 90 and 120 seconds; lower values are shown as on target.
- Required-field validation before shift completion: all checklist items and both KPI values must be present and valid.
- Finalized shifts are read-only and appear in a completion history saved in the current browser.
- A printable shift report can be saved as PDF through the browser's print dialog.
- Drafts and completion history remain in the current browser only. Use **Demo zurücksetzen** to clear them.
- Planned sections are clearly marked and are not presented as working features.

## Technology

- React and JavaScript for the interface.
- Vite for local development and static production builds.
- CSS for responsive layout and styling.
- Browser `localStorage` for visitor-isolated demo progress.

The current feature set uses browser storage so visitors can try the workflows without registration or a shared database. No backend or restaurant-system integration is included.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```sh
npm run build
npm run preview
```

## Demo notes

- There is one simulated **Schichtleitung** profile and no real registration.
- Checklist items, notes, demo KPI inputs, and completed reports are isolated to the visitor's browser and can be cleared from the header.
- The KPI readings shown are fictional examples. The app does not connect to restaurant systems or calculate the underlying timings.
- No real employee records, schedules, operational reports, learning documents, screenshots, or workplace data are included.

## Planned work

The monthly duty roster, repair and complaint workflows, training records and original learning materials, remaining dashboard content, and final responsive polish will be added in later, reviewable milestones.

## Contribution and AI assistance

I am building this as a learning project from my own shift-leadership experience. I choose the workflows and review the privacy and product decisions; AI coding assistance helps me explore implementation options and work through the code. I am developing it incrementally so I can explain the choices and implementation in an interview.
