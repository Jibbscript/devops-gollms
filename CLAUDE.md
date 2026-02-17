# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**devops-gollms** is an agentic DevOps platform project. It architects five autonomous AI agents (Auto-Triage, Mirror/Test Gen, Scaffolder, Janitor/Refactoring, Gatekeeper/CI Review) designed to automate the "Plan -> Code -> Test" lifecycle for Python/Go/Cloud-native engineering organizations.

The project is in early stage. The .gitignore is set up for Go but no Go code exists yet.

## Repository Structure

- `splash-page/` — A React/TypeScript presentation site for the architectural dossier. Migrated from an external repo; contains standalone component files (not a full buildable project with package.json in-tree). Uses React, wouter (routing), framer-motion, lucide-react, Tailwind CSS, and Vite.
  - `Home.tsx`, `AgentCard.tsx`, `MermaidDiagram.tsx` — UI components
  - `data.ts` — All agent definitions, pain points, framework comparisons, risk matrices, roadmap data
  - `architectural_dossier.md` (~157KB) — Full Arc42-style technical architecture for all 5 agents
  - `final_report.md` (~62KB) — Pain point & opportunity analysis report
  - `ideas.md` — Design brainstorm; selected approach is "Obsidian Blueprint" (dark blueprint aesthetic)

## Architecture Context

The five agents and their roles:
1. **Auto-Triage** — Investigates production alerts, proposes root cause, drafts fix PRs
2. **Mirror (Test Gen)** — Reads code, generates comprehensive regression suites
3. **Scaffolder (0-to-1)** — Sets up full repo structure, boilerplate, IaC from spec
4. **Janitor (Refactoring)** — Autonomous tech debt cleanup running in background
5. **Gatekeeper (CI Review)** — Reviews PRs for security vulnerabilities and architectural compliance

Recommended tech stack per the dossier: Temporal.io for workflow orchestration + custom agentic framework on raw LLM APIs (Claude/GPT-4 class models). Target languages: Python and Go.

## Key Design Decisions

- Agents are autonomous loop-based (ReAct pattern: Observation -> Thought -> Action), not copilots
- Each agent produces deterministic proof of work (test results, type checking, verification)
- Security-first: agents interact with sensitive systems, so sandboxing and safety rails are non-negotiable
- The splash page uses an "Obsidian Blueprint" dark theme with Space Grotesk / Inter / JetBrains Mono typography
