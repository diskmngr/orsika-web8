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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatEventDate, formatEventDateShort, todayIso } from "@/lib/format";
import { useMutation, useQuery } from "convex/react";
import { CalendarHeart, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EventFormState {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
}

const emptyForm = (): EventFormState => ({
  title: "",
  date: todayIso(),
  time: "",
  location: "",
  category: "Umum",
  description: "",
});

export function EventsManager() {
  const events = useQuery(api.orsika.listEvents);
  const createEvent = useMutation(api.orsika.createEvent);
  const updateEvent = useMutation(api.orsika.updateEvent);
  const removeEvent = useMutation(api.orsika.removeEvent);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doc<"events"> | null>(null);
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Doc<"events"> | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (event: Doc<"events">) => {
    setEditing(event);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time ?? "",
      location: event.location ?? "",
      category: event.category ?? "Umum",
      description: event.description,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Judul dan deskripsi kegiatan wajib diisi.");
      return;
    }
    setIsSaving(true);
    try {
      if (editing) {
        await updateEvent({ id: editing._id, ...form });
        toast.success("Kegiatan berhasil diperbarui.");
      } else {
        await createEvent(form);
        toast.success("Kegiatan baru berhasil ditambahkan.");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan kegiatan.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await removeEvent({ id: pendingDelete._id });
      toast.success("Kegiatan berhasil dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus kegiatan.",
      );
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Kelola</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            Kegiatan & Agenda
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Tambah, ubah, atau hapus kegiatan. Perubahan langsung tampil di
            halaman publik.
          </p>
        </div>
        <Button className="shrink-0 rounded-full" onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Kegiatan
        </Button>
      </header>

      {events === undefined ? (
        <Card className="h-40 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none" />
      ) : events.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-3xl border-dashed border-border/70 p-10 text-center shadow-none">
          <CalendarHeart className="size-8 text-muted-foreground" />
          <p className="font-semibold">Belum ada kegiatan</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Mulai dengan menambahkan agenda pertama OSIS.
          </p>
          <Button className="rounded-full" onClick={openCreate}>
            <Plus className="size-4" />
            Tambah Kegiatan
          </Button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => {
            const short = formatEventDateShort(event.date);
            return (
              <li key={event._id}>
                <Card className="flex flex-col gap-4 rounded-3xl border-border/70 p-5 shadow-none sm:flex-row sm:items-center">
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <span className="font-display text-xl font-semibold leading-none">
                      {short.day}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wide">
                      {short.month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{event.title}</h2>
                      <Badge variant="secondary" className="rounded-full text-[11px]">
                        {event.category ?? "Umum"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatEventDate(event.date)}
                      {event.time ? ` • ${event.time}` : ""}
                      {event.location ? ` • ${event.location}` : ""}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => openEdit(event)}
                    >
                      <Pencil className="size-4" />
                      Ubah
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(event)}
                      aria-label={`Hapus ${event.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Ubah Kegiatan" : "Tambah Kegiatan"}
            </DialogTitle>
            <DialogDescription>
              Isi informasi kegiatan di bawah ini. Kolom bertanda wajib tidak
              boleh kosong.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Judul kegiatan</Label>
              <Input
                id="event-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Nama kegiatan"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event-date">Tanggal</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Waktu</Label>
                <Input
                  id="event-time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="08.00 – 12.00"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event-location">Lokasi</Label>
                <Input
                  id="event-location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Aula sekolah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-category">Kategori</Label>
                <Input
                  id="event-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Umum"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Deskripsi</Label>
              <Textarea
                id="event-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Jelaskan tujuan dan susunan acara."
                rows={4}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-full" disabled={isSaving}>
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Simpan Perubahan" : "Simpan Kegiatan"}
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
            <AlertDialogTitle>Hapus kegiatan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Kegiatan “{pendingDelete?.title}” akan dihapus permanen dan tidak
              lagi tampil di situs publik.
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
