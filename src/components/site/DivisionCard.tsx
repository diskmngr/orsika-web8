import { Card } from "@/components/ui/card";
import type { Doc } from "@/convex/_generated/dataModel";

export function DivisionCard({
  division,
  members = 0,
}: {
  division: Doc<"divisions">;
  members?: number;
}) {
  return (
    <Card className="group flex h-full flex-col gap-3 rounded-3xl border-border/70 p-6 shadow-none transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/25 text-2xl"
        >
          {division.emoji ?? "✨"}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {division.name}
          </h3>
          {division.tagline && (
            <p className="text-sm font-semibold text-primary">
              {division.tagline}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        {division.description}
      </p>
      {members > 0 && (
        <p className="mt-auto pt-2 text-xs font-semibold text-muted-foreground">
          {members} pengurus terdaftar
        </p>
      )}
    </Card>
  );
}
