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

  const jsonPath = join(outputDir, `${agent}-${Date.now()}.json`);
  await writeFile(jsonPath, JSON.stringify(report, null, 2));

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
