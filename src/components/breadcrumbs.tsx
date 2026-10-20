import Link from "next/link";
import { IconChevron } from "@/components/icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ești aici" className="text-xs text-ink-soft">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="link-underline">
            Acasă
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            <IconChevron width={12} height={12} className="text-muted" />
            {c.href ? (
              <Link href={c.href} className="link-underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-brand-navy">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
