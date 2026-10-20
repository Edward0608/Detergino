import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function PageShell({ title, lead, children, narrow = true }: { title: string; lead?: string; children: ReactNode; narrow?: boolean }) {
  return (
    <div className="container-site pt-6">
      <Breadcrumbs items={[{ label: title }]} />
      <div className={narrow ? "max-w-3xl" : ""}>
        <h1 className="mt-6 text-3xl font-semibold leading-tight text-brand-navy md:text-4xl">{title}</h1>
        {lead && <p className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">{lead}</p>}
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink-soft md:text-base [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-brand-navy [&_strong]:text-ink [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4">{children}</div>
      </div>
    </div>
  );
}
