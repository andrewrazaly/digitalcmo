export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted ${className}`}>
      This article contains affiliate links. We may earn a commission at no
      extra cost to you when you purchase through our recommendations.
    </p>
  );
}
