# Using ColdStartBench in an evaluation

Give each fresh agent the same task, public documentation and package surface, and a clean trial folder. Keep attempts isolated. Run target-specific build, HTTP, database, browser, and restart checks outside ColdStartBench, then record their observed outcomes and evidence paths. Do not count an agent's description of a passing check as verification.

Copy this prompt into the evaluator's instructions:

> You are evaluating an AI coding agent with ColdStartBench. Read AGENTS.md and README.md first. Do not infer acceptance success from model claims; record externally verified evidence.

Initialize a folder with stable task IDs, record task start and finish plus relevant checks, then generate the report. For fair comparisons, use identical acceptance criteria and preserve every attempt, including incomplete ones.
