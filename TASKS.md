# ShiftHub task list

Last reviewed: 2026-11-13

Re-check the current code and production demo before selecting work in a new session. Choose and complete one milestone at a time.

## Implemented in the current MVP

- [x] German React/Vite interface with responsive desktop and mobile navigation.
- [x] Fictional home dashboard with team updates, a training reminder, checklist progress, and sample KPI readings.
- [x] Date and shift selection for Frühschicht, Mittelschicht, and Spätschicht.
- [x] Expandable checklist tasks, completion timestamps, and optional notes.
- [x] Manual R2P and EOPE demo values with targets of 90 and 120 seconds.
- [x] Drafts saved per date and shift in the current browser's `localStorage`.
- [x] Demo reset that clears this browser's saved records.
- [x] Public production deployment with Vercel login protection disabled.

## Remaining milestones

- [ ] Shift completion: required-field validation, finalization, completion history, and PDF export.
- [ ] Monthly duty roster.
- [ ] Repair reporting and status tracking.
- [ ] Complaint and guest-feedback tracking.
- [ ] Full training workflows, including assignments, materials, and completion history.
- [ ] Remaining dashboard content and final accessibility/responsive polish.

Confirm each item against the latest code before choosing the next milestone. Planned screens and roadmap text do not count as implemented functionality.

## Project constraints

- Use fictional names, organizations, schedules, incidents, KPI values, and other demo records.
- Do not copy workplace screenshots, records, or documents into the project.
- Keep drafts local to the visitor's browser unless a future request explicitly changes the storage design.
- Do not add a backend or paid service unless the feature requires it and Sergi approves it.
- Preserve existing demo progress where practical; ask before destructive data changes.
- Keep portfolio wording limited to features that have been implemented and verified.

## Session workflow

When Sergi says **“Continue ShiftHub”**:

1. Read the repository, README, and this task list; inspect the current implementation.
2. Select one unfinished milestone and briefly explain the scope.
3. Implement it fully, then run relevant checks and verify the actual browser flow, including mobile layout, persistence, and error handling where applicable.
4. Update the README and this task list; only check off work that was verified.
5. Commit and push the milestone, deploy it to the existing ShiftHub Vercel project, and verify the production URL.
6. Keep the portfolio accurate and redeploy it only when its content or screenshot needs updating.
7. Report what changed, what was verified, the live URL, and the next milestone. Then stop and wait for the next request.

Do not schedule or continue work automatically between sessions.
