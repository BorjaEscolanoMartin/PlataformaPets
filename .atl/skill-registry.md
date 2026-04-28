# Skill Registry — PlataformaPets

Generated: 2026-04-28

## Project Conventions

**Source**: `~/.claude/CLAUDE.md` (global)

### Compact Rules

- Conventional Commits only. No "Co-Authored-By" or AI attribution in commits.
- Never build after changes.
- When asking a question, STOP. Never continue or assume answers.
- Verify claims before stating them. Say "let me verify" and check code/docs first.
- No comments unless the WHY is non-obvious. No docstrings, no task references in comments.
- Default to no error handling for impossible scenarios. Only validate at system boundaries.
- No extra features, refactoring, or abstractions beyond what the task requires.

### Architecture Preferences

- Clean/Hexagonal/Screaming Architecture
- Container-Presentational pattern (frontend)
- Atomic design
- SOLID foundations over framework shortcuts

---

## User Skills

| Name | Trigger | Source |
|------|---------|--------|
| `branch-pr` | Creating PRs, opening a PR, preparing changes for review | user |
| `issue-creation` | Creating GitHub issues, reporting bugs, requesting features | user |
| `judgment-day` | "judgment day", "adversarial review", "dual review", "juzgar" | user |
| `go-testing` | Writing Go tests, using teatest, adding Go test coverage | user |
| `skill-creator` | Creating new AI skills or documenting patterns for AI | user |
| `skill-registry` | "update skills", "skill registry", "actualizar skills" | user |

---

## SDD Skills (Orchestrator-Delegated)

| Name | Phase | Model |
|------|-------|-------|
| `sdd-explore` | Exploration | sonnet |
| `sdd-propose` | Proposal | opus |
| `sdd-spec` | Specifications | sonnet |
| `sdd-design` | Technical design | opus |
| `sdd-tasks` | Task breakdown | sonnet |
| `sdd-apply` | Implementation | sonnet |
| `sdd-verify` | Validation | sonnet |
| `sdd-archive` | Archive | haiku |
| `sdd-onboard` | Onboarding walkthrough | sonnet |

---

## Stack-Specific Rules (auto-inject by context)

### Frontend (`.jsx`, `.tsx`, `frontend/`)
- React 19 with hooks only (no class components)
- TailwindCSS v4 utility classes, shadcn/ui components from `src/components/ui/`
- TanStack Query v5 for server state, React Router v7 for navigation
- React Hook Form + Zod v4 for forms and validation
- ESLint enforced: `eslint .` — no unused vars, react-hooks rules
- No TypeScript (pure JS/JSX project)

### Backend (`backend/`, `.php`)
- Laravel 12, PHP 8.2, PSR-4 autoloading
- Sanctum SPA authentication (cookie-based, not token-based)
- Tests via PHPUnit 11: `php artisan test` (SQLite in-memory for test env)
- Code style: Laravel Pint (`./vendor/bin/pint`)
- Broadcasting: Redis + Laravel Echo Server (keyPrefix matters for channel mapping)
- Queue: Redis driver, queue-worker container

### Infrastructure (`docker-compose.yml`, `nginx/`)
- Docker Compose orchestrates all services
- Nginx as reverse proxy for Laravel (port 8000) and frontend (port 80)
- Echo Server on port 6001
