---
status: reviewed
research_date: 2026-01-05
research_file: thoughts/research/2026-01-05_agent-creation-system-framework-analysis.md
plan_date: 2026-01-05
plan_file: thoughts/plans/agent-creation-system-completion.md
implementation_date: 2026-01-05
review_date: 2026-01-05
review_file: thoughts/reviews/agent-creation-system-completion-review.md
---

# thoughts/tickets/feature-agent-creation-system.md

## Feature: Agent-Creation-System

### Current State

1. Prompt Size: Current agents are ~100-200 lines - NOT minimal (~500 tokens). Your research recommends smaller prompts.
2. No Eval Framework: No test suite exists for agents. The research recommends 8 essential test types.
3. No Agent Registry: Simple agentic.json exists with only model settings, not a full agent registry.
4. No Generation System: Agents are manually created as static markdown files.
5. Good Patterns Already Present:
    - Clear tool whitelists
    - Structured output formats
    - "What NOT to Do" sections
    - Distinct responsibilities per agent

### Feature Requirements

1. Create a new agent creation system following the Anthropic 2025 research principles you provided (minimal prompts, test suites, registry)?
2. Refactor existing agents to follow the minimal prompt pattern (~500 tokens)?
3. Build an eval framework for testing agents?
4. All of the above as a comprehensive implementation?
   The scope differs significantly between these options. Option 4 would involve:

- Creating /create-agent command
- Creating /create-tests command
- Building eval framework structure
- Creating agent templates
- Adding registry management
- Potentially refactoring existing agents
