import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const create = mutation({
  args: {
    villaId: v.id("villas"),
    startDate: v.number(),
    endDate: v.number(),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const overlappingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_villa", (q) => q.eq("villaId", args.villaId))
      .filter((q) =>
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.or(
            q.and(q.lte(q.field("startDate"), args.endDate), q.gte(q.field("endDate"), args.startDate))
          )
        )
      )
      .collect();

    if (overlappingBookings.length > 0) throw new Error("Dates are not available");

    return await ctx.db.insert("bookings", {
      ...args,
      guestId: userId,
      status: "pending",
    });
  },
});

export const getByGuest = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .collect();

    return Promise.all(bookings.map(async (booking) => {
      const villa = await ctx.db.get(booking.villaId);
      return { ...booking, villa };
    }));
  },
});
