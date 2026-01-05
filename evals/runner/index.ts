#!/usr/bin/env bun
import { parseArgs } from "util";
import { runTests } from "./executor";
import { generateReport } from "./reporter";
import { updateRegistryMetrics } from "./update-metrics";
import type { EvalReport } from "./types";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    agent: { type: "string", short: "a" },
    category: { type: "string", short: "c" },
    verbose: { type: "boolean", short: "v", default: false },
    output: { type: "string", short: "o", default: "evals/reports" },
    help: { type: "boolean", short: "h" },
  },
});

if (values.help) {
  console.log(`
OpenCode Agent Eval Runner

Usage:
  bun run evals/runner/index.ts --agent=<name> [options]

Options:
  -a, --agent <name>     Agent to test (required)
  -c, --category <cat>   Run only specific category
  -v, --verbose          Show detailed output
  -o, --output <dir>     Report output directory
  -h, --help             Show this help
`);
  process.exit(0);
}

if (!values.agent) {
  console.error("Error: --agent is required");
  process.exit(1);
}

const results = await runTests(values.agent, {
  category: values.category,
  verbose: values.verbose,
});

await generateReport(results, values.output);

if (results.length > 0) {
  const report: EvalReport = {
    agent: values.agent,
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passed: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    skipped: 0,
    results,
    metrics: {
      avgTokens: null,
      successRate: results.filter((r) => r.success).length / results.length,
    },
  };
  await updateRegistryMetrics(values.agent, report);
}
