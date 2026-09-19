/** Utilitas format yang dipakai halaman publik maupun panel admin. */

/** Ubah "YYYY-MM-DD" menjadi teks tanggal berbahasa Indonesia. */
export function formatEventDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Versi ringkas untuk kartu yang sempit. */
export function formatEventDateShort(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { day: "—", month: iso };
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date),
  };
}

/** Format stempel waktu (createdAt) menjadi tanggal jam lokal. */
export function formatTimestamp(ms: number) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

/** Ambil inisial dari sebuah nama, maksimal dua huruf. */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Tanggal hari ini dalam format "YYYY-MM-DD" (untuk nilai awal form). */
export function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}
