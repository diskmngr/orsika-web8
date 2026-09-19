import { PageContainer, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

const PLACEHOLDER_ALBUMS = [
  { title: "Album Contoh 1", caption: "Dokumentasi kegiatan (contoh)" },
  { title: "Album Contoh 2", caption: "Kebersamaan pengurus (contoh)" },
  { title: "Album Contoh 3", caption: "Rapat koordinasi bidang (contoh)" },
  { title: "Album Contoh 4", caption: "Kegiatan lapangan (contoh)" },
  { title: "Album Contoh 5", caption: "Pentas sekolah (contoh)" },
  { title: "Album Contoh 6", caption: "Bakti lingkungan (contoh)" },
];

export default function Galeri() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Galeri"
        title="Dokumentasi Kegiatan"
        description="Kumpulan momen kegiatan OSIS akan ditampilkan di sini. Untuk saat ini setiap kartu masih berisi kotak contoh tanpa gambar asli."
      />

      <PageContainer className="py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_ALBUMS.map((album) => (
            <Card
              key={album.title}
              className="overflow-hidden rounded-3xl border-border/70 p-0 shadow-none"
            >
              <div
                role="img"
                aria-label={`Gambar contoh untuk ${album.title}`}
                className="grid aspect-4/3 place-items-center bg-muted text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="size-8" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Gambar contoh
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold">
                  {album.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {album.caption}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Foto asli dapat ditambahkan oleh pengurus pada pembaruan berikutnya.
        </p>
      </PageContainer>
    </SiteLayout>
  );
}
