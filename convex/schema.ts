import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("guest"), v.literal("host"))),
  }).index("email", ["email"]),

  villas: defineTable({
    title: v.string(),
    description: v.string(),
    pricePerNight: v.number(),
    location: v.string(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    amenities: v.array(v.string()),
    imageStorageIds: v.array(v.id("_storage")),
    hostId: v.id("users"),
  }),

  bookings: defineTable({
    villaId: v.id("villas"),
    guestId: v.id("users"),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
    totalPrice: v.number(),
  })
    .index("by_villa", ["villaId"])
    .index("by_guest", ["guestId"]),
});
