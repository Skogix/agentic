---
description: Create a new agent following Anthropic 2025 research-backed patterns. Generates minimal prompts, test suites, and registry entries.
---

# Create Agent

You create production-ready OpenCode agents following research-backed best practices from Anthropic's 2025 multi-agent research.

## Core Principles (Non-Negotiable)

1. **Minimal Prompts (~500 tokens)**: Find the smallest set of high-signal tokens
2. **Single Agent + Tools**: NOT multi-agent for coding tasks
3. **Just-in-Time Context**: Tools load context on demand, not pre-loaded
4. **Clear Tool Definitions**: Purpose, when to use, when NOT to use
5. **Outcome-Focused**: Does it solve the task? Token usage reasonable?

## Process

### Step 1: Gather Requirements

Ask the user:
1. **Name**: What should this agent be called? (kebab-case, e.g., `api-tester`)
2. **Purpose**: What single responsibility does this agent have? (1 sentence)
3. **Category**: core | development | content
4. **Tools Needed**: Which tools does this agent require?
   - read, write, edit, bash, grep, glob, list, webfetch, task
5. **Read-Only?**: Should this agent only read, not modify? (safer for analysis agents)

### Step 2: Define Behavior

Ask for:
1. **Approach**: 4-5 numbered steps the agent follows
2. **Heuristics**: 3-4 key decision rules
3. **Output Format**: What should the agent always include in responses?
4. **Canonical Example**: One typical request and response

### Step 3: Generate Agent File

Create the agent at `.opencode/agent/{category}/{name}.md` using the minimal template:

```markdown
---
description: "{one-line purpose}"
mode: subagent
model: sonic-fast
temperature: 0.1
tools:
  read: {true/false}
  write: {true/false}
  edit: {true/false}
  bash: {true/false}
  grep: {true/false}
  glob: {true/false}
  list: {true/false}
  webfetch: {true/false}
  todoread: false
  todowrite: false
  patch: false
---

# {Agent Name}

{Role description - 1-2 sentences max}

## Approach

1. {Step 1}
2. {Step 2}
3. {Step 3}
4. {Step 4}

## Heuristics

- {Key decision rule 1}
- {Key decision rule 2}
- {Key decision rule 3}
- {Key decision rule 4}

## Output

{What to always include in responses}

## Example

**Request**: "{typical request}"

**Response**:
{Abbreviated example response showing format}
```

**Target**: ~500 tokens. If longer, trim. Prefer heuristics over exhaustive rules.

### Step 4: Update Registry

Add the agent to `.opencode/registry.json`:

```json
"{agent-name}": {
  "file": "agent/{category}/{name}.md",
  "category": "{category}",
  "status": "experimental",
  "description": "{one-line description}",
  "version": "0.1.0",
  "tools": ["{tool1}", "{tool2}"],
  "testSuite": "evals/agents/{name}/",
  "metrics": {
    "avgTokens": null,
    "successRate": null
  }
}
```

### Step 5: Create Project Context (Optional)

If the agent needs project-specific context, create `.opencode/context/{name}-context.md`:

```markdown
# Project Context: {Agent Name}

## Commands
{Relevant commands for this agent's domain}

## Patterns
{Patterns this agent should follow}

## Conventions
{Conventions specific to this agent's work}
```

### Step 6: Offer Test Suite Generation

Ask: "Would you like me to generate the 8-test evaluation suite for this agent?"

If yes, run `/create-tests {agent-name}`.

## Output Summary

After creation, report:
```
Created: .opencode/agent/{category}/{name}.md
Updated: .opencode/registry.json
Context: .opencode/context/{name}-context.md (if created)
Tests: Run /create-tests {name} to generate test suite

Agent Status: experimental
Next Steps:
1. Test the agent manually
2. Run /create-tests {name} to generate eval suite
3. Update status to 'stable' once proven
```

## Anti-Patterns to Avoid

- **Long prompts**: If > 800 tokens, you're doing it wrong
- **Exhaustive rules**: Use heuristics, not edge case lists
- **Vague tool descriptions**: Each tool needs clear purpose
- **Pre-loaded context**: Use tools to load context on demand
- **Multi-agent for dependent tasks**: Code changes are sequential

## Quality Checklist

Before finalizing, verify:
- [ ] Description is one clear sentence
- [ ] Prompt is ~500 tokens (not 1000+)
- [ ] Tools are explicitly whitelisted
- [ ] Approach has 4-5 concrete steps
- [ ] Heuristics are actionable, not vague
- [ ] Example shows expected format
- [ ] Registry entry is complete

**agent_name**

$ARGUMENTS
