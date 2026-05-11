import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const list = query({
  args: { locationQuery: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let villas = await ctx.db.query("villas").collect();
    if (args.locationQuery) {
      villas = villas.filter(v => v.location.toLowerCase().includes(args.locationQuery!.toLowerCase()));
    }
    return await Promise.all(villas.map(async (villa) => {
      const imageUrls = await Promise.all(villa.imageStorageIds.map(id => ctx.storage.getUrl(id)));
      return { ...villa, imageUrls };
    }));
  },
});

export const get = query({
  args: { id: v.id("villas") },
  handler: async (ctx, args) => {
    const villa = await ctx.db.get(args.id);
    if (!villa) return null;
    const imageUrls = await Promise.all(villa.imageStorageIds.map(id => ctx.storage.getUrl(id)));
    return { ...villa, imageUrls };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    pricePerNight: v.number(),
    location: v.string(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    amenities: v.array(v.string()),
    imageStorageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "host") throw new Error("Only hosts can create villas");
    return await ctx.db.insert("villas", { ...args, hostId: userId });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Unauthenticated");
  return await ctx.storage.generateUploadUrl();
});
