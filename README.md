# ColdStartBench

Benchmark how well a fresh AI coding agent can learn and use a developer tool from its public surface.

ColdStartBench is a lightweight trial recorder extracted from an existing cold-start benchmark. It keeps trial metadata and a timestamped event log, then writes a per-task summary. Record fresh-agent attempts, compile/build and test results, repair attempts, HTTP checks, SQLite checks, browser checks, restart persistence, screenshots, and comparisons between targets.

## Quick start

Requires Node.js 20 or later. No dependencies are needed.

```sh
node scripts/coldstartbench.mjs init ./trials/node-agent-01 setup persistence
node scripts/coldstartbench.mjs record ./trials/node-agent-01 setup task-start
node scripts/coldstartbench.mjs record ./trials/node-agent-01 setup check-attempt "initial validation passed"
node scripts/coldstartbench.mjs record ./trials/node-agent-01 setup task-finish
node scripts/coldstartbench.mjs report ./trials/node-agent-01
```

Add target, agent, model, and setup details to `trial.json` as you collect them. The report is written to `report.json`. Run the same task IDs in separate trial folders to compare targets. Events are operator-recorded from the agent transcript; this tool does not launch or observe an agent, run acceptance checks, or assign a quality score.

See [event schema and recording guidance](docs/event-schema.md) for the event list and evidence conventions.

## Scope

This v0.1 extraction includes the original harness's trial metadata, append-only event recording, per-task event counts, and task timing summary. The BMEC-specific task prompts and compiler scorer were not included. HTTP, database, browser, and restart acceptance remain the responsibility of target-specific checks; record their outcomes and evidence paths in the event details.

Maintainer: Borislav Marinov  
Contact: b.marinov.dev@gmail.com

Acknowledgement: ColdStartBench was extracted from tooling developed during BMEC's AI cold-start validation work and was developed with extensive AI-assisted software engineering.

## License

Apache-2.0. See [LICENSE](LICENSE).

Support: PayPal **@BorislavMarinov785**
