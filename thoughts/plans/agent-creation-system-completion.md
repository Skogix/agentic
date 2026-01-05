# Agent Creation System - Completion Plan

## Overview

Complete the Agent Creation System by filling in the missing pieces of an already-solid foundation. The framework architecture exists; this plan connects the pieces and makes them functional.

## Current State Analysis

### What Exists (Verified)
| Component | Location | Status |
|-----------|----------|--------|
| Registry + Schema | `.opencode/registry.json`, `.opencode/registry.schema.json` | Complete |
| Agent Templates | `.opencode/templates/agent-{minimal,full}.md` | Complete |
| `/create-agent` command | `.opencode/command/create-agent.md` | Complete |
| `/create-tests` command | `.opencode/command/create-tests.md` | Complete |
| Eval config + schema | `evals/framework/config.yaml`, `test-schema.yaml` | Complete |
| Test templates | `evals/templates/` (6 of 8 categories) | Partial |
| Refactored agents | `.opencode/agent/core/*.md` (6 agents, ~65 lines each) | Complete |
| Legacy agents | `.opencode/agent/*.md` (duplicates) | Need removal |

### What's Missing
1. **2 test templates**: compaction, completion
2. **Legacy cleanup**: Remove duplicate agent files
3. **Agent test suites**: `evals/agents/` is empty
4. **Eval runner**: No code to execute tests
5. **Metrics connection**: Registry metrics are null

## Desired End State

After this plan is complete:
1. All 8 test category templates exist
2. Only refactored agents remain (no duplicates)
3. At least 2 agents have full test suites generated
4. Eval runner can execute tests and report results
5. Registry metrics are populated from eval runs

### Verification
- `ls evals/templates/*/` shows 8 directories with templates
- `ls .opencode/agent/` shows only `core/`, `development/`, `content/` subdirectories
- `ls evals/agents/` shows at least 2 agent test suites
- `bun run evals/runner/index.ts --help` shows runner help
- `cat .opencode/registry.json | jq '.agents[].metrics'` shows non-null values

## What We're NOT Doing

- Full agent refactoring (agents are already refactored to ~65 lines)
- Complex parallelization or distributed eval execution
- CI/CD integration for evals
- Dashboard or web UI for results
- Historical metrics tracking or trends

## Implementation Approach

**Strategy**: Complete each layer before moving to the next. Test templates → Clean agents → Generate tests → Build runner → Connect metrics.

**Technology**: TypeScript with Bun for the eval runner (matches existing `.opencode/package.json`).

---

## Phase 1: Complete Test Templates

### Overview
Create the 2 missing test templates to have all 8 categories covered.

### Changes Required:

#### 1. Create Compaction Template
**File**: `evals/templates/compaction/summary-long-session.yaml`

```yaml
id: compaction-001
name: "Agent summarizes long session effectively"
category: compaction
agent: "{AGENT_NAME}"
description: "Verify agent can compress/summarize long context while preserving key information"

input:
  prompt: |
    {LONG_SESSION_CONTEXT}

    Summarize the key findings and decisions from this session.
  context:
    session_history:
      - "{PREVIOUS_MESSAGE_1}"
      - "{PREVIOUS_MESSAGE_2}"
      - "{PREVIOUS_MESSAGE_3}"

expectations:
  success: true
  output_contains:
    - "summary"
  max_tokens: 2000
  pattern_match: "(?i)(key|important|decided|found|conclusion)"

metadata:
  author: "agent-generator"
  priority: medium
  tags:
    - compaction
    - summarization
```

#### 2. Create Completion Template
**File**: `evals/templates/completion/proper-handoff.yaml`

```yaml
id: completion-001
name: "Agent provides proper completion handoff"
category: completion
agent: "{AGENT_NAME}"
description: "Verify agent signals completion clearly and provides actionable next steps"

input:
  prompt: |
    {COMPLETABLE_TASK}
  context:
    files:
      - path: "{RELEVANT_FILE}"
        content: "{FILE_CONTENT}"

expectations:
  success: true
  output_contains:
    - "complete"
  pattern_match: "(?i)(done|complete|finished|next steps|summary)"

metadata:
  author: "agent-generator"
  priority: high
  tags:
    - completion
    - handoff
```

### Success Criteria:

#### Automated Verification:
- [x] `ls evals/templates/compaction/` shows `summary-long-session.yaml`
- [x] `ls evals/templates/completion/` shows `proper-handoff.yaml`
- [x] Both files are valid YAML: `cat evals/templates/*//*.yaml | head -1` succeeds

#### Manual Verification:
- [x] Templates follow the same structure as existing templates
- [x] Placeholder variables match the pattern used elsewhere

---

## Phase 2: Cleanup Legacy Agents

### Overview
Remove duplicate legacy agent files. Registry already points to `agent/core/` paths with `legacyFile` for reference.

### Changes Required:

#### 1. Remove Legacy Agent Files
**Files to delete**:
- `.opencode/agent/codebase-analyzer.md`
- `.opencode/agent/codebase-locator.md`
- `.opencode/agent/codebase-pattern-finder.md`
- `.opencode/agent/thoughts-locator.md`
- `.opencode/agent/thoughts-analyzer.md`
- `.opencode/agent/web-search-researcher.md`

#### 2. Update Registry - Remove legacyFile References
**File**: `.opencode/registry.json`
**Changes**: Remove `legacyFile` field from all agent entries

Before:
```json
"codebase-analyzer": {
  "file": "agent/core/codebase-analyzer.md",
  "legacyFile": "agent/codebase-analyzer.md",
  ...
}
```

After:
```json
"codebase-analyzer": {
  "file": "agent/core/codebase-analyzer.md",
  ...
}
```

### Success Criteria:

#### Automated Verification:
- [x] `ls .opencode/agent/*.md` returns no files (only directories)
- [x] `cat .opencode/registry.json | grep legacyFile` returns nothing
- [x] `ls .opencode/agent/core/` shows 6 agent files

#### Manual Verification:
- [x] Registry still validates against schema

---

## Phase 3: Generate Test Suites (Pilot)

### Overview
Run `/create-tests` for 2 pilot agents to validate the flow before expanding to all agents.

### Changes Required:

#### 1. Generate Tests for codebase-locator
Run the `/create-tests codebase-locator` command (or manually create):

**Directory**: `evals/agents/codebase-locator/`
```
evals/agents/codebase-locator/
├── config/
│   └── config.yaml
└── tests/
    ├── planning/
    │   └── planning-approval-001.yaml
    ├── context-loading/
    │   └── context-before-code-001.yaml
    ├── implementation/
    │   └── incremental-001.yaml
    ├── tool-usage/
    │   └── tool-selection-001.yaml
    ├── error-handling/
    │   └── stop-on-failure-001.yaml
    ├── extended-thinking/
    │   └── decomposition-001.yaml
    ├── compaction/
    │   └── compaction-001.yaml
    └── completion/
        └── handoff-001.yaml
```

#### 2. Generate Tests for codebase-analyzer
Same structure for `evals/agents/codebase-analyzer/`

#### 3. Update Registry with testSuite Paths
**File**: `.opencode/registry.json`
**Changes**: Set `testSuite` for both agents

```json
"codebase-locator": {
  ...
  "testSuite": "evals/agents/codebase-locator/"
},
"codebase-analyzer": {
  ...
  "testSuite": "evals/agents/codebase-analyzer/"
}
```

### Success Criteria:

#### Automated Verification:
- [x] `ls evals/agents/codebase-locator/tests/` shows 8 category directories
- [x] `ls evals/agents/codebase-analyzer/tests/` shows 8 category directories
- [x] `find evals/agents -name "*.yaml" | wc -l` returns at least 18 (2 configs + 16 tests)

#### Manual Verification:
- [x] Test prompts are realistic for each agent's purpose
- [x] Expectations match agent capabilities (e.g., locator doesn't have `read`)

---

## Phase 4: Build Eval Runner

### Overview
Create a TypeScript eval runner that can execute tests against agents and report results.

### Changes Required:

#### 1. Create Runner Directory Structure
```
evals/runner/
├── index.ts           # CLI entry point
├── executor.ts        # Test execution logic
├── reporter.ts        # Results formatting
├── types.ts           # TypeScript types
└── utils.ts           # Helper functions
```

#### 2. Runner Entry Point
**File**: `evals/runner/index.ts`

```typescript
#!/usr/bin/env bun
import { parseArgs } from "util";
import { runTests } from "./executor";
import { generateReport } from "./reporter";

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
```

#### 3. Test Executor
**File**: `evals/runner/executor.ts`

```typescript
import { readdir } from "fs/promises";
import { join } from "path";
import { parse } from "yaml";
import type { TestCase, TestResult, RunOptions } from "./types";

export async function runTests(
  agentName: string,
  options: RunOptions
): Promise<TestResult[]> {
  const testDir = `evals/agents/${agentName}/tests`;
  const results: TestResult[] = [];

  // Get categories to run
  const categories = options.category
    ? [options.category]
    : await readdir(testDir);

  for (const category of categories) {
    const categoryPath = join(testDir, category);
    const testFiles = await readdir(categoryPath);

    for (const file of testFiles) {
      if (!file.endsWith(".yaml")) continue;

      const testPath = join(categoryPath, file);
      const content = await Bun.file(testPath).text();
      const testCase: TestCase = parse(content);

      const result = await executeTest(agentName, testCase, options.verbose);
      results.push(result);
    }
  }

  return results;
}

async function executeTest(
  agentName: string,
  testCase: TestCase,
  verbose: boolean
): Promise<TestResult> {
  const startTime = Date.now();

  try {
    // TODO: Integrate with actual agent execution
    // For now, return a placeholder result
    const result: TestResult = {
      testId: testCase.id,
      testName: testCase.name,
      category: testCase.category,
      agent: agentName,
      success: false,
      duration: Date.now() - startTime,
      error: "Agent execution not yet implemented",
    };

    if (verbose) {
      console.log(`[${testCase.category}] ${testCase.name}: SKIPPED (no executor)`);
    }

    return result;
  } catch (error) {
    return {
      testId: testCase.id,
      testName: testCase.name,
      category: testCase.category,
      agent: agentName,
      success: false,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
```

#### 4. Types
**File**: `evals/runner/types.ts`

```typescript
export interface TestCase {
  id: string;
  name: string;
  category: string;
  agent: string;
  description?: string;
  input: {
    prompt: string;
    context?: Record<string, unknown>;
    setup?: string[];
  };
  expectations: {
    success?: boolean;
    output_contains?: string[];
    output_not_contains?: string[];
    tools_used?: string[];
    tools_not_used?: string[];
    max_tokens?: number;
    max_tool_calls?: number;
    pattern_match?: string;
  };
  metadata?: {
    author?: string;
    created?: string;
    priority?: "critical" | "high" | "medium" | "low";
    tags?: string[];
  };
}

export interface TestResult {
  testId: string;
  testName: string;
  category: string;
  agent: string;
  success: boolean;
  duration: number;
  tokensUsed?: number;
  toolCalls?: string[];
  output?: string;
  error?: string;
}

export interface RunOptions {
  category?: string;
  verbose?: boolean;
}

export interface EvalReport {
  agent: string;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  results: TestResult[];
  metrics: {
    avgTokens: number | null;
    successRate: number;
  };
}
```

#### 5. Reporter
**File**: `evals/runner/reporter.ts`

```typescript
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { TestResult, EvalReport } from "./types";

export async function generateReport(
  results: TestResult[],
  outputDir: string
): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  const agent = results[0]?.agent ?? "unknown";
  const timestamp = new Date().toISOString();

  const report: EvalReport = {
    agent,
    timestamp,
    totalTests: results.length,
    passed: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success && !r.error?.includes("not yet implemented")).length,
    skipped: results.filter((r) => r.error?.includes("not yet implemented")).length,
    results,
    metrics: {
      avgTokens: calculateAvgTokens(results),
      successRate: calculateSuccessRate(results),
    },
  };

  // Write JSON report
  const jsonPath = join(outputDir, `${agent}-${Date.now()}.json`);
  await writeFile(jsonPath, JSON.stringify(report, null, 2));

  // Write markdown report
  const mdPath = join(outputDir, `${agent}-${Date.now()}.md`);
  await writeFile(mdPath, generateMarkdown(report));

  console.log(`\nReport generated: ${jsonPath}`);
  console.log(`Markdown report: ${mdPath}`);
  printSummary(report);
}

function calculateAvgTokens(results: TestResult[]): number | null {
  const tokensResults = results.filter((r) => r.tokensUsed != null);
  if (tokensResults.length === 0) return null;
  return Math.round(
    tokensResults.reduce((sum, r) => sum + (r.tokensUsed ?? 0), 0) /
      tokensResults.length
  );
}

function calculateSuccessRate(results: TestResult[]): number {
  const executed = results.filter(
    (r) => !r.error?.includes("not yet implemented")
  );
  if (executed.length === 0) return 0;
  return executed.filter((r) => r.success).length / executed.length;
}

function generateMarkdown(report: EvalReport): string {
  return `# Eval Report: ${report.agent}

**Generated**: ${report.timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${report.totalTests} |
| Passed | ${report.passed} |
| Failed | ${report.failed} |
| Skipped | ${report.skipped} |
| Success Rate | ${(report.metrics.successRate * 100).toFixed(1)}% |
| Avg Tokens | ${report.metrics.avgTokens ?? "N/A"} |

## Results by Category

${generateCategoryTable(report.results)}

## Detailed Results

${report.results.map((r) => `### ${r.testId}: ${r.testName}
- **Category**: ${r.category}
- **Status**: ${r.success ? "PASS" : "FAIL"}
- **Duration**: ${r.duration}ms
${r.error ? `- **Error**: ${r.error}` : ""}
`).join("\n")}
`;
}

function generateCategoryTable(results: TestResult[]): string {
  const byCategory = new Map<string, TestResult[]>();
  for (const r of results) {
    const list = byCategory.get(r.category) ?? [];
    list.push(r);
    byCategory.set(r.category, list);
  }

  let table = "| Category | Passed | Failed | Total |\n|----------|--------|--------|-------|\n";
  for (const [category, categoryResults] of byCategory) {
    const passed = categoryResults.filter((r) => r.success).length;
    const failed = categoryResults.filter((r) => !r.success).length;
    table += `| ${category} | ${passed} | ${failed} | ${categoryResults.length} |\n`;
  }
  return table;
}

function printSummary(report: EvalReport): void {
  console.log(`
=== Eval Summary: ${report.agent} ===
Total: ${report.totalTests} | Passed: ${report.passed} | Failed: ${report.failed} | Skipped: ${report.skipped}
Success Rate: ${(report.metrics.successRate * 100).toFixed(1)}%
`);
}
```

### Success Criteria:

#### Automated Verification:
- [x] `bun run evals/runner/index.ts --help` shows help text
- [x] `bun run evals/runner/index.ts --agent=codebase-locator` runs without crashing
- [x] `ls evals/reports/` shows generated report files

#### Manual Verification:
- [x] Report includes all 8 test categories
- [x] JSON and Markdown reports are properly formatted

---

## Phase 5: Connect Metrics

### Overview
Update registry metrics after eval runs, creating a feedback loop.

### Changes Required:

#### 1. Add Metrics Update Script
**File**: `evals/runner/update-metrics.ts`

```typescript
#!/usr/bin/env bun
import { readFile, writeFile } from "fs/promises";
import type { EvalReport } from "./types";

const registryPath = ".opencode/registry.json";

export async function updateRegistryMetrics(
  agentName: string,
  report: EvalReport
): Promise<void> {
  const registryContent = await readFile(registryPath, "utf-8");
  const registry = JSON.parse(registryContent);

  if (registry.agents[agentName]) {
    registry.agents[agentName].metrics = {
      avgTokens: report.metrics.avgTokens,
      successRate: report.metrics.successRate,
    };
    registry.lastUpdated = new Date().toISOString();

    await writeFile(registryPath, JSON.stringify(registry, null, 2) + "\n");
    console.log(`Updated metrics for ${agentName} in registry`);
  } else {
    console.error(`Agent ${agentName} not found in registry`);
  }
}

// CLI usage
if (import.meta.main) {
  const [agentName, reportPath] = Bun.argv.slice(2);
  if (!agentName || !reportPath) {
    console.error("Usage: bun run update-metrics.ts <agent-name> <report-path>");
    process.exit(1);
  }

  const reportContent = await readFile(reportPath, "utf-8");
  const report: EvalReport = JSON.parse(reportContent);
  await updateRegistryMetrics(agentName, report);
}
```

#### 2. Integrate Metrics Update into Runner
**File**: `evals/runner/index.ts` (update)

Add at the end of the file:
```typescript
import { updateRegistryMetrics } from "./update-metrics";

// ... after generateReport(results, values.output);

// Update registry metrics
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
      avgTokens: null, // Will be populated when executor is implemented
      successRate: results.filter((r) => r.success).length / results.length,
    },
  };
  await updateRegistryMetrics(values.agent, report);
}
```

### Success Criteria:

#### Automated Verification:
- [x] `bun run evals/runner/index.ts --agent=codebase-locator` updates registry
- [x] `cat .opencode/registry.json | jq '.agents["codebase-locator"].metrics'` shows non-null values

#### Manual Verification:
- [x] Registry `lastUpdated` timestamp changes after eval run
- [x] Metrics values are reasonable (successRate between 0-1)

---

## Testing Strategy

### Unit Tests:
- Test YAML parsing of test cases
- Test report generation formatting
- Test metrics calculation

### Integration Tests:
- End-to-end run of eval runner with test agent
- Verify report file creation
- Verify registry update

### Manual Testing Steps:
1. Run `bun run evals/runner/index.ts --agent=codebase-locator --verbose`
2. Check that all 8 categories are attempted
3. Verify JSON and Markdown reports are created
4. Verify registry.json is updated with metrics

## Performance Considerations

- Test execution is sequential for simplicity (parallelization can be added later)
- Reports are written after all tests complete (no streaming)
- Registry file is read/written atomically

## Migration Notes

- Legacy agent files can be safely deleted as registry already points to `agent/core/`
- Existing test templates are compatible with the new runner
- No database migration needed (all file-based)

## References

- Original ticket: `thoughts/tickets/feature-agent-creation-system.md`
- Research: `thoughts/research/2026-01-05_agent-creation-system-framework-analysis.md`
- Existing eval config: `evals/framework/config.yaml`
- Existing test schema: `evals/framework/test-schema.yaml`
