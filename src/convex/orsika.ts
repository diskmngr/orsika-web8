import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

/** Pastikan hanya pengurus yang sudah masuk yang dapat mengubah data. */
async function requireAdmin(ctx: MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Akses ditolak. Silakan masuk sebagai pengurus terlebih dahulu.");
  }
  return userId;
}

/** Ambil nomor urut berikutnya untuk daftar yang berurutan. */
async function nextOrder(ctx: MutationCtx, table: "divisions" | "officers") {
  const rows = await ctx.db.query(table).collect();
  if (rows.length === 0) return 1;
  return Math.max(...rows.map((row) => row.order)) + 1;
}

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").withIndex("by_date").collect();
    return events.sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const listDivisions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("divisions").withIndex("by_order").collect();
  },
});

export const listOfficers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("officers").withIndex("by_order").collect();
  },
});

/** Aspirasi hanya boleh dibaca oleh pengurus yang sudah masuk. */
export const listAspirations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const rows = await ctx.db.query("aspirations").withIndex("by_created").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/* -------------------------------------------------------------------------- */
/*                              Kegiatan (events)                             */
/* -------------------------------------------------------------------------- */

export const createEvent = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("events", {
      title: args.title.trim(),
      date: args.date,
      time: args.time?.trim() || undefined,
      location: args.location?.trim() || undefined,
      category: args.category?.trim() || "Umum",
      description: args.description.trim(),
    });
  },
});

export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      title: rest.title.trim(),
      date: rest.date,
      time: rest.time?.trim() || undefined,
      location: rest.location?.trim() || undefined,
      category: rest.category?.trim() || "Umum",
      description: rest.description.trim(),
    });
  },
});

export const removeEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

/* -------------------------------------------------------------------------- */
/*                             Bidang (divisions)                             */
/* -------------------------------------------------------------------------- */

export const createDivision = mutation({
  args: {
    name: v.string(),
    tagline: v.optional(v.string()),
    description: v.string(),
    emoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("divisions", {
      name: args.name.trim(),
      tagline: args.tagline?.trim() || undefined,
      description: args.description.trim(),
      emoji: args.emoji?.trim() || "✨",
      order: await nextOrder(ctx, "divisions"),
    });
  },
});

export const updateDivision = mutation({
  args: {
    id: v.id("divisions"),
    name: v.string(),
    tagline: v.optional(v.string()),
    description: v.string(),
    emoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      name: rest.name.trim(),
      tagline: rest.tagline?.trim() || undefined,
      description: rest.description.trim(),
      emoji: rest.emoji?.trim() || "✨",
    });
  },
});

export const removeDivision = mutation({
  args: { id: v.id("divisions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

/* -------------------------------------------------------------------------- */
/*                          Kepengurusan (officers)                           */
/* -------------------------------------------------------------------------- */

export const createOfficer = mutation({
  args: {
    name: v.string(),
    position: v.string(),
    division: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("officers", {
      name: args.name.trim(),
      position: args.position.trim(),
      division: args.division?.trim() || undefined,
      message: args.message?.trim() || undefined,
      order: await nextOrder(ctx, "officers"),
    });
  },
});

export const updateOfficer = mutation({
  args: {
    id: v.id("officers"),
    name: v.string(),
    position: v.string(),
    division: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      name: rest.name.trim(),
      position: rest.position.trim(),
      division: rest.division?.trim() || undefined,
      message: rest.message?.trim() || undefined,
    });
  },
});

export const removeOfficer = mutation({
  args: { id: v.id("officers") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

/* -------------------------------------------------------------------------- */
/*                             Aspirasi (aspirations)                         */
/* -------------------------------------------------------------------------- */

/** Terbuka untuk umum: siapa pun boleh mengirim aspirasi. */
export const submitAspiration = mutation({
  args: {
    author: v.string(),
    contact: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const author = args.author.trim() || "Anonim";
    const message = args.message.trim();
    if (message.length < 5) {
      throw new Error("Tuliskan aspirasi minimal 5 karakter agar dapat kami baca.");
    }
    return await ctx.db.insert("aspirations", {
      author,
      contact: args.contact?.trim() || undefined,
      message,
      status: "baru",
      createdAt: Date.now(),
    });
  },
});

export const replyAspiration = mutation({
  args: { id: v.id("aspirations"), reply: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const reply = args.reply.trim();
    if (reply.length === 0) {
      throw new Error("Balasan tidak boleh kosong.");
    }
    await ctx.db.patch(args.id, {
      reply,
      status: "dibalas",
      repliedAt: Date.now(),
    });
  },
});

export const setAspirationStatus = mutation({
  args: {
    id: v.id("aspirations"),
    status: v.union(
      v.literal("baru"),
      v.literal("dibalas"),
      v.literal("diarsipkan"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const removeAspiration = mutation({
  args: { id: v.id("aspirations") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

/* -------------------------------------------------------------------------- */
/*                              Data contoh (seed)                            */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER_DIVISIONS = [
  {
    name: "Bidang 1",
    tagline: "Ketakwaan & Budi Pekerti",
    emoji: "🕌",
    description:
      "Contoh deskripsi bidang. Bidang ini menaungi kegiatan pembinaan karakter, keagamaan, dan penguatan nilai-nilai budi pekerti warga sekolah.",
  },
  {
    name: "Bidang 2",
    tagline: "Kepemimpinan & Kedisiplinan",
    emoji: "🧭",
    description:
      "Contoh deskripsi bidang. Fokus pada pembinaan kepemimpinan siswa, tata tertib, dan program pengembangan diri.",
  },
  {
    name: "Bidang 3",
    tagline: "Olahraga & Kesehatan",
    emoji: "⚽",
    description:
      "Contoh deskripsi bidang. Menyelenggarakan turnamen antar kelas, senam bersama, dan kampanye hidup sehat.",
  },
  {
    name: "Bidang 4",
    tagline: "Seni & Budaya",
    emoji: "🎭",
    description:
      "Contoh deskripsi bidang. Menggarap pentas seni, ekstrakurikuler budaya, dan dekorasi acara sekolah.",
  },
  {
    name: "Bidang 5",
    tagline: "Literasi & Teknologi",
    emoji: "💡",
    description:
      "Contoh deskripsi bidang. Mengelola perpustakaan siswa, konten media sosial, dan publikasi kegiatan sekolah.",
  },
  {
    name: "Bidang 6",
    tagline: "Sosial & Lingkungan",
    emoji: "🌱",
    description:
      "Contoh deskripsi bidang. Menginisiasi aksi sosial, bakti lingkungan, dan program kepedulian antar warga sekolah.",
  },
];

const PLACEHOLDER_EVENTS = [
  {
    title: "Contoh Kegiatan 1",
    date: "2026-10-05",
    time: "08.00 – 12.00",
    location: "Aula Sekolah (contoh)",
    category: "Contoh",
    description:
      "Teks contoh. Ganti bagian ini dengan informasi lengkap kegiatan, seperti tujuan, peserta, dan susunan acara.",
  },
  {
    title: "Contoh Kegiatan 2",
    date: "2026-10-18",
    time: "13.00 – 15.30",
    location: "Lapangan Sekolah (contoh)",
    category: "Contoh",
    description:
      "Teks contoh. Bagian ini masih berupa contoh data sehingga dapat disunting oleh pengurus melalui panel admin.",
  },
  {
    title: "Contoh Kegiatan 3",
    date: "2026-11-02",
    time: "09.00 – 14.00",
    location: "Ruang Serbaguna (contoh)",
    category: "Contoh",
    description:
      "Teks contoh. Setelah data asli tersedia, hapus kegiatan contoh ini atau ubah sesuai kebutuhan.",
  },
  {
    title: "Contoh Kegiatan 4",
    date: "2026-11-21",
    time: "07.30 – 11.00",
    location: "Halaman Sekolah (contoh)",
    category: "Contoh",
    description:
      "Teks contoh. Deskripsi kegiatan akan tampil pada halaman beranda dan halaman agenda kegiatan.",
  },
];

const PLACEHOLDER_OFFICERS = [
  {
    name: "Nama Ketua (contoh)",
    position: "Ketua OSIS",
    division: undefined,
    message:
      "Teks contoh. Pesan ketua akan tampil pada halaman beranda. Isi dengan sapaan hangat, semangat, dan rencana kerja yang ingin dibagikan kepada warga sekolah.",
    order: 1,
  },
  {
    name: "Nama Wakil Ketua (contoh)",
    position: "Wakil Ketua OSIS",
    division: undefined,
    message:
      "Teks contoh. Pesan wakil ketua juga tampil pada halaman beranda, biasanya berisi ajakan untuk bersama-sama menghidupkan program OSIS.",
    order: 2,
  },
  {
    name: "Nama Sekretaris (contoh)",
    position: "Sekretaris",
    division: undefined,
    message: undefined,
    order: 3,
  },
  {
    name: "Nama Bendahara (contoh)",
    position: "Bendahara",
    division: undefined,
    message: undefined,
    order: 4,
  },
  {
    name: "Nama Koordinator (contoh)",
    position: "Koordinator Bidang 1",
    division: "Bidang 1",
    message: undefined,
    order: 5,
  },
];

const PLACEHOLDER_ASPIRATIONS = [
  {
    author: "Anonim (contoh)",
    contact: undefined,
    message:
      "Teks contoh aspirasi. Ganti dengan masukan nyata dari warga sekolah yang dikirim melalui formulir aspirasi.",
    status: "baru" as const,
  },
  {
    author: "Siswa (contoh)",
    contact: "@contoh",
    message:
      "Teks contoh aspirasi yang sudah dibalas. Balasan pengurus akan tampil pada panel admin.",
    status: "dibalas" as const,
  },
];

/**
 * Mengisi data contoh hanya ketika tabel masih kosong.
 * Aman dipanggil berulang kali.
 */
export const seedPlaceholderData = mutation({
  args: {},
  handler: async (ctx) => {
    const seeded: string[] = [];

    const existingDivisions = await ctx.db.query("divisions").collect();
    if (existingDivisions.length === 0) {
      for (const division of PLACEHOLDER_DIVISIONS) {
        await ctx.db.insert("divisions", {
          ...division,
          order: PLACEHOLDER_DIVISIONS.indexOf(division) + 1,
        });
      }
      seeded.push("divisions");
    }

    const existingEvents = await ctx.db.query("events").collect();
    if (existingEvents.length === 0) {
      for (const event of PLACEHOLDER_EVENTS) {
        await ctx.db.insert("events", event);
      }
      seeded.push("events");
    }

    const existingOfficers = await ctx.db.query("officers").collect();
    if (existingOfficers.length === 0) {
      for (const officer of PLACEHOLDER_OFFICERS) {
        await ctx.db.insert("officers", officer);
      }
      seeded.push("officers");
    }

    const existingAspirations = await ctx.db.query("aspirations").collect();
    if (existingAspirations.length === 0) {
      for (const aspiration of PLACEHOLDER_ASPIRATIONS) {
        await ctx.db.insert("aspirations", {
          ...aspiration,
          createdAt: Date.now(),
          repliedAt: aspiration.status === "dibalas" ? Date.now() : undefined,
          reply: aspiration.status === "dibalas" ? "Teks contoh balasan pengurus." : undefined,
        });
      }
      seeded.push("aspirations");
    }

    return seeded;
  },
});
