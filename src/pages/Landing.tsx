import { ContentEmpty } from "@/components/site/ContentStates";
import { DivisionCard } from "@/components/site/DivisionCard";
import { EventCard } from "@/components/site/EventCard";
import { PageContainer, SectionHeading } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { initials } from "@/lib/format";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  CalendarHeart,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const HIGHLIGHTS = [
  {
    icon: CalendarHeart,
    title: "Agenda yang selalu segar",
    description:
      "Setiap kegiatan OSIS muncul di halaman ini begitu pengurus menambahkannya, lengkap dengan tanggal dan lokasi.",
  },
  {
    icon: Sparkles,
    title: "Kenali tiap bidang",
    description:
      "Dari bidang keagamaan sampai lingkungan, semua punya ruang sendiri agar mudah dipahami warga sekolah.",
  },
  {
    icon: Megaphone,
    title: "Aspirasi didengar",
    description:
      "Sampaikan ide atau keluhan lewat formulir aspirasi, lalu pantau balasannya dari pengurus.",
  },
];

export default function Landing() {
  const events = useQuery(api.orsika.listEvents);
  const divisions = useQuery(api.orsika.listDivisions);
  const officers = useQuery(api.orsika.listOfficers);

  const upcoming = (events ?? []).slice(0, 3);
  const highlightedDivisions = (divisions ?? []).slice(0, 6);
  const nextEvent = upcoming[0];
  const chair = (officers ?? []).find(
    (officer) =>
      /ketua/i.test(officer.position) && !/wakil/i.test(officer.position),
  );
  const viceChair = (officers ?? []).find((officer) => /wakil/i.test(officer.position));

  return (
    <>
      {/* ------------------------------- Welcome ------------------------------ */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-dots opacity-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-accent/25 blur-3xl"
        />

        <PageContainer className="relative py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge className="rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide">
                Rumah digital OSIS sekolah
              </Badge>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Selamat Datang di{" "}
                <span className="text-primary">Orsika Web</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                Satu tempat yang ramah untuk mengenal kepengurusan OSIS,
                mengikuti setiap kegiatan, dan menyuarakan aspirasi warga
                sekolah tanpa ribet.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full shadow-sm">
                  <Link to="/kegiatan">
                    <CalendarHeart className="size-4" />
                    Lihat Agenda Kegiatan
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/divisi">Kenali Bidang Kami</Link>
                </Button>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                {[
                  { label: "Kegiatan", value: events?.length ?? 0 },
                  { label: "Bidang", value: divisions?.length ?? 0 },
                  { label: "Pengurus", value: officers?.length ?? 0 },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="font-display text-2xl font-semibold text-primary">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Decorative preview card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="animate-float absolute -left-6 top-6 hidden size-16 rotate-[-8deg] place-items-center rounded-3xl bg-card text-3xl shadow-lg sm:grid">
                🎉
              </div>
              <div className="animate-float-slow absolute -right-5 bottom-24 hidden size-14 rotate-[10deg] place-items-center rounded-3xl bg-card text-2xl shadow-lg sm:grid">
                📣
              </div>

              <Card className="rounded-[2rem] border-border/70 p-7 shadow-xl shadow-primary/5">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Agenda Terdekat
                </p>
                {nextEvent ? (
                  <>
                    <h2 className="mt-2 font-display text-2xl font-semibold leading-snug">
                      {nextEvent.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {nextEvent.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {nextEvent.category ?? "Umum"}
                      </Badge>
                      {nextEvent.location && (
                        <Badge variant="secondary" className="rounded-full">
                          {nextEvent.location}
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Belum ada kegiatan yang dijadwalkan. Pengurus dapat
                    menambahkannya kapan saja dari panel admin.
                  </p>
                )}

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/60 pt-5 text-center">
                  {["🎨", "⚽", "🕌"].map((emoji) => (
                    <span
                      key={emoji}
                      className="rounded-2xl bg-secondary/70 py-3 text-2xl"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* ------------------------------ Highlights ---------------------------- */}
      <section className="py-14">
        <PageContainer>
          <div className="grid gap-5 md:grid-cols-3">
            {HIGHLIGHTS.map((item, index) => (
              <motion.div key={item.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.08 }}>
                <Card className="h-full rounded-3xl border-border/70 p-6 shadow-none">
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ------------------------------ Kegiatan ------------------------------ */}
      <section id="kegiatan" className="scroll-mt-20 py-14">
        <PageContainer>
          <SectionHeading
            eyebrow="Agenda OSIS"
            title="Kegiatan yang Sedang Disiapkan"
            description="Berikut rangkuman kegiatan terdekat. Data di bawah ini masih berupa contoh dan dapat diperbarui oleh pengurus melalui panel admin."
            action={
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/kegiatan">Lihat semua kegiatan</Link>
              </Button>
            }
          />

          <div className="mt-10">
            {events === undefined ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className="h-64 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none"
                  />
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <ContentEmpty
                icon={CalendarHeart}
                title="Belum ada kegiatan"
                description="Pengurus belum menambahkan agenda apa pun. Kegiatan baru akan muncul di sini secara otomatis."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </PageContainer>
      </section>

      {/* ------------------------------- Bidang ------------------------------- */}
      <section className="py-14">
        <PageContainer>
          <SectionHeading
            eyebrow="Bidang & Divisi"
            title="Bidang-Bidang di Dalam OSIS"
            description="Setiap bidang punya fokus kerja masing-masing. Nama dan deskripsi di bawah ini masih contoh, jadi pengurus bisa menyesuaikannya."
            action={
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/divisi">Buka daftar lengkap</Link>
              </Button>
            }
          />

          <div className="mt-10">
            {divisions === undefined ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className="h-52 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none"
                  />
                ))}
              </div>
            ) : highlightedDivisions.length === 0 ? (
              <ContentEmpty
                icon={Sparkles}
                title="Belum ada bidang"
                description="Tambahkan bidang OSIS dari panel admin agar tampil di halaman ini."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {highlightedDivisions.map((division) => (
                  <DivisionCard key={division._id} division={division} />
                ))}
              </div>
            )}
          </div>
        </PageContainer>
      </section>

      {/* ------------------------------- Pesan -------------------------------- */}
      <section className="py-14">
        <PageContainer>
          <SectionHeading
            eyebrow="Sambutan"
            title="Pesan dari Ketua & Wakil Ketua"
            description="Sebuah sapaan singkat dari pengurus terpilih untuk seluruh warga sekolah."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[chair, viceChair].map((officer, index) => (
              <motion.div key={index} {...fadeUp}>
                <Card className="flex h-full flex-col gap-5 rounded-3xl border-border/70 p-7 shadow-none">
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/25 font-display text-xl font-semibold text-primary"
                    >
                      {officer ? initials(officer.name) : index === 0 ? "KT" : "WK"}
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold">
                        {officer?.name ?? "Nama menyusul"}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {officer?.position ??
                          (index === 0 ? "Ketua OSIS" : "Wakil Ketua OSIS")}
                      </p>
                    </div>
                  </div>
                  <p className="text-base leading-7 text-muted-foreground">
                    {officer?.message ??
                      "Teks sambutan akan tampil di sini setelah pengurus mengisinya melalui panel admin."}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ------------------------------ Aspirasi CTA -------------------------- */}
      <section className="py-14">
        <PageContainer>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 px-6 py-12 text-primary-foreground sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/10"
            />
            <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                  Suara kamu berarti
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Punya ide atau masukan untuk OSIS?
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/90">
                  Kirim aspirasi lewat formulir singkat. Pengurus akan membacanya
                  dan membalas melalui panel admin.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="rounded-full"
                  >
                    <Link to="/aspirasi">
                      <Megaphone className="size-4" />
                      Kirim Aspirasi
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  >
                    <Link to="/auth">
                      <LayoutDashboard className="size-4" />
                      Masuk sebagai Pengurus
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:justify-end">
                {[
                  { icon: Lightbulb, label: "Ide baru" },
                  { icon: Megaphone, label: "Masukan" },
                  { icon: Sparkles, label: "Pujian" },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm font-semibold backdrop-blur-sm"
                  >
                    <chip.icon className="size-4" />
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
