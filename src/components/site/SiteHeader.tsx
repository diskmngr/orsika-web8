import { BrandMark } from "@/components/site/BrandMark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";

export const NAV_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/divisi", label: "Divisi" },
  { to: "/kegiatan", label: "Kegiatan" },
  { to: "/galeri", label: "Galeri" },
  { to: "/tentang", label: "Tentang" },
  { to: "/kontak", label: "Kontak" },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

export function SiteHeader() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="Orsika Web — beranda">
          <BrandMark />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClass} end={link.to === "/"}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex">
            <Link to="/aspirasi">Kirim Aspirasi</Link>
          </Button>
          {isAuthenticated ? (
            <Button asChild className="rounded-full gap-2">
              <Link to="/dashboard">
                <LayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Panel Saya</span>
                <span className="sm:hidden">Panel</span>
              </Link>
            </Button>
          ) : (
            <Button asChild className="rounded-full">
              <Link to="/auth">Masuk Pengurus</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full lg:hidden"
                aria-label="Buka menu navigasi"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <BrandMark />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Navigasi seluler" className="px-4">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <NavLink
                      to="/aspirasi"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )
                      }
                    >
                      Kirim Aspirasi
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
