import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { formatEventDate, formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  CalendarHeart,
  Layers,
  Megaphone,
  Sparkles,
  Users,
} from "lucide-react";
import type { AdminSection } from "@/components/admin/AdminShell";

export function Overview({
  userName,
  onNavigate,
}: {
  userName: string;
  onNavigate: (section: AdminSection) => void;
}) {
  const events = useQuery(api.orsika.listEvents);
  const divisions = useQuery(api.orsika.listDivisions);
  const officers = useQuery(api.orsika.listOfficers);
  const aspirations = useQuery(api.orsika.listAspirations);

  const pending = (aspirations ?? []).filter((item) => item.status === "baru");
  const today = new Date().toISOString().slice(0, 10);
  const nextEvent = (events ?? []).find((event) => event.date >= today);

  const stats = [
    {
      label: "Kegiatan",
      value: events?.length ?? 0,
      icon: CalendarHeart,
      section: "kegiatan" as AdminSection,
    },
    {
      label: "Bidang",
      value: divisions?.length ?? 0,
      icon: Layers,
      section: "bidang" as AdminSection,
    },
    {
      label: "Pengurus",
      value: officers?.length ?? 0,
      icon: Users,
      section: "kepengurusan" as AdminSection,
    },
    {
      label: "Aspirasi baru",
      value: pending.length,
      icon: Megaphone,
      section: "aspirasi" as AdminSection,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-semibold text-primary">Panel pengurus</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Halo, {userName.split(" ")[0] || "Pengurus"} 👋
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Dari sini kamu bisa mengatur seluruh isi Orsika Web: kegiatan,
          kepengurusan, bidang, hingga membalas aspirasi warga sekolah.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => onNavigate(stat.section)}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="h-full rounded-3xl border-border/70 p-5 shadow-none transition-colors hover:border-primary/40 hover:bg-secondary/40">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </span>
              <p className="mt-4 font-display text-3xl font-semibold">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                {stat.label}
              </p>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/70 p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">
              Agenda terdekat
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => onNavigate("kegiatan")}
            >
              Kelola
              <ArrowRight className="size-4" />
            </Button>
          </div>
          {nextEvent ? (
            <div className="mt-4 rounded-2xl bg-secondary/50 p-4">
              <p className="font-semibold">{nextEvent.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatEventDate(nextEvent.date)}
                {nextEvent.location ? ` • ${nextEvent.location}` : ""}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Belum ada agenda mendatang. Tambahkan kegiatan baru dari menu
              Kelola Kegiatan.
            </p>
          )}
        </Card>

        <Card className="rounded-3xl border-border/70 p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">
              Aspirasi terbaru
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => onNavigate("aspirasi")}
            >
              Semua
              <ArrowRight className="size-4" />
            </Button>
          </div>
          {aspirations && aspirations.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {aspirations.slice(0, 3).map((item) => (
                <li
                  key={item._id}
                  className="rounded-2xl border border-border/60 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {item.author}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full text-[11px]",
                        item.status === "baru" && "bg-accent/30 text-accent-foreground",
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatTimestamp(item.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Belum ada aspirasi yang masuk.
            </p>
          )}
        </Card>
      </div>

      <Card className="flex flex-col gap-4 rounded-3xl border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">Isi masih berupa data contoh</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ganti kegiatan, pengurus, dan bidang contoh dengan informasi resmi
              sekolah kapan saja.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="shrink-0 rounded-full"
          onClick={() => onNavigate("kegiatan")}
        >
          Mulai dari kegiatan
        </Button>
      </Card>
    </div>
  );
}
