import { PageContainer, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { HeartHandshake, Target, Users, Eye } from "lucide-react";

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Ramah",
    description:
      "Kami ingin setiap warga sekolah merasa nyaman menyapa, bertanya, dan bekerja sama dengan pengurus.",
  },
  {
    icon: Target,
    title: "Terarah",
    description:
      "Setiap program memiliki tujuan yang jelas dan dapat dievaluasi bersama.",
  },
  {
    icon: Users,
    title: "Kolaboratif",
    description:
      "Keputusan diambil melalui musyawarah dengan melibatkan perwakilan kelas.",
  },
];

const TIMELINE = [
  {
    title: "Pembentukan kepengurusan",
    description:
      "Teks contoh. Jelaskan proses pemilihan atau penetapan pengurus OSIS pada periode ini.",
  },
  {
    title: "Penyusunan program kerja",
    description:
      "Teks contoh. Bagian ini dapat diisi ringkasan program kerja unggulan tiap bidang.",
  },
  {
    title: "Pelaksanaan kegiatan",
    description:
      "Teks contoh. Uraikan bagaimana kegiatan dijalankan bersama warga sekolah.",
  },
  {
    title: "Evaluasi dan laporan",
    description:
      "Teks contoh. Tambahkan penjelasan mengenai evaluasi akhir periode kepengurusan.",
  },
];

export default function Tentang() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Tentang Kami"
        title="Mengenal Orsika Web"
        description="Halaman ini menjelaskan siapa kami, apa yang kami kerjakan, dan bagaimana warga sekolah dapat ikut terlibat. Seluruh naskah di bawah masih berupa contoh hingga naskah resmi tersedia."
      />

      <PageContainer className="space-y-14 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-3xl border-border/70 p-7 shadow-none">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Target className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">Misi</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Menjadi wadah yang ramah bagi siswa untuk belajar berorganisasi,
              menyampaikan gagasan, dan menumbuhkan rasa memiliki terhadap
              sekolah.
            </p>
          </Card>
          <Card className="rounded-3xl border-border/70 p-7 shadow-none">
            <span className="grid size-11 place-items-center rounded-2xl bg-accent/25 text-accent-foreground">
              <Eye className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">Visi</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Terwujudnya sekolah yang aktif, kreatif, dan saling mendukung
              melalui program OSIS yang bermanfaat bagi seluruh warga sekolah.
            </p>
          </Card>
        </div>

        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Nilai yang Kami Pegang
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {VALUES.map((value) => (
              <Card
                key={value.title}
                className="rounded-3xl border-border/70 p-6 shadow-none"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <value.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Alur Kepengurusan
          </h2>
          <ol className="mt-6 space-y-4">
            {TIMELINE.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-3xl border border-border/70 bg-card p-6"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </PageContainer>
    </SiteLayout>
  );
}
