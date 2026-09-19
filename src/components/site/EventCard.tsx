import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatEventDate, formatEventDateShort } from "@/lib/format";
import { Clock, MapPin } from "lucide-react";

export function EventCard({ event }: { event: Doc<"events"> }) {
  const short = formatEventDateShort(event.date);

  return (
    <Card className="group flex h-full flex-col gap-4 rounded-3xl border-border/70 p-5 shadow-none transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <span className="font-display text-xl font-semibold leading-none">
            {short.day}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide">
            {short.month}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <Badge
            variant="secondary"
            className="rounded-full text-[11px] font-bold uppercase tracking-wide"
          >
            {event.category ?? "Umum"}
          </Badge>
          <h3 className="mt-2 font-display text-lg font-semibold leading-snug">
            {event.title}
          </h3>
        </div>
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
        {event.description}
      </p>

      <div className="mt-auto space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">
          {formatEventDate(event.date)}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {event.time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              {event.time}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
