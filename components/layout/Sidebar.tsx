import { TableOfContents } from "@/components/content/TableOfContents";
import { NewsletterCTA } from "@/components/content/NewsletterCTA";
import type { Heading } from "@/lib/types";

interface SidebarProps {
  headings: Heading[];
}

export function Sidebar({ headings }: SidebarProps) {
  return (
    <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
      <div className="sticky top-24 space-y-8">
        {headings.length > 0 && <TableOfContents headings={headings} />}
        <NewsletterCTA variant="compact" />
      </div>
    </aside>
  );
}
