import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  Archive,
  Loader2,
  Megaphone,
  MessageSquareReply,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type StatusFilter = "semua" | "baru" | "dibalas" | "diarsipkan";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "baru", label: "Baru" },
  { value: "dibalas", label: "Dibalas" },
  { value: "diarsipkan", label: "Diarsipkan" },
];

const STATUS_STYLE: Record<Doc<"aspirations">["status"], string> = {
  baru: "bg-accent/30 text-accent-foreground",
  dibalas: "bg-primary/15 text-primary",
  diarsipkan: "bg-muted text-muted-foreground",
};

export function AspirationsManager() {
  const aspirations = useQuery(api.orsika.listAspirations);
  const replyAspiration = useMutation(api.orsika.replyAspiration);
  const setStatus = useMutation(api.orsika.setAspirationStatus);
  const removeAspiration = useMutation(api.orsika.removeAspiration);

  const [filter, setFilter] = useState<StatusFilter>("semua");
  const [replying, setReplying] = useState<Doc<"aspirations"> | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Doc<"aspirations"> | null>(
    null,
  );

  const filtered = useMemo(() => {
    const list = aspirations ?? [];
    if (filter === "semua") return list;
    return list.filter((item) => item.status === filter);
  }, [aspirations, filter]);

  const openReply = (item: Doc<"aspirations">) => {
    setReplying(item);
    setReplyText(item.reply ?? "");
  };

  const handleReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!replying) return;
    setIsSaving(true);
    try {
      await replyAspiration({ id: replying._id, reply: replyText });
      toast.success("Balasan berhasil disimpan.");
      setReplying(null);
      setReplyText("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan balasan.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async (item: Doc<"aspirations">) => {
    try {
      await setStatus({ id: item._id, status: "diarsipkan" });
      toast.success("Aspirasi diarsipkan.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengarsipkan aspirasi.",
      );
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await removeAspiration({ id: pendingDelete._id });
      toast.success("Aspirasi berhasil dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus aspirasi.",
      );
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">Kelola</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Aspirasi Warga Sekolah
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Baca masukan yang masuk, balas bila perlu, lalu arsipkan atau hapus
          yang sudah tidak relevan.
        </p>
      </header>

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

      {aspirations === undefined ? (
        <Card className="h-40 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none" />
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-3xl border-dashed border-border/70 p-10 text-center shadow-none">
          <Megaphone className="size-8 text-muted-foreground" />
          <p className="font-semibold">
            {filter === "semua" ? "Belum ada aspirasi" : "Tidak ada pada filter ini"}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Aspirasi yang dikirim warga sekolah akan muncul di sini.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li key={item._id}>
              <Card className="rounded-3xl border-border/70 p-5 shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.author}</p>
                    <Badge
                      className={cn(
                        "rounded-full text-[11px] capitalize",
                        STATUS_STYLE[item.status],
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(item.createdAt)}
                  </p>
                </div>

                {item.contact && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kontak: {item.contact}
                  </p>
                )}

                <p className="mt-3 text-sm leading-6">{item.message}</p>

                {item.reply && (
                  <div className="mt-4 rounded-2xl border-l-4 border-primary bg-secondary/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      Balasan pengurus
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.reply}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => openReply(item)}
                  >
                    <MessageSquareReply className="size-4" />
                    {item.reply ? "Ubah Balasan" : "Balas"}
                  </Button>
                  {item.status !== "diarsipkan" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleArchive(item)}
                    >
                      <Archive className="size-4" />
                      Arsipkan
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(item)}
                    aria-label={`Hapus aspirasi dari ${item.author}`}
                  >
                    <Trash2 className="size-4" />
                    Hapus
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={replying !== null}
        onOpenChange={(open) => {
          if (!open) {
            setReplying(null);
            setReplyText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Balas Aspirasi</DialogTitle>
            <DialogDescription>
              Balasan akan tersimpan bersama aspirasi ini dan mengubah statusnya
              menjadi “dibalas”.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReply} className="space-y-4">
            <div className="rounded-2xl bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">
                {replying?.author}:
              </span>{" "}
              {replying?.message}
            </div>
            <div className="space-y-2">
              <Label htmlFor="aspiration-reply">Balasan</Label>
              <Textarea
                id="aspiration-reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tuliskan tanggapan pengurus…"
                rows={5}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setReplying(null)}
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-full" disabled={isSaving}>
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                Simpan Balasan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus aspirasi ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Aspirasi dari “{pendingDelete?.author}” beserta balasannya akan
              dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
