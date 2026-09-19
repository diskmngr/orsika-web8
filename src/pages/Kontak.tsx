import { PageContainer, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Instagram, Mail, MapPin, Megaphone } from "lucide-react";
import { Link } from "react-router";

const CONTACTS = [
  {
    icon: MapPin,
    title: "Ruang OSIS",
    lines: ["Gedung Sekolah, lantai 1", "Alamat lengkap menyusul (contoh)"],
  },
  {
    icon: Mail,
    title: "Surel",
    lines: ["osiss@contoh.sch.id", "Balasan dalam 1–2 hari sekolah (contoh)"],
  },
  {
    icon: Instagram,
    title: "Media sosial",
    lines: ["@orsika.contoh", "Info kegiatan harian (contoh)"],
  },
  {
    icon: Clock,
    title: "Jam layanan",
    lines: ["Senin–Jumat, 09.00–15.00", "Istirahat pertama dan kedua (contoh)"],
  },
];

export default function Kontak() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Kontak"
        title="Mari Terhubung"
        description="Punya pertanyaan, ingin bekerja sama, atau sekadar menyapa? Gunakan salah satu kanal di bawah ini. Semua detail kontak masih berupa contoh hingga data resmi tersedia."
      />

      <PageContainer className="space-y-12 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACTS.map((item) => (
            <Card
              key={item.title}
              className="rounded-3xl border-border/70 p-6 shadow-none"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">
                {item.title}
              </h2>
              <div className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
                {item.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col items-start gap-5 rounded-3xl border-border/70 bg-secondary/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Lebih suka menyampaikan langsung?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Gunakan formulir aspirasi agar masukanmu tercatat rapi dan dapat
              ditindaklanjuti oleh pengurus.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/aspirasi">
              <Megaphone className="size-4" />
              Buka Formulir Aspirasi
            </Link>
          </Button>
        </Card>
      </PageContainer>
    </SiteLayout>
  );
}
