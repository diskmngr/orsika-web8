import { ContentEmpty } from "@/components/site/ContentStates";
import { DivisionCard } from "@/components/site/DivisionCard";
import {
  PageContainer,
  PageHero,
  SectionHeading,
  SiteLayout,
} from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { initials } from "@/lib/format";
import { useQuery } from "convex/react";
import { Layers } from "lucide-react";

export default function Divisi() {
  const divisions = useQuery(api.orsika.listDivisions);
  const officers = useQuery(api.orsika.listOfficers);

  const memberCounts = new Map<string, number>();
  for (const officer of officers ?? []) {
    if (!officer.division) continue;
    memberCounts.set(
      officer.division,
      (memberCounts.get(officer.division) ?? 0) + 1,
    );
  }

  const koordinators = (officers ?? []).filter((officer) => officer.division);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Bidang & Divisi"
        title="Semua Bidang di Dalam OSIS"
        description="Berikut daftar lengkap bidang yang menaungi program kerja OSIS. Nama dan deskripsi pada versi ini masih berupa contoh sehingga pengurus dapat menyesuaikannya."
      >
        <Badge variant="secondary" className="rounded-full">
          {divisions?.length ?? 0} bidang terdaftar
        </Badge>
      </PageHero>

      <PageContainer className="py-14">
        {divisions === undefined ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="h-52 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none"
              />
            ))}
          </div>
        ) : divisions.length === 0 ? (
          <ContentEmpty
            icon={Layers}
            title="Belum ada bidang"
            description="Pengurus belum menambahkan bidang apa pun. Tambahkan dari panel admin agar tampil di halaman ini."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((division) => (
              <DivisionCard
                key={division._id}
                division={division}
                members={memberCounts.get(division.name) ?? 0}
              />
            ))}
          </div>
        )}

        {koordinators.length > 0 && (
          <div className="mt-16">
            <SectionHeading
              eyebrow="Struktur"
              title="Koordinator Tiap Bidang"
              description="Nama-nama di bawah ini masih contoh dan akan diperbarui setelah susunan kepengurusan final ditetapkan."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {koordinators.map((officer) => (
                <Card
                  key={officer._id}
                  className="flex items-center gap-4 rounded-3xl border-border/70 p-5 shadow-none"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-base font-semibold text-primary"
                  >
                    {initials(officer.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{officer.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {officer.position}
                    </p>
                    <p className="truncate text-xs font-semibold text-primary">
                      {officer.division}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </SiteLayout>
  );
}
