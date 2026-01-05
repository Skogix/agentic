---
date: 2026-01-05T20:31:41+01:00
git_commit: not-a-git-repo
branch: local
repository: agentic
topic: "Agent Creation System - Framework Analysis"
tags: [research, agents, framework, opencode, eval, registry]
last_updated: 2026-01-05
---

## Ticket Synopsis

Analyze the existing small agent framework to identify a solid foundation for building a comprehensive Agent Creation System. The ticket identifies several gaps:
1. Current agents are ~100-200 lines (not minimal ~500 tokens as recommended)
2. No eval framework exists for testing agents
3. Simple agentic.json exists but no full agent registry
4. Agents are manually created as static markdown files
5. Good patterns already present: tool whitelists, structured outputs, "What NOT to Do" sections

## Summary

**The existing framework is MORE developed than the ticket suggests.** A comprehensive foundation already exists with:

1. **Full Registry System** (`.opencode/registry.json`) - Complete agent registry with schema validation, status tracking, categories, and metrics placeholders
2. **Agent Templates** - Both minimal and full templates for agent creation
3. **Eval Framework Skeleton** - Test schema, config, and 6 test templates covering 8 category types
4. **Create-Agent Command** - Already exists with detailed guidance for agent generation
5. **6 Working Agents** - All following consistent patterns with clear tool whitelists

**Key finding**: The framework exists but is incomplete and underutilized. The path forward is refinement and connection, not creation from scratch.

## Detailed Findings

### 1. Registry System (STRONG FOUNDATION)

**Location**: `.opencode/registry.json` (147 lines) + `.opencode/registry.schema.json` (125 lines)

**What exists**:
- JSON Schema validation for registry entries
- Agent entries with: file path, category, status, description, version, tools array, testSuite pointer, metrics object
- Command entries for workflow commands
- Category definitions (core, development, content, workflow, git)
- Status lifecycle definitions (draft → experimental → stable → legacy → deprecated)

**Agent Registry Structure** (`.opencode/registry.json:6-83`):
```json
"{agent-name}": {
  "file": "agent/{name}.md",
  "category": "core",
  "status": "legacy",  // All 6 agents marked legacy
  "description": "...",
  "version": "0.1.0",
  "tools": ["read", "grep", "glob", "list"],
  "testSuite": null,  // Not yet connected
  "metrics": {
    "avgTokens": null,
    "successRate": null
  }
}
```

**Schema Validation** (`.opencode/registry.schema.json:45-93`):
- Enforces required fields: file, category, status, description, version, tools
- Validates tool enum: read, write, edit, bash, grep, glob, list, webfetch, todoread, todowrite, patch, task
- Validates status enum: draft, experimental, stable, legacy, deprecated
- Validates category enum: core, development, content

**Gap**: Metrics are placeholders (null values). No mechanism to populate them automatically.

### 2. Agent Templates (MINIMAL + FULL)

**Minimal Template** (`.opencode/templates/agent-minimal.md`):
- 48 lines with YAML frontmatter
- Target: ~500 tokens
- Structure: Role description, 4-step Approach, 4 Heuristics, Output format, Example

**Full Template** (`.opencode/templates/agent-full.md`):
- 73 lines with XML-style sections
- Includes: role, approach, heuristics, tools table, output, examples, constraints

**Template frontmatter structure**:
```yaml
---
description: "{ONE_LINE_PURPOSE}"
mode: subagent
model: sonic-fast
temperature: 0.1
tools:
  read: {true/false}
  # ... all tools listed
---
```

### 3. Existing Agents (6 AGENTS - ALL LEGACY)

| Agent | Lines | Read | Write | Category | Status |
|-------|-------|------|-------|----------|--------|
| codebase-analyzer | 134 | ✓ | ✗ | core | legacy |
| codebase-locator | 118 | ✗ | ✗ | core | legacy |
| codebase-pattern-finder | 220 | ✓ | ✗ | core | legacy |
| thoughts-locator | 121 | ✓ | ✗ | core | legacy |
| thoughts-analyzer | 158 | ✓ | ✗ | core | legacy |
| web-search-researcher | 126 | ✓ | ✗ | core | draft |

**Common Patterns Found**:
1. **Consistent frontmatter** - All use same YAML structure
2. **Clear tool permissions** - Explicit true/false for each tool
3. **Role descriptions** - "You are a specialist at..." pattern
4. **Structured sections**: Core Responsibilities → Strategy/Steps → Output Format → Guidelines → What NOT to Do
5. **No write permissions** - All agents are read-only (safety pattern)

**Token Analysis** (estimated):
- codebase-locator: ~1,100 tokens (smallest)
- codebase-pattern-finder: ~2,000 tokens (largest)
- Average: ~1,500 tokens per agent

**Gap**: All agents exceed the 500-token target. Most are 2-4x larger than recommended.

### 4. Eval Framework (SKELETON EXISTS)

**Framework Config** (`.opencode/evals/framework/config.yaml`):
```yaml
version: "1.0.0"
categories:
  - planning (weight: 1.0)
  - context-loading (weight: 1.0)
  - implementation (weight: 1.5)
  - tool-usage (weight: 1.0)
  - error-handling (weight: 1.5)
  - extended-thinking (weight: 0.8)
  - compaction (weight: 0.5)
  - completion (weight: 1.0)

thresholds:
  min_success_rate: 0.8
  max_avg_tokens: 50000
  max_avg_time_seconds: 60
```

**Test Schema** (`.opencode/evals/framework/test-schema.yaml`):
- Full JSON Schema for test definitions
- Required fields: id, name, category, agent, input (prompt, context, setup), expectations
- Expectations support: success, output_contains, output_not_contains, tools_used, tools_not_used, max_tokens, max_tool_calls, pattern_match

**Test Templates** (6 templates covering core categories):
1. `planning/planning-approval.yaml` - Verify plan before implementation
2. `context-loading/context-before-code.yaml` - Verify context loading
3. `implementation/incremental-impl.yaml` - Verify step-by-step changes
4. `tool-usage/correct-tool-selection.yaml` - Verify tool selection
5. `error-handling/stop-on-failure.yaml` - Verify error handling
6. `extended-thinking/decomposition.yaml` - Verify task decomposition

**Gap**: Templates use placeholders (`{AGENT_NAME}`, `{TASK_PROMPT}`). No actual test cases exist. No test runner implemented.

### 5. Create-Agent Command (EXISTS)

**Location**: `.opencode/command/create-agent.md` (174 lines)

**What it does**:
1. Gathers requirements (name, purpose, category, tools, read-only?)
2. Defines behavior (approach, heuristics, output format, example)
3. Generates agent file from minimal template
4. Updates registry.json
5. Creates optional project context file
6. Offers test suite generation (`/create-tests {agent-name}`)

**Key features**:
- ~500 token target explicitly stated
- Quality checklist included
- Anti-patterns documented
- Registry update format specified

**Gap**: `/create-tests` command referenced but doesn't exist yet.

### 6. Command System (7 COMMANDS)

| Command | Category | Description |
|---------|----------|-------------|
| execute | workflow | Execute implementation plan |
| plan | workflow | Create plan from ticket + research |
| research | workflow | Research ticket or ad-hoc query |
| ticket | workflow | Create structured ticket |
| commit | git | Atomic commits |
| review | workflow | Review commit vs plan |
| create-agent | meta | Generate new agents |

**Pattern**: Commands use YAML frontmatter with description, then markdown content. Arguments via `$ARGUMENTS` placeholder.

### 7. agentic.json vs registry.json

**agentic.json** (`.opencode/agentic.json`):
```json
{
  "thoughts": "thoughts",
  "agents": {
    "model": "sonic-fast"
  }
}
```

This is a **minimal config file**, not the registry. The registry is in `registry.json`.

## Code References

- `.opencode/registry.json:1-146` - Full agent registry with 6 agents, 6 commands
- `.opencode/registry.schema.json:1-124` - JSON Schema for registry validation
- `.opencode/templates/agent-minimal.md:1-48` - Minimal agent template
- `.opencode/templates/agent-full.md:1-73` - Full agent template with XML sections
- `.opencode/command/create-agent.md:1-174` - Create agent command
- `.opencode/agent/*.md` - 6 existing agents
- `evals/framework/config.yaml:1-80` - Eval framework configuration
- `evals/framework/test-schema.yaml:1-107` - Test definition schema
- `evals/templates/` - 6 test templates

## Architecture Insights

### Existing Design Patterns

1. **Separation of Concerns**
   - Registry (metadata) separate from agents (behavior)
   - Schema (validation) separate from data
   - Templates (structure) separate from instances

2. **Explicit Tool Whitelisting**
   - Every agent explicitly lists tools with true/false
   - Prevents tool sprawl and security issues
   - Easy to audit permissions

3. **Status Lifecycle**
   - draft → experimental → stable → legacy → deprecated
   - All current agents are "legacy" (need refactoring)
   - One is "draft" (web-search-researcher - incomplete)

4. **Read-Only Agents**
   - All analysis agents have write: false
   - Safety-first design
   - Commands handle mutations

5. **Category System**
   - core: Navigation and analysis (codebase-*, thoughts-*)
   - development: Task execution (not yet populated)
   - content: Documentation (not yet populated)

### Missing Connections

1. **Registry → Test Suite**: `testSuite` field exists but all are null
2. **Registry → Metrics**: `metrics` field exists but not populated
3. **Create-Agent → Tests**: References `/create-tests` which doesn't exist
4. **Eval Framework → Runner**: Schema and config exist but no runner

## Solid Foundation for Building Upon

### Ready-to-Use Components

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Registry Schema | ✅ Complete | None |
| Registry Data | ✅ Complete | Update as agents change |
| Agent Templates | ✅ Complete | Use as-is |
| Create-Agent Command | ✅ Complete | Test and refine |
| Eval Schema | ✅ Complete | None |
| Eval Config | ✅ Complete | Tune thresholds |

### Needs Implementation

| Component | Priority | Effort |
|-----------|----------|--------|
| /create-tests command | High | Medium |
| Eval runner | High | High |
| Agent metrics collection | Medium | Medium |
| Agent refactoring to ~500 tokens | Medium | Low per agent |
| Missing category agents (development, content) | Low | High |

### Recommended Implementation Order

1. **Create `/create-tests` command** - Uses existing test templates to generate agent-specific test cases
2. **Build basic eval runner** - Execute tests, capture metrics, generate reports
3. **Connect registry to tests** - Update `testSuite` field when tests are generated
4. **Add metrics collection** - Populate `avgTokens` and `successRate` from eval runs
5. **Refactor legacy agents** - Apply minimal prompt pattern (one at a time)

## Open Questions

1. **Test execution environment**: How will tests be run? OpenCode API? Direct model calls?
2. **Metrics storage**: Should metrics be in registry.json or separate file?
3. **Agent versioning**: How to handle breaking changes to agents?
4. **Template selection**: When to use minimal vs full template?
5. **Context file pattern**: What goes in `.opencode/context/` vs agent prompt?

## Conclusion

The framework has a **strong foundation** that exceeds initial expectations. The architecture is sound:
- Clear separation of concerns
- Explicit tool permissions
- Status lifecycle for maturity tracking
- Schema validation for data integrity
- Test framework skeleton ready

**The bottleneck is not architecture but execution**: implementing the test runner, creating the `/create-tests` command, and systematically refactoring agents to the minimal pattern.

The recommended approach is **incremental enhancement** rather than rebuild:
1. Implement missing commands
2. Build the eval runner
3. Refactor agents one-by-one
4. Collect metrics and iterate
