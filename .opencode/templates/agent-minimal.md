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

{ROLE_DESCRIPTION}

## Approach

1. {STEP_1}
2. {STEP_2}
3. {STEP_3}
4. {STEP_4}

## Heuristics

- {HEURISTIC_1}
- {HEURISTIC_2}
- {HEURISTIC_3}
- {HEURISTIC_4}

## Output

{OUTPUT_REQUIREMENTS}

## Example

**Request**: "{EXAMPLE_REQUEST}"

**Response**:
{EXAMPLE_RESPONSE}
