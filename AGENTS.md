# Project Architecture Rules

- Keep manager prototype metrics, sources, and drill-down content in shared local fixtures so every displayed claim remains traceable and consistent.
- Persist the manager period selector in browser storage because the selected range must survive navigation between team and employee views.
- Build the classic manager homepage activity and employee list from shared manager fixtures, retaining employee-detail routes so restoring presentation does not fork profile data.
