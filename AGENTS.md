# ColdStartBench agent and contributor guide

## Purpose

ColdStartBench records fresh AI coding-agent trials against developer tools using public documentation and package surfaces. It stores trial provenance, an append-only event log, and a JSON report. Its current v0.1 scope is recording and summarizing externally verified results; it does not launch agents, sandbox work, run target-specific checks, or score quality.

## Architecture

- `scripts/coldstartbench.mjs` is the dependency-free Node.js CLI entry point.
- `trial.json` stores trial metadata, provenance, and task IDs.
- `events.jsonl` stores one timestamped JSON event per line.
- `report.json` stores aggregate and per-task event counts, task elapsed time, and source events.
- `docs/event-schema.md` documents the event vocabulary and timing rules.
- `examples/clean-trial/` is a complete fixed-time sample following the current formats.

The CLI is a small command dispatcher using Node built-ins. `npm start -- ...` passes arguments to this entry point.

## CLI usage

```sh
npm install
npm start -- init ./trials/run-01 task-one task-two
npm start -- record ./trials/run-01 task-one task-start
npm start -- record ./trials/run-01 task-one build-attempt "PASS: clean build"
npm start -- record ./trials/run-01 task-one task-finish
npm start -- report ./trials/run-01
```

Supported commands are `init`, `record`, and `report`. Event types are defined in `scripts/coldstartbench.mjs`; an incomplete `record` command prints the accepted event list.

## Event model

Each event has `timestamp`, `taskId`, `type`, and free-text `detail`. Events are appended to `events.jsonl`. Detail should state the observed outcome and point to saved evidence when useful. Events are operator-recorded from transcripts or external checks; model claims alone do not establish acceptance.

The current event types are `task-start`, `task-finish`, `check-attempt`, `build-attempt`, `test-attempt`, `test-success`, `http-check`, `sqlite-check`, `browser-check`, `restart-check`, `screenshot`, `repair-iteration`, and `manual-intervention`.

## Report format and invariants

Reports use schema version `coldstartbench.report.v1`. They include trial provenance, task and event totals, event counts overall and per task, elapsed seconds, and recorded events. Elapsed time uses the first `task-start` and last `task-finish` event per task; absent endpoints produce `null`.

Preserve these invariants when changing the tool:

1. `init` must refuse to overwrite an existing trial directory.
2. `record` must reject task IDs absent from `trial.json` and event types outside the supported list.
3. Recording appends events; it must not rewrite earlier evidence.
4. Reports summarize observations and must not imply that checks were executed or independently verified by ColdStartBench.
5. Keep output local to the requested trial directory and retain original event records in the report.
6. If a schema or event behavior changes, update this file, `README.md`, `docs/event-schema.md`, and the sample trial together. Version incompatible report changes with a new schema version.

## Contributing with AI

Read `README.md`, this guide, and `docs/event-schema.md` before editing. Keep changes small and preserve the CLI's existing behavior. Prefer Node built-ins; do not add frameworks or dependencies for simple file and JSON operations. Do not add target-specific prompts, private trial results, credentials, user paths, or benchmark-success claims without evidence. Update the machine-readable example when changing event or report formats.

Before submitting a change, run `npm install` and exercise `init`, `record`, and `report` in a new temporary trial directory. There is no separate automated test suite in v0.1.
