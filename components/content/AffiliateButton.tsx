import Link from "next/link";
import { getToolUrl } from "@/lib/affiliates";

interface AffiliateButtonProps {
  toolSlug: string;
  label?: string;
  className?: string;
}

export function AffiliateButton({
  toolSlug,
  label = "Visit site",
  className = "",
}: AffiliateButtonProps) {
  const href = getToolUrl(toolSlug);

  return (
    <Link
      href={href}
      target="_blank"
      rel="nofollow sponsored"
      className={
        className ||
        "my-4 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
      }
    >
      {label}
    </Link>
  );
}
