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
