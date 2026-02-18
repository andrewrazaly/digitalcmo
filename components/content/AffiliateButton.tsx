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
        "inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      }
    >
      {label}
    </Link>
  );
}
