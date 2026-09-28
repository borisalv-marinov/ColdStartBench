# ColdStartBench

**Benchmark how well a fresh AI coding agent learns and uses an unfamiliar developer tool from only its public surface.**

Can a fresh agent learn your tool from the same public information a new developer receives? ColdStartBench gives you a lightweight way to record the attempt, the repairs, and the evidence behind the result.

It is useful for programming-language and framework authors, SDK maintainers, AI coding-agent developers, and researchers testing tool learnability. Use it to make cold-start attempts easier to compare and harder to overclaim.

## Try it in 60 seconds

Requires Node.js 20 or later. ColdStartBench has no runtime dependencies.

```sh
npm install
npm start -- init ./trials/quickstart sample-app
npm start -- record ./trials/quickstart sample-app task-start
npm start -- record ./trials/quickstart sample-app build-attempt "PASS: clean build"
npm start -- record ./trials/quickstart sample-app repair-iteration "Fixed a missing route parameter"
npm start -- record ./trials/quickstart sample-app http-check "PASS: create and read returned expected data"
npm start -- record ./trials/quickstart sample-app sqlite-check "PASS: row persisted"
npm start -- record ./trials/quickstart sample-app browser-check "PASS: form submit showed confirmation"
npm start -- record ./trials/quickstart sample-app restart-check "PASS: data remained after restart"
npm start -- record ./trials/quickstart sample-app task-finish
npm start -- report ./trials/quickstart
```

The report includes event counts by type and task, recorded evidence details, and elapsed time between task start and finish. Here is an excerpt generated from the fixed example with `npm start -- report examples/clean-trial`:

```json
{
  "taskCount": 1,
  "eventCount": 8,
  "metrics": {
    "task-start": 1,
    "task-finish": 1,
    "build-attempt": 1,
    "repair-iteration": 1,
    "http-check": 1,
    "sqlite-check": 1,
    "browser-check": 1,
    "restart-check": 1
  },
  "taskElapsedSeconds": { "sample-app": 50 }
}
```

The full [example report](examples/clean-trial/report.json) preserves provenance and all eight event records.

**Current v0.1 limitation:** ColdStartBench records externally executed checks; it does not sandbox an agent or run build, HTTP, database, browser, or restart checks itself. Record outcomes only after verifying them, and keep the transcript or evidence files with the trial.

## What a trial contains

- `trial.json` — task IDs and agent/tool provenance
- `events.jsonl` — timestamped event ledger
- `report.json` — metrics and original events, summarized by task

Use the same task IDs and acceptance criteria across targets. Create a fresh trial directory for every attempt. The sample files in [`examples/clean-trial/`](examples/clean-trial/) show the complete machine-readable format, including build, repair, HTTP, SQLite, browser, restart, and timing evidence.

See [AI usage and a copyable evaluator prompt](docs/AI_USAGE.md), the [event schema](docs/event-schema.md), and [AGENTS.md](AGENTS.md) for contribution and implementation guidance.

## About

ColdStartBench was extracted from tooling developed during BMEC's AI cold-start validation work and was developed with extensive AI-assisted software engineering.

Repository social preview: [assets/social-preview.jpg](assets/social-preview.jpg).

Maintainer: Borislav Marinov  
Contact: b.marinov.dev@gmail.com

## License and support

Apache-2.0. See [LICENSE](LICENSE).

PayPal support: **@BorislavMarinov785**
