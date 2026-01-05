---
description: Generate the 8-test evaluation suite for an agent. Provide the agent name as argument.
---

# Create Tests

You generate comprehensive test suites for OpenCode agents, following the 8 essential test categories from Anthropic's 2025 research.

## Test Categories (All 8 Required)

| # | Category | Purpose | Template |
|---|----------|---------|----------|
| 1 | **Planning** | Verify plan-first approach | `planning-approval.yaml` |
| 2 | **Context Loading** | Ensure just-in-time context | `context-before-code.yaml` |
| 3 | **Implementation** | Verify incremental execution | `incremental-impl.yaml` |
| 4 | **Tool Usage** | Check correct tool selection | `correct-tool-selection.yaml` |
| 5 | **Error Handling** | Verify stop-on-failure | `stop-on-failure.yaml` |
| 6 | **Extended Thinking** | Check decomposition | `decomposition.yaml` |
| 7 | **Compaction** | Verify summarization | `summary-long-session.yaml` |
| 8 | **Completion** | Check proper handoff | `proper-handoff.yaml` |

## Process

### Step 1: Load Agent Definition

1. Read `.opencode/registry.json` to get agent metadata
2. Read the agent's markdown file to understand its purpose
3. Identify the agent's tools and responsibilities

### Step 2: Create Test Directory

Create `evals/agents/{agent-name}/` with structure:
```
evals/agents/{agent-name}/
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

### Step 3: Generate Agent-Specific Config

Create `evals/agents/{agent-name}/config/config.yaml`:

```yaml
agent: "{agent-name}"
version: "1.0.0"
description: "Test suite for {agent-name}"

settings:
  timeout_seconds: 120
  model: "sonic-fast"

test_categories:
  - planning
  - context-loading
  - implementation
  - tool-usage
  - error-handling
  - extended-thinking
  - compaction
  - completion

pass_criteria:
  min_tests_passed: 6
  required_categories:
    - planning
    - error-handling
    - completion
```

### Step 4: Generate Tests from Templates

For each of the 8 categories, read the template from `evals/templates/{category}/` and customize it:

1. Replace `{AGENT_NAME}` with the actual agent name
2. Create **realistic test prompts** based on what this agent does
3. Set appropriate **expectations** based on the agent's tools
4. Add **context files** that match real usage scenarios

#### Test Generation Guidelines

**Planning Test**: Create a task that SHOULD require planning first
- For code agents: "Refactor this module to use dependency injection"
- For analysis agents: "Analyze the performance bottlenecks in this system"

**Context Loading Test**: Create a task requiring file reading first
- Use files the agent would typically work with
- Verify agent reads before modifying

**Implementation Test**: Create a multi-step task
- Break into 3-5 logical steps
- Verify incremental progress

**Tool Usage Test**: Create a task with obvious tool requirements
- If agent has `grep`: include search task
- If agent has `edit`: include modification task
- Verify correct tools used, wrong tools avoided

**Error Handling Test**: Create a scenario that will fail
- Invalid file path
- Malformed input
- Impossible task
- Verify agent reports error clearly

**Extended Thinking Test**: Create a complex task
- Use "think hard" trigger phrase
- Require multi-part analysis
- Verify decomposition before action

**Compaction Test**: Simulate long session
- Include session history in context
- Ask for summary
- Verify key points preserved

**Completion Test**: Create a completable task
- Simple, achievable goal
- Verify proper handoff message

### Step 5: Update Registry

Update `.opencode/registry.json` to set `testSuite` path:

```json
"{agent-name}": {
  ...
  "testSuite": "evals/agents/{agent-name}/"
}
```

## Output Summary

After creation, report:
```
Created test suite for: {agent-name}

Directory: evals/agents/{agent-name}/
Tests: 8 (all categories)

Test Files:
- tests/planning/planning-approval-001.yaml
- tests/context-loading/context-before-code-001.yaml
- tests/implementation/incremental-001.yaml
- tests/tool-usage/tool-selection-001.yaml
- tests/error-handling/stop-on-failure-001.yaml
- tests/extended-thinking/decomposition-001.yaml
- tests/compaction/compaction-001.yaml
- tests/completion/handoff-001.yaml

Config: config/config.yaml
Registry: Updated with testSuite path

To run tests (when framework is implemented):
  opencode eval --agent={agent-name}
  opencode eval --agent={agent-name} --category=planning
```

## Quality Checklist

Before finalizing, verify:
- [ ] All 8 test categories have at least one test
- [ ] Test prompts are realistic for this agent's purpose
- [ ] Expectations match the agent's actual capabilities
- [ ] Error handling test will actually trigger an error
- [ ] Context files are realistic examples
- [ ] Registry updated with testSuite path

**agent_name**

$ARGUMENTS
