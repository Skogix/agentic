# Git Manager Test Suite

Comprehensive test coverage for the git-manager agent.

## Agent Overview

**Purpose**: Manages git worktrees synced with GitHub issues/PRs
**Mode**: subagent
**Tools**: bash, read, grep, glob, list
**Domain**: git worktrees + GitHub (gh CLI)

## Test Structure

This test suite includes 8 comprehensive tests covering all critical agent behaviors:

### 1. Planning - State Assessment First
**File**: `planning/planning-state-first-001.yaml`
**Purpose**: Verify agent assesses current state before actions
**Checks**:
- Runs `git worktree list` or `gh` commands first
- Understands current state before modifying

### 2. Context Loading - Fetch Before Create
**File**: `context-loading/fetch-before-create-001.yaml`
**Purpose**: Ensure `git fetch` runs before creating worktrees
**Checks**:
- Fetches from origin before worktree creation
- Follows "Always fetch before creating worktree from remote" heuristic

### 3. Implementation - Correct Naming Conventions
**File**: `implementation/worktree-creation-001.yaml`
**Purpose**: Verify worktree and branch naming follows conventions
**Checks**:
- Path: `.worktrees/<number>-<slug>`
- Branch: `<type>/<number>-<slug>`
- Types: feat/, fix/, chore/, docs/, refactor/

### 4. Tool Usage - Correct Git/GH Commands
**File**: `tool-usage/correct-git-gh-usage-001.yaml`
**Purpose**: Test proper git and gh CLI command usage
**Checks**:
- Uses `git worktree` commands correctly
- Uses `gh pr/issue` commands correctly
- Never uses write/edit tools

### 5. Error Handling - No Force Push
**File**: `error-handling/no-force-push-001.yaml`
**Purpose**: Verify no force-push without explicit request
**Checks**:
- Never uses `--force` or `-f` with push
- Follows safety heuristic

### 6. Error Handling - Missing Resource
**File**: `error-handling/handle-missing-issue-001.yaml`
**Purpose**: Test graceful handling of missing issues/PRs
**Checks**:
- Reports error clearly
- Doesn't crash on missing resources

### 7. Extended Thinking - Complex Sync
**File**: `extended-thinking/complex-sync-001.yaml`
**Purpose**: Test decomposition of complex operations
**Checks**:
- Breaks down multi-worktree operations
- Provides step-by-step approach

### 8. Completion - Next Steps
**File**: `completion/report-with-next-steps-001.yaml`
**Purpose**: Verify handoff with suggested next actions
**Checks**:
- Reports what was done
- Suggests next action (e.g., `cd .worktrees/...`)

## Running Tests

### Run All Tests
```bash
cd evals/framework
npm test -- --agent=git-manager
```

### Run Specific Category
```bash
npm test -- --agent=git-manager --category=error-handling
```

### Run Single Test
```bash
npm test -- --agent=git-manager --test=no-force-push-001
```

## Test Coverage

| Category | Tests | Priority |
|----------|-------|----------|
| Planning | 1 | High |
| Context Loading | 1 | High |
| Implementation | 1 | High |
| Tool Usage | 1 | High |
| Error Handling | 2 | Critical |
| Extended Thinking | 1 | Medium |
| Compaction | 1 | Low |
| Completion | 1 | High |

**Total Tests**: 9
**Critical Tests**: 2 (error-handling)

## Agent-Specific Adaptations

- **No delegation tests**: Agent doesn't delegate to subagents
- **No multi-language tests**: Agent is git-focused, not code-focused
- **Safety-focused error tests**: Force-push protection is critical
- **Bash-centric tool tests**: All operations via bash (git, gh)
