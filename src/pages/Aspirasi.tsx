import { PageContainer, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Aspirasi() {
  const submit = useMutation(api.orsika.submitAspiration);
  const [author, setAuthor] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await submit({ author, contact, message });
      toast.success("Aspirasi terkirim. Terima kasih sudah berbagi!");
      setAuthor("");
      setContact("");
      setMessage("");
      setSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Aspirasi gagal dikirim. Coba lagi sebentar.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Aspirasi"
        title="Sampaikan Ide & Masukanmu"
        description="Formulir ini terbuka untuk seluruh warga sekolah. Tuliskan pendapat, usulan kegiatan, atau keluhan dengan jelas agar pengurus dapat menindaklanjutinya."
      />

      <PageContainer className="py-14">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <Card className="rounded-3xl border-border/70 p-7 shadow-none">
            {sent && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Aspirasi berhasil dikirim.</p>
                  <p className="mt-1 text-muted-foreground">
                    Pengurus akan membacanya di panel admin dan membalas bila
                    perlu.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author">Nama</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    placeholder="Nama atau kelas kamu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">
                    Kontak{" "}
                    <span className="font-normal text-muted-foreground">
                      (opsional)
                    </span>
                  </Label>
                  <Input
                    id="contact"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="Surel, akun media sosial, atau kelas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Isi aspirasi</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tuliskan masukanmu di sini…"
                  rows={7}
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Aspirasi dapat dikirim tanpa mengisi kontak.
                </p>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full"
                >
                  {isSaving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Kirim Aspirasi
                </Button>
              </div>
            </form>
          </Card>

          <Card className="h-fit rounded-3xl border-border/70 bg-secondary/40 p-7 shadow-none">
            <h2 className="font-display text-xl font-semibold">
              Tips menulis aspirasi
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>• Sebutkan hal yang ingin diperbaiki atau ditambahkan.</li>
              <li>• Jelaskan singkat alasannya agar mudah dipahami.</li>
              <li>• Hindari menyebut nama orang secara pribadi.</li>
              <li>
                • Sertakan kontak bila kamu bersedia dihubungi untuk klarifikasi.
              </li>
            </ul>
            <p className="mt-6 rounded-2xl bg-card p-4 text-xs leading-5 text-muted-foreground">
              Catatan: pada versi demo ini aspirasi yang tersimpan masih bercampur
              dengan beberapa contoh data sebelumnya.
            </p>
          </Card>
        </div>
      </PageContainer>
    </SiteLayout>
  );
}
