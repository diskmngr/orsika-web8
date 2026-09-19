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
import { useMutation, useQuery } from "convex/react";
import { Layers, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DivisionFormState {
  name: string;
  tagline: string;
  emoji: string;
  description: string;
}

const emptyForm = (): DivisionFormState => ({
  name: "",
  tagline: "",
  emoji: "✨",
  description: "",
});

export function DivisionsManager() {
  const divisions = useQuery(api.orsika.listDivisions);
  const createDivision = useMutation(api.orsika.createDivision);
  const updateDivision = useMutation(api.orsika.updateDivision);
  const removeDivision = useMutation(api.orsika.removeDivision);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doc<"divisions"> | null>(null);
  const [form, setForm] = useState<DivisionFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Doc<"divisions"> | null>(
    null,
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (division: Doc<"divisions">) => {
    setEditing(division);
    setForm({
      name: division.name,
      tagline: division.tagline ?? "",
      emoji: division.emoji ?? "✨",
      description: division.description,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Nama bidang dan deskripsi wajib diisi.");
      return;
    }
    setIsSaving(true);
    try {
      if (editing) {
        await updateDivision({ id: editing._id, ...form });
        toast.success("Bidang berhasil diperbarui.");
      } else {
        await createDivision(form);
        toast.success("Bidang baru berhasil ditambahkan.");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan bidang.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await removeDivision({ id: pendingDelete._id });
      toast.success("Bidang berhasil dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus bidang.",
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
            Bidang & Divisi
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Atur bidang yang tampil pada beranda dan halaman daftar divisi.
          </p>
        </div>
        <Button className="shrink-0 rounded-full" onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Bidang
        </Button>
      </header>

      {divisions === undefined ? (
        <Card className="h-40 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none" />
      ) : divisions.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-3xl border-dashed border-border/70 p-10 text-center shadow-none">
          <Layers className="size-8 text-muted-foreground" />
          <p className="font-semibold">Belum ada bidang</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tambahkan bidang agar program kerja OSIS lebih terstruktur.
          </p>
          <Button className="rounded-full" onClick={openCreate}>
            <Plus className="size-4" />
            Tambah Bidang
          </Button>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {divisions.map((division) => (
            <li key={division._id}>
              <Card className="flex h-full flex-col gap-3 rounded-3xl border-border/70 p-5 shadow-none">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent/25 text-xl"
                  >
                    {division.emoji ?? "✨"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{division.name}</p>
                    {division.tagline && (
                      <p className="truncate text-sm text-primary">
                        {division.tagline}
                      </p>
                    )}
                  </div>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {division.description}
                </p>
                <div className="mt-auto flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => openEdit(division)}
                  >
                    <Pencil className="size-4" />
                    Ubah
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(division)}
                    aria-label={`Hapus ${division.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Ubah Bidang" : "Tambah Bidang"}
            </DialogTitle>
            <DialogDescription>
              Beri nama bidang, fokus kerjanya, dan deskripsi singkat.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <div className="space-y-2">
                <Label htmlFor="division-name">Nama bidang</Label>
                <Input
                  id="division-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Bidang 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="division-emoji">Ikon</Label>
                <Input
                  id="division-emoji"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  placeholder="✨"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="division-tagline">
                Fokus kerja{" "}
                <span className="font-normal text-muted-foreground">
                  (opsional)
                </span>
              </Label>
              <Input
                id="division-tagline"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Contoh: Olahraga & Kesehatan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="division-description">Deskripsi</Label>
              <Textarea
                id="division-description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Jelaskan tugas dan program bidang ini."
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
                {editing ? "Simpan Perubahan" : "Simpan Bidang"}
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
            <AlertDialogTitle>Hapus bidang ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Bidang “{pendingDelete?.name}” akan dihapus permanen dari situs.
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
