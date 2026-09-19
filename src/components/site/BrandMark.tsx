import { cn } from "@/lib/utils";

/** Wordmark Orsika Web: badge ceria + nama produk. */
export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
        <span className="font-display text-lg font-semibold leading-none">O</span>
        <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-background bg-accent" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Orsika
          <span className="ml-1 font-sans text-sm font-semibold text-muted-foreground">
            Web
          </span>
        </span>
      )}
    </span>
  );
}
