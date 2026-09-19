import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    // Kegiatan / acara yang diselenggarakan OSIS.
    events: defineTable({
      title: v.string(),
      date: v.string(), // format ISO "YYYY-MM-DD" agar mudah diurutkan
      time: v.optional(v.string()),
      location: v.optional(v.string()),
      category: v.optional(v.string()),
      description: v.string(),
    }).index("by_date", ["date"]),

    // Bidang-bidang di dalam kepengurusan OSIS.
    divisions: defineTable({
      name: v.string(),
      tagline: v.optional(v.string()),
      description: v.string(),
      emoji: v.optional(v.string()),
      order: v.number(),
    }).index("by_order", ["order"]),

    // Susunan kepengurusan (ketua, wakil, sekretaris, dst).
    officers: defineTable({
      name: v.string(),
      position: v.string(),
      division: v.optional(v.string()),
      message: v.optional(v.string()),
      order: v.number(),
    }).index("by_order", ["order"]),

    // Aspirasi yang dikirim oleh warga sekolah.
    aspirations: defineTable({
      author: v.string(),
      contact: v.optional(v.string()),
      message: v.string(),
      status: v.union(
        v.literal("baru"),
        v.literal("dibalas"),
        v.literal("diarsipkan"),
      ),
      reply: v.optional(v.string()),
      createdAt: v.number(),
      repliedAt: v.optional(v.number()),
    }).index("by_created", ["createdAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
