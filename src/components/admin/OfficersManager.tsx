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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { initials } from "@/lib/format";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NO_DIVISION = "__none__";

interface OfficerFormState {
  name: string;
  position: string;
  division: string;
  message: string;
}

const emptyForm = (): OfficerFormState => ({
  name: "",
  position: "",
  division: NO_DIVISION,
  message: "",
});

export function OfficersManager() {
  const officers = useQuery(api.orsika.listOfficers);
  const divisions = useQuery(api.orsika.listDivisions);
  const createOfficer = useMutation(api.orsika.createOfficer);
  const updateOfficer = useMutation(api.orsika.updateOfficer);
  const removeOfficer = useMutation(api.orsika.removeOfficer);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doc<"officers"> | null>(null);
  const [form, setForm] = useState<OfficerFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Doc<"officers"> | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (officer: Doc<"officers">) => {
    setEditing(officer);
    setForm({
      name: officer.name,
      position: officer.position,
      division: officer.division ?? NO_DIVISION,
      message: officer.message ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.position.trim()) {
      toast.error("Nama dan jabatan wajib diisi.");
      return;
    }
    const payload = {
      name: form.name,
      position: form.position,
      division: form.division === NO_DIVISION ? undefined : form.division,
      message: form.message || undefined,
    };
    setIsSaving(true);
    try {
      if (editing) {
        await updateOfficer({ id: editing._id, ...payload });
        toast.success("Data pengurus berhasil diperbarui.");
      } else {
        await createOfficer(payload);
        toast.success("Pengurus baru berhasil ditambahkan.");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan data pengurus.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await removeOfficer({ id: pendingDelete._id });
      toast.success("Data pengurus berhasil dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus data pengurus.",
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
            Kepengurusan
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Susun daftar jabatan mulai dari ketua, wakil, sekretaris, hingga
            koordinator bidang.
          </p>
        </div>
        <Button className="shrink-0 rounded-full" onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Pengurus
        </Button>
      </header>

      {officers === undefined ? (
        <Card className="h-40 animate-pulse rounded-3xl border-border/70 bg-muted/40 shadow-none" />
      ) : officers.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-3xl border-dashed border-border/70 p-10 text-center shadow-none">
          <Users className="size-8 text-muted-foreground" />
          <p className="font-semibold">Belum ada pengurus</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tambahkan jabatan pertama beserta nama pemegangnya.
          </p>
          <Button className="rounded-full" onClick={openCreate}>
            <Plus className="size-4" />
            Tambah Pengurus
          </Button>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {officers.map((officer) => (
            <li key={officer._id}>
              <Card className="flex h-full flex-col gap-4 rounded-3xl border-border/70 p-5 shadow-none">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-sm font-semibold text-primary"
                  >
                    {initials(officer.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{officer.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {officer.position}
                    </p>
                    {officer.division && (
                      <p className="truncate text-xs font-semibold text-primary">
                        {officer.division}
                      </p>
                    )}
                  </div>
                </div>
                {officer.message && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {officer.message}
                  </p>
                )}
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => openEdit(officer)}
                  >
                    <Pencil className="size-4" />
                    Ubah
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(officer)}
                    aria-label={`Hapus ${officer.name}`}
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
              {editing ? "Ubah Data Pengurus" : "Tambah Pengurus"}
            </DialogTitle>
            <DialogDescription>
              Isi nama, jabatan, dan bidang bila relevan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="officer-name">Nama lengkap</Label>
              <Input
                id="officer-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama pengurus"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officer-position">Jabatan</Label>
              <Input
                id="officer-position"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Ketua OSIS, Sekretaris, dst."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officer-division">Bidang</Label>
              <Select
                value={form.division}
                onValueChange={(value) => setForm({ ...form, division: value })}
              >
                <SelectTrigger id="officer-division" className="w-full">
                  <SelectValue placeholder="Pilih bidang (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_DIVISION}>
                    Tanpa bidang khusus
                  </SelectItem>
                  {(divisions ?? []).map((division) => (
                    <SelectItem key={division._id} value={division.name}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="officer-message">
                Pesan atau sambutan{" "}
                <span className="font-normal text-muted-foreground">
                  (opsional)
                </span>
              </Label>
              <Textarea
                id="officer-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Pesan singkat untuk warga sekolah."
                rows={3}
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
                {editing ? "Simpan Perubahan" : "Simpan Pengurus"}
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
            <AlertDialogTitle>Hapus pengurus ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Data “{pendingDelete?.name}” akan dihapus permanen dari daftar
              kepengurusan.
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
