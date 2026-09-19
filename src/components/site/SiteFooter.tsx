import { BrandMark } from "@/components/site/BrandMark";
import { NAV_LINKS } from "@/components/site/SiteHeader";
import { Instagram, Mail, MapPin } from "lucide-react";
import { Link } from "react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Rumah digital OSIS yang ramah untuk warga sekolah. Semua agenda,
            bidang, dan aspirasi tersaji di satu tempat yang mudah dibaca.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            Jelajahi
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            Hubungi Kami
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Ruang OSIS, Gedung Sekolah — alamat lengkap menyusul.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>osiss@contoh.sch.id (contoh)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Instagram className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>@orsika.contoh (contoh)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Orsika Web. Seluruh hak cipta dilindungi.</p>
          <p>
            Seluruh isi pada versi ini masih berupa data contoh dan dapat
            disunting oleh pengurus.
          </p>
        </div>
      </div>
    </footer>
  );
}
