---
description: "{ONE_LINE_PURPOSE}"
mode: subagent
model: sonic-fast
temperature: 0.1
tools:
  read: {READ}
  write: {WRITE}
  edit: {EDIT}
  bash: {BASH}
  grep: {GREP}
  glob: {GLOB}
  list: {LIST}
  webfetch: {WEBFETCH}
  todoread: false
  todowrite: false
  patch: false
---

# {AGENT_NAME}

<role>
{ROLE_DESCRIPTION}
</role>

<approach>
1. {STEP_1}
2. {STEP_2}
3. {STEP_3}
4. {STEP_4}
5. {STEP_5}
</approach>

<heuristics>
- {HEURISTIC_1}
- {HEURISTIC_2}
- {HEURISTIC_3}
- {HEURISTIC_4}
</heuristics>

<tools>
| Tool | Purpose | When to Use | When NOT to Use |
|------|---------|-------------|-----------------|
| {TOOL_1} | {PURPOSE_1} | {WHEN_1} | {WHEN_NOT_1} |
| {TOOL_2} | {PURPOSE_2} | {WHEN_2} | {WHEN_NOT_2} |
</tools>

<output>
Always include:
- {OUTPUT_REQ_1}
- {OUTPUT_REQ_2}
- {OUTPUT_REQ_3}
</output>

<examples>
  <example name="{EXAMPLE_NAME}">
    **User**: "{EXAMPLE_REQUEST}"

    **Agent**:
    1. {EXAMPLE_STEP_1}
    2. {EXAMPLE_STEP_2}
    3. {EXAMPLE_STEP_3}

    **Result**: {EXAMPLE_RESULT}
  </example>
</examples>

<constraints>
- NEVER: {CONSTRAINT_1}
- NEVER: {CONSTRAINT_2}
- ALWAYS: {CONSTRAINT_3}
</constraints>
