# Trial event schema

`init` creates `trial.json` with a trial ID, timestamps, provenance fields, and the supplied task IDs. Fill in the provenance fields (`target`, `agent`, `model`, `modelVersion`, `systemPrompt`, and `toolSetup`) before sharing a report.

`record` appends one JSON object per line to `events.jsonl`. Every event includes a timestamp, task ID, event type, and free-text detail. Supported event types:

- `task-start`, `task-finish`
- `check-attempt`, `build-attempt`, `test-attempt`, `test-success`
- `repair-iteration`, `manual-intervention`
- `http-check`, `sqlite-check`, `browser-check`, `restart-check`, `screenshot`

The event log is an operator record. Include concise outcomes and evidence file paths in the detail field; do not put credentials or personal data there. `report` counts event types overall and by task and calculates elapsed seconds between the first start and last finish event for each task. It preserves the original events in `report.json` so another tool can compare or review the runs.

This version does not execute target-specific checks or decide whether a task passed. Compare trials only when task IDs and acceptance criteria match.

[`examples/clean-trial/`](../examples/clean-trial/) contains a complete metadata file, event log, and report with build, repair, HTTP, SQLite, browser, and restart evidence.
