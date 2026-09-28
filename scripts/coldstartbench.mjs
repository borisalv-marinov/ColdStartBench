#!/usr/bin/env node
import {appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, join} from 'node:path';

const [command, target, ...rest] = process.argv.slice(2);
const eventTypes = [
  'task-start', 'task-finish', 'check-attempt', 'build-attempt', 'test-attempt',
  'test-success', 'http-check', 'sqlite-check', 'browser-check', 'restart-check',
  'screenshot', 'repair-iteration', 'manual-intervention'
];
const fail = message => { console.error(message); process.exit(1); };
const save = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

if (command === 'init') {
  if (!target || rest.length === 0) fail('Usage: node scripts/coldstartbench.mjs init TRIAL_DIRECTORY TASK_ID [TASK_ID ...]');
  const trial = resolve(target);
  if (existsSync(trial)) fail(`Trial directory already exists: ${trial}`);
  mkdirSync(trial, {recursive: true});
  save(join(trial, 'trial.json'), {
    schemaVersion: 'coldstartbench.trial.v1',
    trialId: trial.split(/[\\/]/).at(-1),
    createdAt: new Date().toISOString(),
    provenance: {target: null, agent: null, model: null, modelVersion: null, systemPrompt: null, toolSetup: null},
    tasks: rest.map(id => ({id}))
  });
  console.log(JSON.stringify({ok: true, trial, tasks: rest.length}));
} else if (command === 'record') {
  const [taskId, type, ...detail] = rest;
  const trial = target && resolve(target);
  const metadataPath = trial && join(trial, 'trial.json');
  if (!trial || !existsSync(metadataPath) || !taskId || !eventTypes.includes(type)) {
    fail(`Usage: node scripts/coldstartbench.mjs record TRIAL_DIRECTORY TASK_ID ${eventTypes.join('|')} [detail]`);
  }
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
  if (!metadata.tasks.some(task => task.id === taskId)) fail(`Unknown task ID: ${taskId}`);
  appendFileSync(join(trial, 'events.jsonl'), `${JSON.stringify({timestamp: new Date().toISOString(), taskId, type, detail: detail.join(' ')})}\n`);
  console.log(JSON.stringify({ok: true, taskId, type}));
} else if (command === 'report') {
  if (!target) fail('Usage: node scripts/coldstartbench.mjs report TRIAL_DIRECTORY');
  const trial = resolve(target);
  const metadata = JSON.parse(readFileSync(join(trial, 'trial.json'), 'utf8'));
  const eventsFile = join(trial, 'events.jsonl');
  const events = existsSync(eventsFile) ? readFileSync(eventsFile, 'utf8').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)) : [];
  const metricsByTask = Object.fromEntries(metadata.tasks.map(({id}) => [id, Object.fromEntries(eventTypes.map(type => [type, events.filter(event => event.taskId === id && event.type === type).length]))]));
  const taskElapsedSeconds = Object.fromEntries(metadata.tasks.map(({id}) => {
    const taskEvents = events.filter(event => event.taskId === id);
    const started = taskEvents.find(event => event.type === 'task-start');
    const finished = [...taskEvents].reverse().find(event => event.type === 'task-finish');
    return [id, started && finished ? Math.max(0, (Date.parse(finished.timestamp) - Date.parse(started.timestamp)) / 1000) : null];
  }));
  const metrics = Object.fromEntries(eventTypes.map(type => [type, events.filter(event => event.type === type).length]));
  const report = {schemaVersion: 'coldstartbench.report.v1', trialId: metadata.trialId, provenance: metadata.provenance, createdAt: metadata.createdAt, reportedAt: new Date().toISOString(), taskCount: metadata.tasks.length, eventCount: events.length, metrics, metricsByTask, taskElapsedSeconds, events};
  save(join(trial, 'report.json'), report);
  console.log(JSON.stringify(report, null, 2));
} else {
  fail('Usage: node scripts/coldstartbench.mjs <init|record|report> ...');
}
