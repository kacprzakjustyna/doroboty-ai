/* The brand is a wordmark, not a graphic mark: "DoRoboty" in Space Grotesk 700
   plus ".ai" in IBM Plex Mono 500, the one place orange letters appear in the
   header (--gui-accent-text-on-light, 4.8 : 1 on paper). */
export function BrandWord({ className = "" }: { className?: string }) {
  return (
    <span className={`brand__lockup ${className}`}>
      <span className="brand__word">DoRoboty</span>
      <span className="brand__tld">.ai</span>
    </span>
  );
}
