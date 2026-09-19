import { BrandMark } from "@/components/site/BrandMark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  CalendarHeart,
  ExternalLink,
  LayoutDashboard,
  Layers,
  LogOut,
  Megaphone,
  Menu,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router";

export type AdminSection =
  | "ringkasan"
  | "kegiatan"
  | "kepengurusan"
  | "bidang"
  | "aspirasi";

const NAV: { value: AdminSection; label: string; icon: LucideIcon }[] = [
  { value: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { value: "kegiatan", label: "Kelola Kegiatan", icon: CalendarHeart },
  { value: "kepengurusan", label: "Kelola Kepengurusan", icon: Users },
  { value: "bidang", label: "Kelola Bidang", icon: Layers },
  { value: "aspirasi", label: "Kelola Aspirasi", icon: Megaphone },
];

interface AdminShellProps {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  userName: string;
  userEmail?: string;
  onSignOut: () => void;
  pendingAspirations: number;
  children: ReactNode;
}

function SidebarNav({
  active,
  onNavigate,
  pendingAspirations,
}: Pick<AdminShellProps, "active" | "onNavigate" | "pendingAspirations">) {
  return (
    <nav aria-label="Navigasi panel admin" className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const isActive = active === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onNavigate(item.value)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <span className="flex items-center gap-2.5">
              <item.icon className="size-4" />
              {item.label}
            </span>
            {item.value === "aspirasi" && pendingAspirations > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
                {pendingAspirations}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  active,
  onNavigate,
  userName,
  userEmail,
  onSignOut,
  pendingAspirations,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileNavigate = (section: AdminSection) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar tetap untuk layar besar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-5">
          <Link to="/" aria-label="Kembali ke situs publik">
            <BrandMark className="text-sidebar-foreground" />
          </Link>
        </div>
        <p className="px-5 pt-4 text-[11px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
          Panel Pengurus
        </p>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav
            active={active}
            onNavigate={onNavigate}
            pendingAspirations={pendingAspirations}
          />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3">
            <p className="truncate text-sm font-semibold">{userName}</p>
            {userEmail && (
              <p className="truncate text-xs text-sidebar-foreground/60">
                {userEmail}
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2 rounded-xl"
            onClick={onSignOut}
          >
            <LogOut className="size-4" />
            Keluar
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mt-1 w-full justify-start gap-2 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Link to="/">
              <ExternalLink className="size-4" />
              Lihat situs publik
            </Link>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Bar atas untuk layar kecil */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/" aria-label="Kembali ke situs publik">
            <BrandMark />
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Buka menu panel"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetHeader className="border-b border-sidebar-border">
                <SheetTitle>
                  <BrandMark className="text-sidebar-foreground" />
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto">
                <SidebarNav
                  active={active}
                  onNavigate={handleMobileNavigate}
                  pendingAspirations={pendingAspirations}
                />
              </div>
              <div className="mt-auto border-t border-sidebar-border p-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-xl"
                  onClick={onSignOut}
                >
                  <LogOut className="size-4" />
                  Keluar
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
