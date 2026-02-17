import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers, Shield, Zap, GitBranch } from "lucide-react";
import type { Agent } from "@/lib/data";
import MermaidDiagram from "./MermaidDiagram";

interface AgentCardProps {
  agent: Agent;
  index: number;
}

type TabId = "overview" | "architecture" | "safety" | "runtime";

export default function AgentCard({ agent, index }: AgentCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [expanded, setExpanded] = useState(false);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "architecture", label: "Architecture", icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: "safety", label: "Safety Rails", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "runtime", label: "Runtime", icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-xl border ${agent.borderColor} bg-card/80 backdrop-blur-sm overflow-hidden`}
    >
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 opacity-20">
          <img src={agent.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/70" />
        </div>
        <div className="relative p-6 lg:p-8">
          <div className="flex items-start gap-6">
            <div
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden flex-shrink-0 border"
              style={{ borderColor: `${agent.color}40` }}
            >
              <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="text-xs font-mono font-medium px-2 py-0.5 rounded"
                  style={{ color: agent.color, backgroundColor: `${agent.color}15` }}
                >
                  AGENT {agent.number}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {agent.bottleneck}
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                {agent.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{agent.subtitle}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{agent.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-border/30">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setExpanded(true); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id && expanded
                  ? "border-current text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground/70"
              }`}
              style={activeTab === tab.id && expanded ? { color: agent.color } : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 lg:p-8 border-t border-border/20">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-display font-semibold text-foreground mb-3">Building Blocks</h4>
                    <div className="grid gap-3">
                      {agent.buildingBlocks.map((block, i) => (
                        <div key={i} className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: agent.color }} />
                            <span className="text-sm font-medium text-foreground">{block.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed ml-3.5">{block.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-foreground mb-3">Integrations</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">System</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Type</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Purpose</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agent.integrations.map((int, i) => (
                            <tr key={i} className="border-b border-border/10">
                              <td className="py-2 px-3 font-mono" style={{ color: agent.color }}>{int.system}</td>
                              <td className="py-2 px-3 text-foreground/70">{int.type}</td>
                              <td className="py-2 px-3 text-foreground/70">{int.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "architecture" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-display font-semibold text-foreground">Context View</h4>
                  <MermaidDiagram chart={agent.mermaidContext} title={`${agent.name} — Context Diagram`} />
                  <div className="mt-4">
                    <h4 className="text-sm font-display font-semibold text-foreground mb-2">Cross-cutting Concepts</h4>
                    <ul className="space-y-2">
                      {agent.crossCutting.map((concept, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                          <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: agent.color }} />
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "safety" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Mechanism</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Implementation</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Threshold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agent.safetyRails.map((rail, i) => (
                        <tr key={i} className="border-b border-border/10">
                          <td className="py-2.5 px-3 font-medium text-foreground">{rail.mechanism}</td>
                          <td className="py-2.5 px-3 text-foreground/70">{rail.implementation}</td>
                          <td className="py-2.5 px-3 font-mono text-foreground/60">{rail.threshold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "runtime" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-display font-semibold text-foreground">Runtime Sequence</h4>
                  <MermaidDiagram chart={agent.mermaidRuntime} title={`${agent.name} — Runtime Sequence`} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
