import { ContentEmpty } from "@/components/site/ContentStates";
import { EventCard } from "@/components/site/EventCard";
import { PageContainer, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { todayIso } from "@/lib/format";
import { useQuery } from "convex/react";
import { CalendarHeart, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type Filter = "semua" | "akan-datang" | "selesai";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "akan-datang", label: "Akan datang" },
  { value: "selesai", label: "Sudah lewat" },
];

export default function Kegiatan() {
  const events = useQuery(api.orsika.listEvents);
  const [filter, setFilter] = useState<Filter>("semua");
  const today = todayIso();

  const filtered = useMemo(() => {
    const list = events ?? [];
    if (filter === "akan-datang") return list.filter((e) => e.date >= today);
    if (filter === "selesai") return list.filter((e) => e.date < today);
    return list;
  }, [events, filter, today]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Agenda OSIS"
        title="Seluruh Kegiatan & Agenda"
        description="Temukan kegiatan yang sedang berjalan maupun yang sudah terlaksana. Semua jadwal di bawah ini masih berupa data contoh dan akan diperbarui oleh pengurus."
      >
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={filter === item.value ? "default" : "outline"}
              className="rounded-full"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </PageHero>

      <PageContainer className="py-14">
        {events === undefined ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="h-64 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <ContentEmpty
            icon={CalendarHeart}
            title={
              filter === "semua"
                ? "Belum ada kegiatan"
                : "Tidak ada kegiatan pada kategori ini"
            }
            description="Coba pilih kategori lain, atau kembali lagi setelah pengurus menambahkan agenda baru."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        <Card className="mt-14 flex flex-col items-start gap-4 rounded-3xl border-border/70 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Punya usulan kegiatan?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Kirimkan ide acara atau masukan lewat formulir aspirasi.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/aspirasi">
              <Megaphone className="size-4" />
              Kirim Aspirasi
            </Link>
          </Button>
        </Card>
      </PageContainer>
    </SiteLayout>
  );
}
