import { TableOfContents } from "@/components/content/TableOfContents";
import type { Heading } from "@/lib/types";

interface SidebarProps {
  headings: Heading[];
}

export function Sidebar({ headings }: SidebarProps) {
  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0">
      <div className="sticky top-24">
        <TableOfContents headings={headings} />
      </div>
    </aside>
  );
}
