import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#1e3a5f",
    primaryTextColor: "#e2e8f0",
    primaryBorderColor: "#3b82f6",
    lineColor: "#3b82f6",
    secondaryColor: "#1a2332",
    tertiaryColor: "#0f1923",
    background: "#0f1923",
    mainBkg: "#1e3a5f",
    nodeBorder: "#3b82f6",
    clusterBkg: "#0f1923",
    clusterBorder: "#1e3a5f",
    titleColor: "#e2e8f0",
    edgeLabelBackground: "#0f1923",
    actorBkg: "#1e3a5f",
    actorBorder: "#3b82f6",
    actorTextColor: "#e2e8f0",
    actorLineColor: "#3b82f6",
    signalColor: "#e2e8f0",
    signalTextColor: "#e2e8f0",
    labelBoxBkgColor: "#1e3a5f",
    labelBoxBorderColor: "#3b82f6",
    labelTextColor: "#e2e8f0",
    loopTextColor: "#e2e8f0",
    noteBkgColor: "#1a2332",
    noteTextColor: "#e2e8f0",
    noteBorderColor: "#3b82f6",
    activationBkgColor: "#1e3a5f",
    activationBorderColor: "#3b82f6",
    sequenceNumberColor: "#e2e8f0",
  },
  securityLevel: "loose",
  fontFamily: "'Space Grotesk', system-ui, sans-serif",
});

interface MermaidDiagramProps {
  chart: string;
  title?: string;
}

export default function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        setError(true);
      }
    };
    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/50 p-6 text-center text-muted-foreground text-sm">
        Diagram rendering unavailable
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-[oklch(0.12_0.01_250)] overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-[oklch(0.16_0.012_250)]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2">{title}</span>
        </div>
      )}
      <div ref={containerRef} className="mermaid-container p-6 flex justify-center overflow-x-auto" />
    </div>
  );
}
