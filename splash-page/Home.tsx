import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, ArrowRight, BookOpen, Calendar, ChevronRight,
  ExternalLink, Layers, Menu, Shield, Target, X, Zap
} from "lucide-react";
import AgentCard from "@/components/AgentCard";
import MermaidDiagram from "@/components/MermaidDiagram";
import {
  agents, painPoints, frameworkComparison, riskMatrix,
  roadmap, successMetrics, tocSections, IMAGES
} from "@/lib/data";

function SeverityBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Critical: "bg-red-500/15 text-red-400 border-red-500/30",
    High: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    Low: "bg-green-500/15 text-green-400 border-green-500/30",
  };
  return (
    <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${colors[level] || "bg-muted text-muted-foreground border-border"}`}>
      {level}
    </span>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("executive-summary");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    tocSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-sm text-foreground hidden sm:block">
              Agentic DevOps Architecture
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            {tocSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeSection === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {tocSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === s.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs mr-2 opacity-50">{s.number}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-mono text-primary/80 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                Arc42 Architecture Dossier
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                February 2026
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.1] mb-6">
              Agentic DevOps &<br />
              <span className="text-primary">DevEx Architecture</span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl leading-relaxed mb-8">
              Five autonomous AI agents designed to eliminate friction in the
              Plan → Code → Test lifecycle for Abnormal.AI's Python/Go/AWS-native
              engineering organization.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("agents")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Explore the Agents <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo("roadmap")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border/50 text-foreground/80 rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                <Calendar className="w-4 h-4" /> 90-Day Roadmap
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pb-24 space-y-24">

        {/* Executive Summary */}
        <section id="executive-summary">
          <SectionHeader number="01" title="Executive Summary" />
          <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm leading-relaxed text-foreground/80">
                The central thesis of this dossier is that the primary bottleneck in modern software engineering
                is no longer code generation — which is largely solved by current-generation LLMs — but rather
                <strong className="text-foreground"> context integration, deterministic validation, and safe execution</strong>.
                The "Agentic" layer proposed here sits between the developer's intent and the CI/CD pipeline,
                functioning as a sandboxed operating system for engineering workflows.
              </p>
            </div>

            <div className="rounded-xl border border-border/30 bg-card/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/20">
                <h3 className="text-sm font-display font-semibold text-foreground">The Five Agents at a Glance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/20 bg-secondary/20">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Agent</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Primary Function</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Bottleneck Addressed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((a) => (
                      <tr key={a.id} className="border-b border-border/10 hover:bg-secondary/10 transition-colors">
                        <td className="py-3 px-4 font-mono" style={{ color: a.color }}>{a.number}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{a.name}</td>
                        <td className="py-3 px-4 text-foreground/70">{a.subtitle}</td>
                        <td className="py-3 px-4 text-foreground/60">{a.bottleneck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-400 mb-1">Terminology Clarification</p>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    This report is strictly about <strong className="text-foreground">Agents</strong> (autonomous actors that
                    initiate workflows, use tools, and operate in loops) — not <strong className="text-foreground">Copilots</strong> (assistants
                    that respond to human prompts). An agent detects an error and fixes it. A copilot waits for you to ask about the error.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section id="pain-points">
          <SectionHeader number="02" title="Pain Point & Opportunity Analysis" />
          <div className="space-y-6">
            <p className="text-sm text-foreground/70 leading-relaxed">
              Developers spend only <strong className="text-foreground">32% of their time actually writing code</strong>.
              The remaining 68% is consumed by context switching, waiting for builds, triaging alerts, writing tests,
              and navigating organizational processes. In a cybersecurity context, this overhead is amplified by
              security reviews, compliance checks, and the heightened consequences of shipping vulnerabilities.
            </p>

            <div className="grid gap-3">
              {painPoints.map((p) => (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: p.rank * 0.08 }}
                  className="rounded-lg border border-border/30 bg-card/50 p-4 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-primary">{p.rank}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{p.friction}</span>
                      <SeverityBadge level={p.impact} />
                    </div>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                    <span className="text-[10px] font-mono text-primary/70 mt-1 inline-block">{p.timeWaste}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-xl border border-border/30 bg-card/50 p-6">
              <h3 className="text-sm font-display font-semibold text-foreground mb-3">Lessons from Industry Leaders</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { name: "CrowdStrike", approach: "Frictionless developer platform with standardized service scaffolding and high-performance CI/CD." },
                  { name: "Palo Alto Networks", approach: '"Paved roads" philosophy — pre-approved paths that enforce security while minimizing friction.' },
                  { name: "SentinelOne", approach: "Data-driven engineering culture tracking metrics from developer productivity to CI/CD performance." },
                ].map((company) => (
                  <div key={company.name} className="rounded-lg border border-border/20 bg-secondary/20 p-4">
                    <p className="text-xs font-medium text-foreground mb-1">{company.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{company.approach}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Agents */}
        <section id="agents">
          <SectionHeader number="03" title="The Five Agents" />
          <div className="space-y-8">
            {agents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </section>

        {/* Implementation Strategy */}
        <section id="implementation">
          <SectionHeader number="04" title="Implementation Strategy: Build vs. Buy" />
          <div className="space-y-6">
            <div className="rounded-xl border border-border/30 bg-card/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/20">
                <h3 className="text-sm font-display font-semibold text-foreground">Framework Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/20 bg-secondary/20">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Framework</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Production</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Debug</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Safety</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frameworkComparison.map((f, i) => (
                      <tr
                        key={i}
                        className={`border-b border-border/10 ${
                          f.name.includes("Temporal") ? "bg-emerald-500/5" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-foreground">
                          {f.name}
                          {f.name.includes("Temporal") && (
                            <span className="ml-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              RECOMMENDED
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-foreground/70">{f.production}</td>
                        <td className="py-3 px-4 text-foreground/70">{f.debuggability}</td>
                        <td className="py-3 px-4 text-foreground/70">{f.safety}</td>
                        <td className="py-3 px-4 text-foreground/60 hidden lg:table-cell">{f.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <h3 className="text-sm font-display font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Recommended Stack: Three-Layer Architecture
              </h3>
              <MermaidDiagram
                chart={`flowchart TD
    subgraph L1[Layer 1: Durable Orchestration]
        T[Temporal.io]
    end
    subgraph L2[Layer 2: Agent Framework]
        AF[Custom ReAct Framework]
    end
    subgraph L3[Layer 3: LLM Interface]
        LLM[Raw APIs: Claude / GPT-4o]
    end
    T --> AF
    AF --> LLM
    T -->|State| DB[(PostgreSQL)]
    AF -->|Tools| EXT[External Systems]
    AF -->|Embeddings| VDB[(pgvector)]`}
                title="Recommended Architecture Stack"
              />
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/20 bg-secondary/20 p-3">
                  <p className="text-[10px] font-mono text-emerald-400 mb-1">LAYER 1</p>
                  <p className="text-xs font-medium text-foreground">Temporal.io</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Durable execution, automatic retries, workflow versioning, full observability</p>
                </div>
                <div className="rounded-lg border border-border/20 bg-secondary/20 p-3">
                  <p className="text-[10px] font-mono text-emerald-400 mb-1">LAYER 2</p>
                  <p className="text-xs font-medium text-foreground">Custom Framework</p>
                  <p className="text-[11px] text-muted-foreground mt-1">ReAct loop, unified tool interface, memory management, safety rails</p>
                </div>
                <div className="rounded-lg border border-border/20 bg-secondary/20 p-3">
                  <p className="text-[10px] font-mono text-emerald-400 mb-1">LAYER 3</p>
                  <p className="text-xs font-medium text-foreground">Raw LLM APIs</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Maximum control, per-task model selection, structured output, no vendor lock-in</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Assessment */}
        <section id="risks">
          <SectionHeader number="05" title="Risk Assessment & Mitigation" />
          <div className="space-y-6">
            <div className="rounded-xl border border-border/30 bg-card/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/20">
                <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Critical Risk Matrix
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/20 bg-secondary/20">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Risk</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Severity</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Likelihood</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Mitigation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskMatrix.map((r, i) => (
                      <tr key={i} className="border-b border-border/10">
                        <td className="py-3 px-4 font-medium text-foreground">{r.risk}</td>
                        <td className="py-3 px-4"><SeverityBadge level={r.severity} /></td>
                        <td className="py-3 px-4"><SeverityBadge level={r.likelihood} /></td>
                        <td className="py-3 px-4 text-foreground/60 hidden md:table-cell max-w-xs">{r.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-display font-semibold text-foreground mb-3">Hallucination Mitigation Architecture</h3>
              <MermaidDiagram
                chart={`flowchart TD
    LLM[LLM Generates Code] --> RAG{RAG Grounding}
    RAG -->|Grounded| SAST[SAST Scan]
    RAG -->|Not Grounded| REJECT[Reject + Retry]
    SAST -->|Clean| DEP[Dependency Check]
    SAST -->|Findings| FIX[Auto-fix or Flag]
    DEP -->|Verified| TEST[Test Execution]
    DEP -->|Unknown Pkg| BLOCK[Block + Alert]
    TEST -->|Pass| HUMAN[Human Review]
    TEST -->|Fail| ITERATE[Feed back to LLM]`}
                title="Defense-in-Depth Validation Pipeline"
              />
            </div>

            <div className="rounded-xl border border-border/30 bg-card/50 p-6">
              <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Human-on-the-Loop vs. Human-in-the-Loop
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/20">
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Operation</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Oversight Model</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { op: "Read-only analysis", model: "Human-on-the-loop", ex: "Log analysis, code reading" },
                      { op: "Code generation", model: "Human-in-the-loop", ex: "Fix gen, test gen, scaffolding" },
                      { op: "Dependency changes", model: "Human-in-the-loop", ex: "Updates, new packages" },
                      { op: "Infrastructure changes", model: "Human-in-the-loop", ex: "IaC gen, provisioning" },
                      { op: "Production interaction", model: "Blocked by design", ex: "Never — no write access" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/10">
                        <td className="py-2.5 px-3 font-medium text-foreground">{row.op}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            row.model.includes("Blocked") ? "bg-red-500/10 text-red-400" :
                            row.model.includes("in-the") ? "bg-amber-500/10 text-amber-400" :
                            "bg-emerald-500/10 text-emerald-400"
                          }`}>{row.model}</span>
                        </td>
                        <td className="py-2.5 px-3 text-foreground/60">{row.ex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap">
          <SectionHeader number="06" title="First 90 Days Roadmap" />
          <div className="space-y-6">
            {roadmap.map((phase, pi) => (
              <motion.div
                key={pi}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pi * 0.15 }}
                className="rounded-xl border border-border/30 bg-card/50 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border/20 flex items-center justify-between">
                  <h3 className="text-sm font-display font-semibold text-foreground">{phase.phase}</h3>
                  <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-2 py-0.5 rounded">{phase.days}</span>
                </div>
                <div className="divide-y divide-border/10">
                  {phase.milestones.map((m, mi) => (
                    <div key={mi} className="px-6 py-4 flex items-start gap-4">
                      <div className="w-12 text-center flex-shrink-0">
                        <span className="text-[10px] font-mono text-muted-foreground">Week</span>
                        <p className="text-sm font-mono font-bold text-primary">{m.week}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.milestone}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.deliverable}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-primary/10">
                <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Success Metrics
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Metric</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Baseline</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Target (Day 90)</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {successMetrics.map((m, i) => (
                      <tr key={i} className="border-b border-primary/5">
                        <td className="py-3 px-4 font-medium text-foreground">{m.metric}</td>
                        <td className="py-3 px-4 font-mono text-red-400/70">{m.baseline}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400">{m.target}</td>
                        <td className="py-3 px-4 text-foreground/60">{m.agent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* References */}
        <section id="references">
          <SectionHeader number="07" title="References" />
          <div className="rounded-xl border border-border/30 bg-card/50 p-6">
            <div className="grid gap-2">
              {[
                { num: 1, text: "arc42 Template Overview", url: "https://arc42.org/overview" },
                { num: 2, text: "Yao et al. — ReAct: Synergizing Reasoning and Acting in Language Models (2022)", url: "https://arxiv.org/abs/2210.03629" },
                { num: 3, text: "Incredibuild — How Much Does Context-Switching Cost Your Dev Team?", url: "https://www.incredibuild.com/blog/how-much-does-context-switching-cost-your-dev-team" },
                { num: 4, text: "CrowdStrike Engineering Blog", url: "https://www.crowdstrike.com/engineering/" },
                { num: 5, text: "Palo Alto Networks — Paved Roads Philosophy", url: "https://www.paloaltonetworks.com/" },
                { num: 6, text: "SentinelOne — Data-driven Engineering Culture", url: "https://www.sentinelone.com/" },
                { num: 7, text: "OutSight AI — The Truth About AI-Generated Unit Tests", url: "https://medium.com/@outsightai/" },
                { num: 8, text: "Copier — Project Template Rendering Library", url: "https://copier.readthedocs.io/" },
                { num: 9, text: "OpenRewrite — Automated Mass Refactoring", url: "https://github.com/openrewrite/rewrite" },
                { num: 10, text: "Sourcery — AI Code Reviews", url: "https://sourcery.ai/" },
                { num: 11, text: "mypy — Using mypy with an Existing Codebase", url: "https://mypy.readthedocs.io/en/stable/existing_code.html" },
                { num: 12, text: "ThoughtWorks — Architectural Fitness Functions", url: "#" },
                { num: 13, text: "Temporal.io — Durable Execution", url: "https://temporal.io/" },
                { num: 14, text: "Snyk — Package Hallucination: When AI Creates Phantom Packages", url: "https://snyk.io/articles/package-hallucinations/" },
              ].map((ref) => (
                <a
                  key={ref.num}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors group"
                >
                  <span className="text-[10px] font-mono text-primary/60 mt-0.5 w-5 text-right flex-shrink-0">[{ref.num}]</span>
                  <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors">{ref.text}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/50 group-hover:text-primary mt-0.5 flex-shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/20 pt-8">
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              This document was produced by Manus AI, acting in the role of Principal Staff Engineer / AI-Native Systems Architect.
              All architectural decisions are grounded in established patterns (ReAct, RAG, Chain-of-Thought) and informed by
              engineering practices at companies including Uber, Netflix, Anthropic, and Meta.
            </p>
            <p className="text-[10px] text-muted-foreground/50 mt-4 font-mono">
              Arc42 Architecture Dossier — February 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 mb-8"
    >
      <span className="text-4xl lg:text-5xl font-display font-bold text-primary/15">{number}</span>
      <div>
        <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground">{title}</h2>
        <div className="h-0.5 w-12 bg-primary/40 mt-2 rounded-full" />
      </div>
    </motion.div>
  );
}
