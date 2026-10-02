# Manager overview UX update

## Goal
Visualize the new manager experience from the handoff as a clickable frontend using local demo data only. Preserve the current Jarvis visual style, colors, typography, navigation, and component language.

## Employee view
- Reorganize the existing employee page so the first laptop view contains the employee header, shared period filter, short sourced brief, four fixed KPIs, and the beginning of current signals.
- Use the specified Christian demo fixture and clearly mark identities, figures, and source panels as demo data.
- Add clickable source references K1–K5 that open the matching local evidence panel.
- Add the four required KPI drill-downs: registered contacts, contacted HCOs, documentation, and debrief quality.
- Add the five current HCO signals with rule horizon, last contact, and correctly attributed future meetings.
- Add customer themes with analysis coverage and separate HCP/HCO counts; theme rows open fictional source examples.
- Add “Prepare 1:1” with exactly three sourced discussion points, working copy, and print actions.
- Keep quality explanation and historical training as compact secondary sections; show the optional HCP plan only in its dedicated demo scenario.

## Team overview
- Restructure the top of the existing manager dashboard into a concise regional brief, three sourced priorities, four region totals, district coverage, and the three-row employee table.
- Make employee names open the employee view while preserving the selected period.
- Keep digital portfolio activity separate from employee contacts.
- Retain the existing analysis/reporting areas below the new overview rather than changing unrelated functionality.

## Shared interactions and states
- Add one shared period control for 30 days, 90 days, YTD, and custom dates; preserve it between team and employee views.
- Use prepared local fixtures only. If another period has no fixture, show an honest empty state instead of relabeling 30-day values.
- Add a clearly marked prototype-only demo scenario selector for normal, empty, partial, error, historical training, documentation, meeting, and HCP-plan states.
- Ensure drawers/dialogs support Escape and keyboard focus, with traceable local source identifiers.

## Validation
- Verify team-to-employee navigation, back navigation, period retention, all source/drill-down panels, scenario states, copy, and print.
- Check the employee and team layouts at laptop and mobile widths for clipping, overlap, readable tables, and first-screen hierarchy.
- Confirm all displayed figures match the supplied fixtures and that no backend, production logic, Customer Compass, or unsupported scoring is introduced.

## Technical notes
- Centralize the manager demo fixtures and period state in focused frontend modules so totals, briefs, sources, and drill-downs use the same records.
- Reuse the existing Jarvis semantic tokens and UI controls; no palette, typography, or broad visual redesign.
