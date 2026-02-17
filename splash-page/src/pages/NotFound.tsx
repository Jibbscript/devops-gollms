import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center blueprint-grid">
      <div className="text-center max-w-md px-6">
        <h1 className="text-7xl font-display font-bold text-primary glow-blue mb-4">
          404
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This page doesn't exist in the blueprint.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
