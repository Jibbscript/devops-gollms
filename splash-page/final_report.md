# Agentic DevOps & DevEx Architecture for Abnormal.AI

## A Technical Architectural Dossier (Arc42 Style)

**Author:** Manus AI — Acting as Principal Staff Engineer / AI-Native Systems Architect

**Date:** February 7, 2026

**Target Audience:** Staff Software Engineers, Engineering Leadership, GenAI Innovations Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Pain Point & Opportunity Analysis](#2-pain-point--opportunity-analysis)
3. [Agent 1: The Auto-Triage Agent](#3-agent-1-the-auto-triage-agent)
4. [Agent 2: The Mirror (Test Generation) Agent](#4-agent-2-the-mirror-test-generation-agent)
5. [Agent 3: The Scaffolder (0-to-1) Agent](#5-agent-3-the-scaffolder-0-to-1-agent)
6. [Agent 4: The Janitor (Refactoring) Agent](#6-agent-4-the-janitor-refactoring-agent)
7. [Agent 5: The Gatekeeper (CI Review) Agent](#7-agent-5-the-gatekeeper-ci-review-agent)
8. [Implementation Strategy: Build vs. Buy](#8-implementation-strategy-build-vs-buy)
9. [Risk Assessment & Mitigation](#9-risk-assessment--mitigation)
10. [First 90 Days Roadmap](#10-first-90-days-roadmap)
11. [References](#11-references)

---

## 1. Executive Summary

### The "Operating System" Vision for Abnormal's Engineering

Abnormal.AI is a cybersecurity unicorn specializing in AI-based email security, currently pivoting to become an **AI-Native** engineering organization. The central thesis of this dossier is that the primary bottleneck in modern software engineering is no longer code generation — which is largely solved by current-generation LLMs — but rather **context integration, deterministic validation, and safe execution**. The "Agentic" layer proposed here sits between the developer's intent and the CI/CD pipeline, functioning as a sandboxed operating system for engineering workflows.

This document architects five distinct, high-leverage agentic applications using the **Arc42 framework** [1], each designed to eliminate specific friction points in the "Plan → Code → Test" lifecycle for a Python/Go/AWS-native engineering organization. These are not chatbots or copilots. They are **autonomous, loop-based agents** that operate on the ReAct pattern (Observation → Thought → Action) [2], possess tool access (shell, git, databases, cloud APIs), and produce **deterministic proof** of their work through formal verification, test pass/fail results, and type checking.

The five agents are:

| # | Agent Name | Primary Function | Key Bottleneck Addressed |
|---|---|---|---|
| 1 | **Auto-Triage** | Investigates production alerts, proposes root cause, drafts fix PRs | Alert fatigue, MTTR reduction |
| 2 | **Mirror (Test Gen)** | Reads code, generates comprehensive regression suites | Test coverage gaps, "deterministic proof" |
| 3 | **Scaffolder (0-to-1)** | Sets up full repo structure, boilerplate, IaC from spec | Service creation friction, security baselines |
| 4 | **Janitor (Refactoring)** | Autonomous tech debt cleanup running in background | Typing, dependency rot, dead code |
| 5 | **Gatekeeper (CI Review)** | Reviews PRs for security vulnerabilities and architectural compliance | Security review bottleneck, compliance |

The recommended technology stack is a **hybrid architecture** combining **Temporal.io** for durable workflow orchestration with a **custom agentic framework** built on raw LLM APIs (Claude 3.5 Sonnet / GPT-4o class models). This approach maximizes control, security, and debuggability — non-negotiable requirements for a cybersecurity company where agents will interact with sensitive systems and data.

> **Clarification on Terminology:** This report is strictly about **Agents** (autonomous actors that initiate workflows, use tools, and operate in loops) — not **Copilots** (assistants that respond to human prompts). An agent detects an error and fixes it. A copilot waits for you to ask about the error.

---

## 2. Pain Point & Opportunity Analysis

### 2.1 The "Plan → Code → Test" Loop in Cybersecurity Startups

High-growth cybersecurity startups like Abnormal.AI operate under a dual mandate: ship innovative features at startup velocity while maintaining the security and reliability standards expected of an enterprise security vendor. This creates an inherent tension that manifests as friction at every stage of the development lifecycle. The traditional "Plan → Code → Test" loop, already strained in typical SaaS companies, is stretched to its limits in this context.

Research into developer productivity at scale reveals that developers spend only **32% of their time actually writing code** [3]. The remaining 68% is consumed by context switching, waiting for builds, triaging alerts, writing tests, updating documentation, and navigating organizational processes. In a cybersecurity context, this overhead is amplified by the additional burden of security reviews, compliance checks, and the heightened consequences of shipping vulnerabilities.

### 2.2 The Top 5 Friction Points

Our analysis identifies five areas where human friction is highest and where agentic automation can deliver the most leverage:

| Rank | Friction Point | Estimated Developer Time Waste | Impact on Velocity |
|---|---|---|---|
| 1 | **Integration Testing for Security-Critical Systems** | 15-25% of sprint capacity | High — incomplete coverage creates false confidence |
| 2 | **Triaging Production Alerts (Sentry/PagerDuty)** | 23 min recovery per context switch [3] | Critical — alert fatigue leads to missed incidents |
| 3 | **Updating Legacy Documentation** | 5-10% of sprint capacity | Medium — stale docs compound onboarding costs |
| 4 | **Scaffolding New Microservices** | 2-5 days per new service | High — security baseline inconsistencies |
| 5 | **Verifying Database Migration Safety** | 1-3 days per migration | Critical — failed migrations cause data loss |

**Integration Testing** is the most pervasive pain point. In a microservices architecture processing email security data, ensuring that changes in one service do not create unintended security consequences in another requires deep understanding of both business logic and threat models. Developers routinely take shortcuts, leading to incomplete test coverage and a false sense of security.

**Alert Fatigue** is the most acute pain point. Production environments in cybersecurity startups generate a constant stream of alerts from Sentry, PagerDuty, and CloudWatch. Research shows that developers lose an average of 23 minutes and 15 seconds per context switch [3], and the cost of context switching can reach $250 per developer per day. When on-call engineers are desensitized to alerts, critical incidents get missed.

**Legacy Documentation** creates a vicious cycle: fast-paced development deprioritizes documentation updates, which makes onboarding harder, which slows development further. In a security context, stale documentation also creates compliance risk.

**Service Scaffolding** should take minutes but often takes days when security baselines, observability, IaC, and compliance configurations must be manually applied. Inconsistencies between services create security posture gaps.

**Database Migrations** are high-stakes operations where a single error can cause data loss or corruption. The manual verification process is time-consuming and error-prone, creating a bottleneck that slows feature delivery.

### 2.3 Lessons from Industry Leaders

Established cybersecurity companies have invested heavily in internal developer experience to address these friction points:

**CrowdStrike** has built a frictionless developer platform with standardized service scaffolding that includes all necessary security baselines, paired with a high-performance CI/CD pipeline optimized for fast feedback loops [4].

**Palo Alto Networks** employs a "paved roads" philosophy — well-supported, pre-approved paths for developers that enforce security and reliability standards while minimizing friction. Developers who stay on the paved road get fast, automated approvals; those who deviate trigger additional review [5].

**SentinelOne** uses a data-driven engineering culture, tracking metrics from developer productivity to CI/CD pipeline performance to identify and eliminate bottlenecks systematically [6].

The common pattern across these leaders is the shift from **gatekeeping** (blocking developers until they comply) to **guardrailing** (providing safe defaults that make the right thing the easy thing). This is precisely the philosophy that should guide the design of Abnormal.AI's agentic systems.

---

## 3. Agent 1: The Auto-Triage Agent

### 3.1 Introduction and Goals

The Auto-Triage Agent is an autonomous incident response system that investigates production alerts, reads logs and metrics, clones repositories, reproduces errors in a sandbox, proposes root cause analysis, and drafts pull requests for fixes. It is designed to function as a reliable member of the SRE team, not a replacement for human engineers, but a force multiplier that handles the initial investigation and reduces Mean Time to Resolution (MTTR).

The agent operates on the **ReAct pattern** [2] — interleaving reasoning and acting in a loop rather than following a linear script. This is critical because incident triage is inherently non-deterministic: the agent must formulate hypotheses, test them, and adapt its approach based on what it discovers.

### 3.2 Context View

The Auto-Triage Agent operates within a rich ecosystem of development and operations tools. Its effectiveness depends on seamless integration with these external systems.

```mermaid
graph TD
    subgraph "Observability Layer"
        A[Sentry<br/>Error Tracking] -->|Webhook: Error Event| B((Auto-Triage<br/>Agent))
        C[PagerDuty<br/>Incident Mgmt] -->|Webhook: Incident| B
        D[AWS CloudWatch<br/>Logs & Metrics] -->|API: Query| B
    end
    subgraph "Code & Deployment"
        B -->|API: Clone, Read, PR| E[GitHub<br/>Repositories]
        E -->|Webhook: PR Status| B
        F[CI/CD Pipeline<br/>GitHub Actions] -->|API: Build Status| B
    end
    subgraph "Communication"
        B -->|API: Post Updates| G[Slack<br/>Incident Channels]
        G -->|Command: Override| B
    end
    subgraph "Knowledge"
        H[Runbook DB<br/>Vector Store] -->|RAG: Context| B
        I[Incident History<br/>PostgreSQL] -->|Query: Past Incidents| B
    end
```

**Key Integrations:**

| System | Integration Type | Purpose |
|---|---|---|
| **Sentry** | Webhook + REST API | Receive error events, fetch stack traces, tags, breadcrumbs |
| **PagerDuty** | Webhook + REST API | Receive incidents, acknowledge, escalate, resolve |
| **AWS CloudWatch** | AWS SDK | Query logs, metrics, and alarms for infrastructure context |
| **GitHub** | REST + GraphQL API | Clone repos, read files, create branches, commit, open PRs |
| **Slack** | Bolt SDK | Post triage updates, receive human override commands |
| **Runbook DB** | Vector DB (pgvector) | RAG retrieval of relevant runbooks and past incident resolutions |

### 3.3 Building Block View

The agent is composed of four primary building blocks, each with clearly defined responsibilities:

```mermaid
flowchart TD
    subgraph "Auto-Triage Agent"
        O[Orchestrator<br/>ReAct Loop Engine] --> M[Memory<br/>Short-term + Long-term]
        O --> TI[Tool Interface<br/>Unified API Abstraction]
        TI --> S[Sandbox<br/>Isolated Execution Env]
    end
    
    O -->|"State Transitions"| SM[State Machine<br/>Temporal Workflow]
    M -->|"Vector Search"| VDB[(pgvector<br/>Embeddings)]
    M -->|"Structured State"| PG[(PostgreSQL<br/>Incident State)]
    TI -->|"Tool Calls"| EXT[External Systems<br/>Sentry, GitHub, AWS, Slack]
    S -->|"Code Execution"| DC[Docker Container<br/>Resource-Limited]
```

**Orchestrator (ReAct Loop Engine):** The brain of the agent. Implements the ReAct pattern where the LLM alternates between reasoning about the problem and taking actions via tools. The orchestrator maintains a structured plan that evolves as new information is discovered. It uses Chain-of-Thought reasoning to derive hypotheses and selects tools based on the current state of the investigation. Critically, the orchestrator is wrapped in a **Temporal workflow** to ensure durability — if the process crashes mid-investigation, it resumes from the last checkpoint.

**Memory (Short-term + Long-term):** Short-term memory holds the current investigation context (alert details, logs gathered, hypotheses tested) within the LLM's context window. Long-term memory persists across investigations using PostgreSQL for structured incident data and pgvector for semantic search over runbooks and past incident resolutions. This enables the agent to learn from past incidents and apply relevant patterns.

**Tool Interface (Unified API Abstraction):** Provides a standardized interface for the orchestrator to interact with external systems. Each tool is defined with a clear schema (input parameters, output format, error types) that the LLM can understand and invoke. The tool interface handles authentication, rate limiting, retries, and error normalization.

**Sandbox (Isolated Execution Environment):** A Docker-based sandbox where the agent can safely execute code to reproduce errors. The sandbox is network-isolated (no access to production), resource-limited (CPU, memory, time caps), and ephemeral (destroyed after each investigation). This is a critical safety mechanism — the agent can run arbitrary code without risk of affecting production systems.

### 3.4 Runtime View

The following sequence diagram illustrates a typical triage workflow:

```mermaid
sequenceDiagram
    participant S as Sentry
    participant PD as PagerDuty
    participant Agent as Auto-Triage Agent
    participant GH as GitHub
    participant CW as CloudWatch
    participant Slack as Slack
    participant Sandbox as Sandbox

    S->>PD: Error triggers incident
    PD->>Agent: Webhook: New incident
    Agent->>PD: ACK incident
    Agent->>Slack: "🔍 Investigating incident #1234"
    
    rect rgb(240, 248, 255)
        Note over Agent: ReAct Loop Begins
        Agent->>S: Fetch error details + stack trace
        S-->>Agent: Stack trace, tags, breadcrumbs
        Agent->>CW: Query related logs (±5 min window)
        CW-->>Agent: Log entries, metric anomalies
        Agent->>Agent: Reason: Formulate hypothesis
        Agent->>GH: Clone affected repository
        GH-->>Agent: Repository cloned
        Agent->>Agent: Analyze code at fault location
        Agent->>Sandbox: Reproduce error with test case
        Sandbox-->>Agent: Error reproduced ✓
        Agent->>Agent: Reason: Confirm root cause
        Agent->>Sandbox: Apply fix, run tests
        Sandbox-->>Agent: Tests pass ✓
    end
    
    Agent->>GH: Create branch, commit fix, open PR
    GH-->>Agent: PR #567 created
    Agent->>Slack: "✅ Root cause identified. PR #567 ready for review"
    Agent->>PD: Add investigation notes, link PR
```

**Workflow Steps:**

1. **Incident Ingestion:** PagerDuty webhook triggers the agent. The agent acknowledges the incident and posts to Slack.
2. **Context Gathering:** The agent fetches error details from Sentry (stack trace, tags, breadcrumbs) and queries CloudWatch for correlated logs and metric anomalies within a ±5 minute window.
3. **Hypothesis Formation:** Using Chain-of-Thought reasoning, the agent formulates an initial hypothesis about the root cause based on the gathered context and any similar past incidents retrieved via RAG.
4. **Code Analysis:** The agent clones the affected repository and analyzes the code at the fault location identified in the stack trace.
5. **Reproduction:** The agent attempts to reproduce the error in the sandbox by constructing a minimal test case. This is the **deterministic proof** step — if the error can be reproduced, the hypothesis is validated.
6. **Fix Generation:** The agent generates a fix, applies it in the sandbox, and runs the project's test suite to verify the fix does not introduce regressions.
7. **PR Creation:** If tests pass, the agent creates a branch, commits the fix with a detailed description of the root cause analysis, and opens a PR for human review.
8. **Communication:** The agent posts a summary to Slack and updates the PagerDuty incident with investigation notes.

### 3.5 Cross-cutting Concepts

**Safety Rails — Preventing Infinite Loops and Destructive Actions:**

The agent operates under strict constraints to prevent runaway behavior:

| Safety Mechanism | Implementation | Threshold |
|---|---|---|
| **Max ReAct iterations** | Hard limit on reasoning/action cycles | 15 iterations per incident |
| **Circuit breaker** | Detects repeated failed actions | 3 consecutive failures → escalate to human |
| **Sandbox isolation** | Docker with no network, CPU/memory limits | 2 vCPU, 4GB RAM, 10 min timeout |
| **Write scope restriction** | Agent can only create branches/PRs, never merge | Merge requires human approval |
| **Token budget** | Maximum tokens per investigation | $5 USD ceiling per incident |
| **Blast radius containment** | Agent operates on cloned repos, never production | Read-only access to production logs |

**Cost Control — Token Usage Limits:**

Each investigation is budgeted at a maximum of $5 in LLM API costs (approximately 500K tokens at GPT-4o pricing). The agent uses a tiered model strategy: fast, cheap models (GPT-4o-mini) for initial log analysis and context gathering, and more capable models (Claude 3.5 Sonnet) for root cause reasoning and fix generation. Token usage is tracked per investigation and reported in the Slack summary.

**State Management for Long-Running Tasks:**

Incident triage can take minutes to hours. The agent's state is managed by **Temporal.io**, which provides durable execution guarantees. If the agent process crashes, Temporal replays the workflow from the last checkpoint. All tool calls are implemented as Temporal activities with automatic retry policies and timeout configurations.

---


## 4. Agent 2: The Mirror (Test Generation) Agent

### 4.1 Introduction and Goals

The Mirror Agent is an autonomous test generation system that reads production code and generates comprehensive regression test suites as **"deterministic proof"** of code behavior. The name "Mirror" reflects its purpose: to create a faithful reflection of the application's behavior in the form of executable tests. Unlike simple unit test generators, the Mirror Agent operates in a coverage-driven feedback loop, using mutation testing to validate that generated tests actually catch bugs rather than merely achieving line coverage.

The distinction between "coverage" and "proof" is critical. A test suite can achieve 100% line coverage while catching zero real bugs — the tests merely exercise code paths without asserting meaningful behavior. The Mirror Agent targets **mutation score** as its primary quality metric: the percentage of deliberately introduced code mutations that the test suite detects [7].

### 4.2 Context View

```mermaid
graph TD
    subgraph "Source Systems"
        GH[GitHub<br/>Source Code] -->|Clone + Read| M((Mirror<br/>Agent))
        CI[CI Pipeline<br/>GitHub Actions] -->|Coverage Reports| M
        COV[Coverage Tools<br/>pytest-cov / go cover] -->|Coverage Data| M
    end
    subgraph "Validation"
        M -->|Run Tests| CI
        M -->|Mutation Testing| MUT[mutmut / Stryker<br/>Mutation Engine]
        MUT -->|Surviving Mutants| M
    end
    subgraph "Output"
        M -->|Create PR| GH
        M -->|Report| DASH[Quality Dashboard<br/>Grafana]
    end
    subgraph "Knowledge"
        M -->|RAG: Test Patterns| VDB[(Vector DB<br/>Test Pattern Library)]
    end
```

### 4.3 Building Block View

The Mirror Agent is composed of four specialized components that operate in a feedback loop:

```mermaid
flowchart TD
    subgraph "Mirror Agent"
        CA[Code Analyzer<br/>AST Parser + LLM] --> TS[Test Strategist<br/>Coverage Gap Analyzer]
        TS --> TW[Test Writer<br/>LLM + Template Engine]
        TW --> V[Validator<br/>Mutation Testing + Execution]
        V -->|"Surviving Mutants<br/>Feedback"| TS
    end
    
    CA -->|"Code Model"| AST[(AST + Dependency<br/>Graph)]
    TS -->|"Test Plan"| TP[Test Plan<br/>Prioritized Targets]
    TW -->|"Generated Tests"| GT[Test Files<br/>.py / .go]
    V -->|"Quality Report"| QR[Mutation Score<br/>+ Coverage Delta]
```

**Code Analyzer:** Parses source code into an Abstract Syntax Tree (AST) and builds a dependency graph. Uses the LLM to understand business logic semantics that static analysis alone cannot capture. For Python, leverages `ast` module and `mypy` type information; for Go, uses `go/ast` and `go/types`. The analyzer identifies function signatures, input/output types, side effects, and dependencies on external systems.

**Test Strategist:** Analyzes coverage reports and the code model to identify the highest-value test targets. Prioritization is based on: (1) code complexity (cyclomatic complexity), (2) change frequency (git log analysis), (3) existing coverage gaps, and (4) security criticality (functions handling user input, authentication, or data access). The strategist produces a ranked test plan.

**Test Writer:** Generates test code using the LLM, guided by the test plan and a library of test patterns retrieved via RAG. The writer generates three categories of tests:

| Test Category | Description | Framework |
|---|---|---|
| **Unit Tests** | Isolated function-level tests with mocked dependencies | pytest (Python), testing (Go) |
| **Integration Tests** | Tests that verify interactions between components | pytest + testcontainers |
| **Property-Based Tests** | Tests that verify invariants across random inputs | Hypothesis (Python), rapid (Go) |

**Validator:** The critical quality gate. Runs the generated tests to verify they pass, then runs **mutation testing** to verify they actually catch bugs. The mutation testing loop works as follows:

1. Generate mutants (small code changes like `+` → `-`, `>` → `>=`)
2. Run the test suite against each mutant
3. If a mutant survives (tests still pass), feed it back to the Test Strategist
4. The Strategist directs the Writer to generate tests that kill the surviving mutant
5. Repeat until mutation score plateaus

### 4.4 Runtime View

```mermaid
sequenceDiagram
    participant Trigger as CI Pipeline / Cron
    participant Agent as Mirror Agent
    participant GH as GitHub
    participant CI as CI Pipeline
    participant Mut as Mutation Engine

    Trigger->>Agent: New code merged / scheduled run
    Agent->>GH: Clone repository
    GH-->>Agent: Repository
    Agent->>Agent: Code Analyzer: Parse AST, build dependency graph
    Agent->>CI: Fetch current coverage report
    CI-->>Agent: Coverage data (72% line coverage)
    
    rect rgb(255, 248, 240)
        Note over Agent: Coverage-Driven Generation Loop
        Agent->>Agent: Test Strategist: Identify gaps, prioritize targets
        Agent->>Agent: Test Writer: Generate tests for top targets
        Agent->>CI: Run generated tests
        CI-->>Agent: Tests pass ✓ (coverage now 81%)
        Agent->>Mut: Run mutation testing on new tests
        Mut-->>Agent: 15 surviving mutants
        Agent->>Agent: Test Strategist: Analyze surviving mutants
        Agent->>Agent: Test Writer: Generate mutation-killing tests
        Agent->>CI: Run updated test suite
        CI-->>Agent: Tests pass ✓ (mutation score: 78%)
    end
    
    Agent->>GH: Create PR with new test files
    Agent->>Agent: Generate quality report
```

### 4.5 Cross-cutting Concepts

**Handling Flaky Tests:** Flaky tests are the bane of automated test generation. The Mirror Agent addresses this through: (1) running each generated test 3 times to detect non-determinism, (2) isolating tests with fresh fixtures and mocked external dependencies, (3) flagging tests that depend on timing, ordering, or external state for human review.

**Deterministic Validation:** The agent provides deterministic proof through a chain of evidence: code coverage delta (quantitative), mutation score (qualitative), and test execution logs (reproducible). Each PR includes a quality report showing exactly what was tested and how effective the tests are.

**Cost Controls:** Test generation is token-intensive because the LLM must understand both the source code and the testing framework. The agent uses a tiered approach: fast models for initial test skeleton generation, capable models for complex integration test logic. Maximum budget per run is configurable (default: $10 per repository scan).

---

## 5. Agent 3: The Scaffolder (0-to-1) Agent

### 5.1 Introduction and Goals

The Scaffolder Agent automates the creation of new services from a declarative specification. A developer provides a YAML spec describing what they want (service name, language, infrastructure requirements, integrations), and the agent generates a complete, production-ready repository including application code, infrastructure-as-code, security baselines, observability configuration, and CI/CD pipeline definitions. The goal is to reduce service creation from **days to minutes** while ensuring every new service meets organizational standards.

This agent is fundamentally different from the others in that it operates in a **single-shot, deterministic mode** rather than a continuous loop. The output is fully verifiable: either the generated service builds, passes linting, and deploys to a staging environment, or it does not.

### 5.2 Context View

```mermaid
graph TD
    DEV[Developer<br/>YAML Spec] -->|Spec Input| S((Scaffolder<br/>Agent))
    subgraph "Code & Config Generation"
        S -->|Create Repo + PR| GH[GitHub]
        S -->|Generate IaC| TF[Terraform Cloud]
        S -->|Register Service| SR[Internal Service<br/>Registry]
    end
    subgraph "Validation"
        S -->|Trigger Build| CI[CI/CD Pipeline<br/>GitHub Actions]
        CI -->|Build Status| S
        S -->|SAST Scan| SAST[Semgrep / Bandit]
        SAST -->|Scan Results| S
    end
    subgraph "Security & Compliance"
        S -->|Fetch Baselines| SB[Security Baseline<br/>Policy Store]
        S -->|Configure Secrets| SM[AWS Secrets Manager]
        S -->|Configure Monitoring| OBS[Datadog / Grafana]
    end
```

### 5.3 Building Block View

```mermaid
flowchart TD
    subgraph "Scaffolder Agent"
        SP[Spec Parser<br/>YAML Validation] --> TE[Template Engine<br/>Cookiecutter + LLM]
        TE --> IG[IaC Generator<br/>Terraform Templates]
        IG --> SBA[Security Baseline<br/>Applier]
        SBA --> VAL[Validator<br/>Build + SAST + Lint]
    end
    
    SP -->|"Parsed Spec"| PS[Validated<br/>Service Spec]
    TE -->|"App Code"| AC[Application<br/>Boilerplate]
    IG -->|"IaC"| IAC[Terraform<br/>Modules]
    SBA -->|"Security Config"| SC[SAST Config<br/>Secrets Config<br/>Base Images]
    VAL -->|"Validation Report"| VR[Build Pass/Fail<br/>SAST Results<br/>Lint Results]
```

**Spec Parser:** Validates the developer's YAML specification against a JSON Schema. The spec defines: service name, language (Python/Go), infrastructure requirements (compute, database, cache, queue), external integrations (S3, SQS, DynamoDB), team ownership, and compliance tier (standard/elevated/FedRAMP).

Example specification:

```yaml
service:
  name: email-classifier-v2
  language: python
  framework: fastapi
  team: ml-platform
  compliance_tier: elevated

infrastructure:
  compute: ecs-fargate
  database: aurora-postgresql
  cache: elasticache-redis
  queue: sqs

integrations:
  - s3
  - dynamodb
  - datadog

observability:
  logging: structured-json
  metrics: datadog
  tracing: opentelemetry
```

**Template Engine (Cookiecutter + LLM):** Uses Cookiecutter templates for deterministic boilerplate generation (directory structure, Dockerfile, Makefile, CI config) and the LLM for adaptive code generation (API route stubs based on service name semantics, README content, initial test structure). The combination ensures reproducibility for structural elements while allowing intelligent customization.

**IaC Generator:** Generates Terraform modules from a library of pre-approved, security-hardened module templates. Each infrastructure component (ECS service, Aurora cluster, ElastiCache, SQS queue) has a corresponding Terraform module that encodes organizational best practices (encryption at rest, VPC configuration, IAM least-privilege policies). The generator composes these modules based on the spec.

**Security Baseline Applier:** Applies the organization's security baselines to the generated project:

| Security Control | Implementation |
|---|---|
| **SAST Configuration** | Semgrep rules + Bandit config for Python, gosec for Go |
| **Dependency Scanning** | Dependabot config + Snyk integration |
| **Secrets Management** | AWS Secrets Manager integration, no hardcoded secrets |
| **Container Security** | Approved base images from internal registry, Trivy scanning |
| **Network Security** | VPC-only access, security group templates |
| **Logging** | Structured JSON logging with PII redaction |

**Validator:** Runs a comprehensive validation suite on the generated project: (1) builds the application, (2) runs SAST scans, (3) validates Terraform plan, (4) checks linting rules, (5) verifies all security baselines are applied. The validator produces a pass/fail report that is included in the PR.

### 5.4 Runtime View

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Agent as Scaffolder Agent
    participant GH as GitHub
    participant TF as Terraform Cloud
    participant CI as CI Pipeline
    participant SAST as SAST Scanner

    Dev->>Agent: Submit YAML spec
    Agent->>Agent: Spec Parser: Validate spec
    Agent->>Agent: Template Engine: Generate app code
    Agent->>Agent: IaC Generator: Generate Terraform
    Agent->>Agent: Security Baseline: Apply controls
    Agent->>SAST: Run SAST scan
    SAST-->>Agent: No vulnerabilities found ✓
    Agent->>GH: Create repository + initial commit
    Agent->>CI: Trigger build pipeline
    CI-->>Agent: Build passes ✓
    Agent->>TF: Terraform plan (dry run)
    TF-->>Agent: Plan valid ✓
    Agent->>GH: Open PR with full project
    Agent->>Dev: "Repository ready for review: PR #1"
```

### 5.5 Cross-cutting Concepts

**Preventing Insecure Defaults:** The agent enforces a "secure by default" philosophy. Every generated service starts with encryption enabled, least-privilege IAM roles, structured logging with PII redaction, and SAST scanning in the CI pipeline. Developers must explicitly opt out of security controls (which triggers an elevated review).

**Compliance Tiers:** The spec includes a `compliance_tier` field that controls the level of security controls applied. The "standard" tier includes baseline security controls. The "elevated" tier adds additional controls such as audit logging and data classification. The "FedRAMP" tier adds the full set of FedRAMP controls including continuous monitoring and incident response automation.

**Template Versioning:** All templates are versioned in a dedicated repository. When templates are updated (e.g., to address a new security requirement), the Scaffolder can be used to generate update PRs for existing services — a capability borrowed from **Copier** [8], which supports updating projects from evolving templates.

---


## 6. Agent 4: The Janitor (Refactoring) Agent

### 6.1 Introduction and Goals

The Janitor Agent is an autonomous technical debt remediation system that runs continuously in the background, performing: type annotation additions, dependency updates, dead code removal, code style enforcement, and security patch application. Unlike the other agents which respond to events or requests, the Janitor operates as a **background process** — a tireless custodian that keeps the codebase healthy without requiring developer attention.

The key design principle is **safety through incrementalism**. The Janitor never attempts large-scale refactors. Instead, it makes small, atomic, independently reviewable changes — each in its own PR with a clear description of what changed and why. This approach minimizes the risk of breaking changes and makes human review tractable.

### 6.2 Context View

```mermaid
graph TD
    subgraph "Input Sources"
        PKG[Package Registries<br/>PyPI, Go Modules] -->|Version Info| J((Janitor<br/>Agent))
        SEC[Security Advisories<br/>GitHub Advisories, NVD] -->|Vulnerability Data| J
        GH[GitHub<br/>Source Code] -->|Code Access| J
    end
    subgraph "Execution"
        J -->|Run Tests| CI[CI/CD Pipeline]
        CI -->|Test Results| J
        J -->|Create PRs| GH
    end
    subgraph "Configuration"
        POL[Policy Store<br/>Refactoring Rules] -->|Rules + Priorities| J
        J -->|Metrics| DASH[Engineering<br/>Dashboard]
    end
```

### 6.3 Building Block View

```mermaid
flowchart TD
    subgraph "Janitor Agent"
        DS[Debt Scanner<br/>Multi-Module Analysis] --> PR[Priority Ranker<br/>Risk-Based Scoring]
        PR --> RF[Refactorer<br/>AST Transform + LLM]
        RF --> TR[Test Runner<br/>Full Suite Execution]
        TR --> PC[PR Creator<br/>Atomic Change PRs]
    end
    
    DS -->|"Debt Inventory"| DI[Type Gaps<br/>Outdated Deps<br/>Dead Code<br/>Style Violations<br/>Security Vulns]
    PR -->|"Ranked Queue"| RQ[Priority Queue<br/>Severity × Impact × Fixability]
    RF -->|"Refactored Code"| RC[Modified Files<br/>+ Rollback Info]
    TR -->|"Test Results"| RES[Pass/Fail<br/>+ Regression Check]
    PC -->|"Atomic PRs"| PRS[Small, Focused PRs<br/>with Context]
```

**Debt Scanner (Multi-Module Analysis):** A collection of specialized sub-scanners, each targeting a specific type of technical debt:

| Sub-Scanner | Target | Tools Used |
|---|---|---|
| **Type Annotation Scanner** | Missing type hints in Python | mypy, pytype, MonkeyType |
| **Dependency Scanner** | Outdated or vulnerable dependencies | pip-audit, safety, go mod tidy |
| **Dead Code Scanner** | Unused imports, functions, variables | vulture (Python), deadcode (Go) |
| **Code Style Scanner** | Style violations, formatting issues | ruff, black (Python), gofmt (Go) |
| **Security Vulnerability Scanner** | Known CVEs in dependencies | Dependabot, Snyk, GitHub Advisories |

**Priority Ranker:** Scores each debt item using a composite formula:

> **Priority Score = Severity × Impact × Fixability**

Where **Severity** ranges from 1 (cosmetic) to 10 (critical security vulnerability), **Impact** measures how many files/services are affected, and **Fixability** is an inverse measure of risk (high fixability = low risk of breaking changes). Security vulnerabilities with known exploits always receive maximum priority.

**Refactorer:** Applies fixes using a combination of deterministic AST transformations (for mechanical changes like adding type annotations or updating import statements) and LLM-guided refactoring (for changes that require semantic understanding, like replacing deprecated API patterns). The refactorer uses **OpenRewrite** [9] recipes for Java/Kotlin codebases and **Sourcery** [10] for Python, with custom tooling for Go.

**Test Runner:** Executes the full test suite after each refactoring operation. A failing test immediately aborts the change and marks the debt item for human review. The test runner also performs a **regression check** by comparing test results before and after the change to detect any behavioral differences.

**PR Creator:** Creates small, atomic PRs — one per debt item. Each PR includes: (1) a clear title describing the change, (2) a description explaining why the change was made, (3) links to relevant security advisories (for dependency updates), (4) before/after code snippets, and (5) test results confirming no regressions.

### 6.4 Runtime View

The Janitor Agent operates in a **hybrid execution model**: cron-based for routine maintenance and event-driven for urgent security patches.

```mermaid
sequenceDiagram
    participant Cron as Scheduler (Daily)
    participant Event as Security Advisory Feed
    participant Agent as Janitor Agent
    participant GH as GitHub
    participant CI as CI Pipeline

    alt Scheduled Run (Daily at 2 AM)
        Cron->>Agent: Trigger daily scan
        Agent->>GH: Clone all target repositories
        Agent->>Agent: Debt Scanner: Full codebase scan
        Agent->>Agent: Priority Ranker: Score and rank findings
        loop For each top-priority item
            Agent->>Agent: Refactorer: Apply fix
            Agent->>CI: Run test suite
            CI-->>Agent: Tests pass ✓
            Agent->>GH: Create atomic PR
        end
    else Event-Driven (Critical CVE Published)
        Event->>Agent: New critical vulnerability
        Agent->>Agent: Scan affected repositories
        Agent->>Agent: Generate dependency update
        Agent->>CI: Run test suite
        CI-->>Agent: Tests pass ✓
        Agent->>GH: Create urgent PR (tagged: security)
    end
```

### 6.5 Cross-cutting Concepts

**Preventing Breaking Changes:** The Janitor employs a multi-layered safety strategy:

| Layer | Mechanism | Purpose |
|---|---|---|
| 1 | **Atomic changes** | Each PR changes one thing, making review and rollback trivial |
| 2 | **Full test suite execution** | Every change must pass all existing tests |
| 3 | **Semantic diff analysis** | LLM reviews the diff to assess behavioral impact |
| 4 | **Canary deployment** | High-risk changes are deployed to canary before full rollout |
| 5 | **Human approval gates** | Security patches auto-merge after CI passes; other changes require human approval |

**Gradual Typing Strategy for Python:** For large Python codebases, the Janitor follows mypy's recommended gradual typing approach [11]: start with the most critical modules (security-related code, API boundaries), add type annotations incrementally, use `MonkeyType` to infer types from runtime behavior, and progressively enable stricter mypy checks. The agent tracks typing coverage as a metric and targets 5% improvement per month.

**Rollback Strategy:** Every PR created by the Janitor includes a one-click revert option. If a merged change causes issues in production, the on-call engineer can revert the PR with a single click, and the Janitor will mark that debt item as "requires human intervention."

---

## 7. Agent 5: The Gatekeeper (CI Review) Agent

### 7.1 Introduction and Goals

The Gatekeeper Agent is an autonomous PR review system focused on **security vulnerabilities and architectural compliance**. It operates as a required check in the CI/CD pipeline, analyzing every PR before human review. The Gatekeeper does not replace human reviewers — it augments them by handling the mechanical aspects of security review (dependency scanning, SAST findings, architectural rule enforcement) so that human reviewers can focus on design quality and business logic correctness.

For a cybersecurity company like Abnormal.AI, the Gatekeeper serves a dual purpose: it improves the security of the product, and it provides **audit evidence** for compliance frameworks (SOC 2, FedRAMP) that require documented security review processes.

### 7.2 Context View

```mermaid
graph TD
    subgraph "Trigger"
        PR[GitHub PR<br/>Webhook] -->|PR Opened/Updated| G((Gatekeeper<br/>Agent))
    end
    subgraph "Analysis Tools"
        G -->|Diff Analysis| SAST[SAST Scanner<br/>Semgrep, Bandit, gosec]
        G -->|Dependency Check| DEP[Dependency Scanner<br/>Snyk, pip-audit]
        G -->|SBOM Generation| SBOM[SBOM Generator<br/>Syft, CycloneDX]
        G -->|Architecture Check| ARCH[Fitness Functions<br/>Custom Rules Engine]
    end
    subgraph "Knowledge"
        POL[Security Policy DB<br/>Org Standards] -->|Rules| G
        VDB[Vulnerability DB<br/>NVD, GitHub Advisories] -->|CVE Data| G
        HIST[Review History<br/>Past Decisions] -->|Patterns| G
    end
    subgraph "Output"
        G -->|Review Comment| PR
        G -->|Approve/Block| CI[CI Pipeline<br/>Required Check]
        G -->|Audit Log| AUDIT[Compliance<br/>Audit Trail]
    end
```

### 7.3 Building Block View

```mermaid
flowchart TD
    subgraph "Gatekeeper Agent"
        DA[Diff Analyzer<br/>Semantic Diff Parser] --> SS[Security Scanner<br/>SAST + Dependency]
        DA --> AV[Architecture Validator<br/>Fitness Functions]
        SS --> CC[Compliance Checker<br/>Policy Engine]
        AV --> CC
        CC --> RG[Report Generator<br/>LLM-Powered Summaries]
    end
    
    DA -->|"Parsed Diff"| PD[Changed Files<br/>+ Semantic Context]
    SS -->|"Findings"| SF[Vulnerabilities<br/>Severity + Location]
    AV -->|"Violations"| AVI[Architecture<br/>Rule Violations]
    CC -->|"Compliance Status"| CS[Pass/Fail<br/>per Policy]
    RG -->|"Review Report"| RR[PR Comment<br/>+ CI Status]
```

**Diff Analyzer (Semantic Diff Parser):** Goes beyond line-level diff analysis to understand the **semantic impact** of changes. Uses the LLM to classify changes into categories: new functionality, bug fix, refactoring, dependency update, configuration change, security-relevant change. This classification determines which downstream analyzers are invoked and at what depth.

**Security Scanner:** Runs a battery of security analysis tools on the changed code:

| Tool | Language | Focus Area |
|---|---|---|
| **Semgrep** | Multi-language | Custom security rules, OWASP patterns |
| **Bandit** | Python | Python-specific security issues |
| **gosec** | Go | Go-specific security issues |
| **Snyk Code** | Multi-language | AI-powered vulnerability detection |
| **pip-audit / nancy** | Python / Go | Dependency vulnerability scanning |
| **Syft** | Multi-language | SBOM generation for supply chain visibility |

**Architecture Validator (Fitness Functions):** Enforces architectural rules as code, inspired by ThoughtWorks' architectural fitness functions [12]. Examples of rules:

| Rule | Description | Enforcement |
|---|---|---|
| **No direct DB access from API handlers** | Database access must go through repository layer | Block PR |
| **No new dependencies without security review** | New dependencies must be on approved list | Block PR |
| **Service boundaries respected** | No cross-service imports outside defined interfaces | Warn |
| **API versioning required** | All new endpoints must include version prefix | Block PR |
| **Max cyclomatic complexity** | Functions must not exceed complexity threshold of 15 | Warn |

**Compliance Checker:** Maps security findings and architectural violations to compliance framework requirements. For SOC 2 Type II, this includes evidence of: access control reviews, change management processes, vulnerability management, and incident response. For FedRAMP, additional controls around continuous monitoring and data classification are enforced. Every review decision is logged to an immutable audit trail.

**Report Generator:** Uses the LLM to synthesize findings from all analyzers into a human-readable PR comment. The report is structured as:

1. **Summary:** One-line verdict (Approved / Changes Requested / Blocked)
2. **Security Findings:** Categorized by severity (Critical / High / Medium / Low)
3. **Architecture Violations:** With explanations and suggested fixes
4. **Compliance Status:** Per-framework pass/fail
5. **Dependency Changes:** New, updated, or removed dependencies with risk assessment

### 7.4 Runtime View

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant Agent as Gatekeeper Agent
    participant SAST as SAST Tools
    participant Arch as Architecture Validator
    participant Comp as Compliance Checker

    Dev->>GH: Open Pull Request
    GH->>Agent: Webhook: PR opened
    Agent->>GH: Fetch PR diff + changed files
    Agent->>Agent: Diff Analyzer: Classify changes
    
    par Security Analysis
        Agent->>SAST: Run SAST scanners on changed files
        SAST-->>Agent: 2 findings (1 High, 1 Medium)
    and Architecture Check
        Agent->>Arch: Evaluate fitness functions
        Arch-->>Agent: 1 violation (new unversioned endpoint)
    and Compliance Check
        Agent->>Comp: Check against SOC 2 controls
        Comp-->>Agent: All controls satisfied ✓
    end
    
    Agent->>Agent: Report Generator: Synthesize findings
    Agent->>GH: Post review comment with findings
    Agent->>GH: Set CI status: "Changes Requested"
    Agent->>GH: Log review to audit trail
```

### 7.5 Cross-cutting Concepts

**False Positive Management:** False positives are the primary threat to adoption. If the Gatekeeper blocks too many PRs incorrectly, developers will lose trust and seek workarounds. The agent addresses this through: (1) a **confidence score** on each finding, with low-confidence findings presented as warnings rather than blockers, (2) a **feedback mechanism** where developers can mark findings as false positives, which trains the system over time, (3) **suppression rules** that allow teams to permanently suppress known false positives with documented justification.

**Override Mechanism:** For urgent situations (production hotfix, time-sensitive security patch), authorized engineers can override the Gatekeeper with a documented justification. Overrides are logged to the audit trail and trigger a follow-up review within 48 hours. The override mechanism is itself access-controlled — only engineers with the "security-reviewer" role can override.

**Audit Trail for Compliance:** Every review decision, finding, override, and developer response is logged to an immutable audit store. This provides the evidence chain required for SOC 2 Type II and FedRAMP audits. The audit trail includes: timestamp, PR identifier, reviewer (agent or human), findings, decision, and justification.

---


## 8. Implementation Strategy: Build vs. Buy

### 8.1 Framework Evaluation

The choice of technology stack for building the five agents is a critical architectural decision. We evaluated four major agentic AI frameworks and the option of building from scratch, assessing each against the requirements of a cybersecurity company: production reliability, debuggability, cost control, safety rails, and state management for long-running tasks.

| Framework | Version | Architecture | Production Readiness | Debuggability | Safety Rails | State Management |
|---|---|---|---|---|---|---|
| **LangChain / LangGraph** | 0.3.x / 0.2.x | Chain → Graph-based state machine | Medium — rapid API changes, abstraction overhead | Medium — graph visualization helps | Basic — requires custom implementation | LangGraph provides graph-based state |
| **AutoGen** (Microsoft) | 0.4.x | Conversational multi-agent | Low-Medium — emergent behavior hard to predict | Low — conversation traces are opaque | Basic — human-in-the-loop support | Limited — conversation history only |
| **CrewAI** | 0.x | Role-based agent orchestration | Low — early stage, rigid architecture | Low — role interactions are implicit | Basic — role constraints | Limited — task-level only |
| **Raw LLM APIs** + Custom | N/A | Custom orchestration | High — full control over behavior | High — custom logging and tracing | High — custom safety rails | Custom — requires engineering investment |
| **Temporal.io** | 1.x | Durable workflow orchestration | Very High — battle-tested at Uber, Netflix scale | Very High — full workflow visibility | High — timeout, retry, circuit breaker built-in | Excellent — durable state, automatic checkpointing |

### 8.2 Recommendation: Temporal.io + Custom Agentic Framework + Raw LLM APIs

For Abnormal.AI, the recommended stack is a **three-layer architecture**:

```mermaid
flowchart TD
    subgraph "Layer 1: Durable Orchestration"
        T[Temporal.io<br/>Workflow Engine]
    end
    subgraph "Layer 2: Agent Framework"
        AF[Custom Agent Framework<br/>ReAct Loop, Tool Interface, Memory]
    end
    subgraph "Layer 3: LLM Interface"
        LLM[Raw LLM APIs<br/>Claude 3.5 Sonnet / GPT-4o<br/>with fallback chain]
    end
    
    T --> AF
    AF --> LLM
    
    T -->|"Durable State"| DB[(PostgreSQL)]
    AF -->|"Tool Calls"| TOOLS[External Systems<br/>GitHub, AWS, Sentry, etc.]
    AF -->|"Embeddings"| VDB[(pgvector)]
    LLM -->|"Structured Output"| AF
```

**Layer 1 — Temporal.io (Durable Orchestration):** Each agent's workflow is implemented as a Temporal workflow. Temporal handles: durable execution (survives process crashes), automatic retries with configurable backoff, timeout enforcement, workflow versioning, and full observability via the Temporal Web UI. This is the foundation that makes the agents production-grade. Temporal is battle-tested at companies like Uber, Netflix, and Stripe for mission-critical workflows [13].

**Layer 2 — Custom Agent Framework (ReAct Loop, Tools, Memory):** A lightweight, custom-built framework that implements the ReAct pattern. Each agent is a Temporal workflow that alternates between "think" steps (LLM calls) and "act" steps (tool calls implemented as Temporal activities). The framework provides: unified tool interface with schema validation, memory management (short-term context + long-term vector store), safety rails (iteration limits, cost ceilings, scope restrictions), and structured logging for every decision and action.

**Layer 3 — Raw LLM APIs (with Fallback Chain):** Direct integration with LLM providers (Anthropic Claude, OpenAI GPT-4o) via their native APIs. No framework abstraction layer. This provides: maximum control over prompt engineering, ability to switch models per-task (cheap models for classification, capable models for reasoning), structured output parsing with Pydantic validation, and no vendor lock-in. The fallback chain ensures that if one provider is unavailable, the agent automatically falls back to an alternative.

### 8.3 Why Not LangChain/LangGraph?

LangChain is the most popular framework in the ecosystem, and LangGraph's graph-based state machine is architecturally sound. However, for a cybersecurity company, the concerns outweigh the benefits:

1. **Abstraction tax:** LangChain's many layers of abstraction make it difficult to understand exactly what is happening at the LLM API level. In a security context, this opacity is unacceptable.
2. **API instability:** The framework evolves rapidly with frequent breaking changes, creating maintenance burden.
3. **Debugging difficulty:** When something goes wrong in production, tracing through LangChain's abstraction layers to find the root cause is significantly harder than debugging direct API calls.
4. **Security surface area:** Every dependency is a potential attack vector. LangChain pulls in a large dependency tree that increases the security surface area.

LangGraph's state machine model is valuable, but Temporal provides the same capability with significantly better durability, observability, and production track record.

### 8.4 Why Not AutoGen or CrewAI?

**AutoGen's** conversational multi-agent approach introduces emergent behavior that is difficult to predict, test, and debug. In a security-critical environment, unpredictable agent behavior is a non-starter. The framework also lacks the durable execution guarantees needed for long-running tasks.

**CrewAI's** role-based approach is intuitive for demos but too rigid for production use. The framework is early-stage, with limited community support and no proven production deployments at enterprise scale.

---

## 9. Risk Assessment & Mitigation

### 9.1 Critical Risk Matrix

The deployment of autonomous agents that can read code, execute commands, and create pull requests introduces significant risks. The following matrix identifies the top risks and their mitigations:

| Risk | Severity | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **LLM Hallucination in Code** | Critical | High | Multi-layer validation: SAST scan, test execution, human review before merge. RAG grounding for all code generation. Dependency verification against trusted registries. |
| **Agent Drift in Long-Running Tasks** | High | Medium | Temporal checkpointing, periodic goal re-validation, max iteration limits, human-on-the-loop monitoring dashboards. |
| **Context Window Exhaustion** | Medium | High | RAG for long-term memory, aggressive context pruning, conversation summarization, tiered model selection. |
| **Cost Explosion (Token Usage)** | High | Medium | Per-task cost ceilings ($5-$10), tiered model strategy, caching of repeated queries, token usage dashboards with alerts. |
| **Security Breach via Agent** | Critical | Low | Principle of least privilege, sandbox isolation, no production write access, all merges require human approval, audit logging. |
| **Infinite Agent Loops** | High | Medium | Hard iteration limits (15 per task), circuit breaker pattern (3 consecutive failures → stop), watchdog process monitoring. |
| **Supply Chain Attack via Hallucinated Packages** | Critical | Medium | Dependency allowlist, package verification against trusted registries, SBOM generation, "slopsquatting" detection [14]. |
| **Demo-to-Production Gap** | High | High | Realistic staging environment, chaos testing, gradual rollout with canary deployments, continuous monitoring. |

### 9.2 Hallucination Mitigation Architecture

Hallucination in code generation is the highest-impact risk. The mitigation architecture uses a **defense-in-depth** approach:

```mermaid
flowchart TD
    LLM[LLM Generates Code] --> RAG{RAG Grounding<br/>Check against<br/>known patterns}
    RAG -->|Grounded| SAST[SAST Scan<br/>Semgrep, Bandit]
    RAG -->|Not Grounded| REJECT[Reject + Retry<br/>with more context]
    SAST -->|Clean| DEP[Dependency Check<br/>Verify all imports<br/>against allowlist]
    SAST -->|Findings| FIX[Auto-fix or<br/>Flag for human]
    DEP -->|Verified| TEST[Test Execution<br/>Full suite + generated tests]
    DEP -->|Unknown Package| BLOCK[Block + Alert<br/>Possible hallucination]
    TEST -->|Pass| HUMAN[Human Review<br/>Required before merge]
    TEST -->|Fail| ITERATE[Feed failure<br/>back to LLM]
```

### 9.3 Human-on-the-Loop vs. Human-in-the-Loop

The agents are designed with a **human-on-the-loop** model by default, with escalation to **human-in-the-loop** for high-risk operations:

| Operation Type | Oversight Model | Examples |
|---|---|---|
| **Read-only analysis** | Human-on-the-loop (monitoring dashboard) | Log analysis, code reading, coverage analysis |
| **Code generation** | Human-in-the-loop (PR review required) | Fix generation, test generation, scaffolding |
| **Dependency changes** | Human-in-the-loop (explicit approval) | Dependency updates, new package additions |
| **Infrastructure changes** | Human-in-the-loop (Terraform plan review) | IaC generation, infrastructure provisioning |
| **Production interaction** | Blocked by design | Agents never have production write access |

### 9.4 Security Implications of Agents Writing Code

Letting AI agents write code in a cybersecurity company requires careful consideration of the attack surface:

**Prompt Injection:** An attacker could craft malicious content in error messages, log entries, or code comments that, when processed by the agent, causes it to take unintended actions. Mitigation: input sanitization, output validation, and sandboxed execution for all agent-generated code.

**Supply Chain via Hallucination ("Slopsquatting"):** LLMs can hallucinate package names that don't exist. Attackers can register these names with malicious code [14]. Mitigation: strict dependency allowlist, package verification against trusted registries, and SBOM generation for all agent-created code.

**Privilege Escalation:** An agent with broad tool access could be tricked into escalating its own privileges. Mitigation: principle of least privilege, separate service accounts per agent, no ability to modify IAM policies or security group rules.

---

## 10. First 90 Days Roadmap

### Phase 1: Foundation (Days 1-30)

| Week | Milestone | Deliverable |
|---|---|---|
| 1-2 | **Infrastructure Setup** | Temporal cluster deployed, PostgreSQL + pgvector provisioned, Docker sandbox infrastructure |
| 2-3 | **Custom Framework v0.1** | ReAct loop engine, tool interface abstraction, basic memory (context window only) |
| 3-4 | **Gatekeeper Agent MVP** | SAST integration (Semgrep), dependency scanning, basic PR commenting |

The Gatekeeper is the first agent to deploy because it is **read-only** (analyzes PRs, does not generate code), making it the lowest-risk starting point. It also provides immediate value by automating the mechanical aspects of security review.

### Phase 2: Expansion (Days 31-60)

| Week | Milestone | Deliverable |
|---|---|---|
| 5-6 | **Janitor Agent MVP** | Dependency update automation, dead code detection, atomic PR creation |
| 6-7 | **Auto-Triage Agent MVP** | Sentry/PagerDuty integration, log analysis, root cause hypothesis (no fix generation yet) |
| 7-8 | **Long-term Memory** | pgvector integration, RAG pipeline for runbooks and past incidents |

The Janitor is second because dependency updates are well-understood, low-risk operations with clear success criteria. The Auto-Triage Agent starts in **analysis-only mode** — it investigates and reports but does not generate fixes.

### Phase 3: Maturation (Days 61-90)

| Week | Milestone | Deliverable |
|---|---|---|
| 9-10 | **Mirror Agent MVP** | Unit test generation for Python, coverage-driven loop, mutation testing validation |
| 10-11 | **Auto-Triage Fix Generation** | Sandbox-based fix generation, PR creation for simple fixes |
| 11-12 | **Scaffolder Agent MVP** | Python/FastAPI service scaffolding, Terraform generation, security baselines |

The Mirror and Scaffolder agents are deployed last because they generate the most code and require the most validation infrastructure.

### Success Metrics

| Metric | Baseline (Day 0) | Target (Day 90) |
|---|---|---|
| **MTTR (Mean Time to Resolution)** | 4 hours | 1 hour (Auto-Triage) |
| **Test Coverage** | 65% | 80% (Mirror Agent) |
| **Service Creation Time** | 3 days | 30 minutes (Scaffolder) |
| **Security Review Turnaround** | 2 days | 2 hours (Gatekeeper) |
| **Dependency Currency** | 60% up-to-date | 95% up-to-date (Janitor) |

---

## 11. References

[1] arc42. "arc42 Template Overview." https://arc42.org/overview

[2] Yao, S., Zhao, J., Yu, D., et al. "ReAct: Synergizing Reasoning and Acting in Language Models." arXiv:2210.03629, 2022. https://arxiv.org/abs/2210.03629

[3] Incredibuild. "How Much Does Context-Switching Cost Your Dev Team?" https://www.incredibuild.com/blog/how-much-does-context-switching-cost-your-dev-team

[4] CrowdStrike Engineering Blog. Internal Developer Platform practices. https://www.crowdstrike.com/engineering/

[5] Palo Alto Networks. "Paved Roads" developer experience philosophy. https://www.paloaltonetworks.com/

[6] SentinelOne. Data-driven engineering culture. https://www.sentinelone.com/

[7] OutSight AI. "The Truth About AI-Generated Unit Tests: Why Coverage Lies and Mutations Don't." Medium, 2025. https://medium.com/@outsightai/the-truth-about-ai-generated-unit-tests-why-coverage-lies-and-mutations-dont-fcd5b5f6a267

[8] Copier. "A library and CLI app for rendering project templates." https://copier.readthedocs.io/

[9] OpenRewrite. "Automated mass refactoring of source code." https://github.com/openrewrite/rewrite

[10] Sourcery. "AI Code Reviews." https://sourcery.ai/

[11] mypy Documentation. "Using mypy with an existing codebase." https://mypy.readthedocs.io/en/stable/existing_code.html

[12] ThoughtWorks. "Architectural Fitness Functions." Building Evolutionary Architectures, O'Reilly Media.

[13] Temporal.io. "Temporal: Durable Execution." https://temporal.io/

[14] Snyk. "Package Hallucination: Impacts and Mitigation — When AI Creates Phantom Packages." https://snyk.io/articles/package-hallucinations/

[15] PagerDuty. "AIOps." https://www.pagerduty.com/platform/aiops/

[16] Datadog. "Incident AI." https://docs.datadoghq.com/incident_response/incident_management/incident_ai/

[17] Rootly. "Introducing Six Rootly AI Features." https://rootly.com/blog/introducing-six-rootly-ai-features-focus-on-the-incident-leave-the-paperwork-to-us

[18] Alshahwan, N., et al. "Automated Unit Test Improvement using Large Language Models at Meta." arXiv:2402.09171, 2024.

[19] Diffblue. "Diffblue Cover — AI Agent for Java Unit Test Generation." https://www.diffblue.com/

[20] Qodo. "AI Code Review — Deploy with Confidence." https://www.qodo.ai/

[21] AWS. "Build Durable AI Agents with LangGraph and Amazon DynamoDB." AWS Blog, 2026. https://aws.amazon.com/blogs/database/build-durable-ai-agents-with-langgraph-and-amazon-dynamodb/

[22] Microsoft. "From Runtime Risk to Real-Time Defense: Securing AI Agents." Microsoft Security Blog, 2026. https://www.microsoft.com/en-us/security/blog/2026/01/23/runtime-risk-realtime-defense-securing-ai-agents/

[23] Google Cloud. "Choose a Design Pattern for Your Agentic AI System." https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system

[24] Lumenalta. "8 Tactics to Reduce Context Drift with Parallel AI Agents." 2025. https://lumenalta.com/insights/8-tactics-to-reduce-context-drift-with-parallel-ai-agents

---

*This document was produced by Manus AI, acting in the role of Principal Staff Engineer / AI-Native Systems Architect. All architectural decisions are grounded in established patterns (ReAct, RAG, Chain-of-Thought) and informed by engineering practices at companies including Uber, Netflix, Anthropic, and Meta. The "Would a Senior Engineer actually build it this way?" test has been applied throughout — every component described here is designed for production reliability, not demo impressiveness.*
