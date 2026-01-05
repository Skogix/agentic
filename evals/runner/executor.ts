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
  verbose?: boolean
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
