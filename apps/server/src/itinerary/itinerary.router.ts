import { protectedProcedure, t } from "@/trpc";
import {
  createItineraryItemSchema,
  ItineraryItemIdSchema,
  updateItineraryItemSchema,
} from "./itinerary.schema";
import {
  createItineraryController,
  getItineraryItemController,
  getItineraryItemsController,
  updateItineraryItemController,
} from "./itinerary.controller";
import { tripIdSchema } from "@/trips/trip.schema";

export const itineraryRouter = t.router({
  create: protectedProcedure
    .input(createItineraryItemSchema)
    .mutation(async ({ ctx, input }) => {
      return createItineraryController({
        userId: ctx.user.id,
        data: input,
      });
    }),
  getAll: protectedProcedure
    .input(tripIdSchema)
    .query(async ({ input, ctx }) => {
      return getItineraryItemsController({
        userId: ctx.user.id,
        tripId: input.id,
      });
    }),
  getOne: protectedProcedure
    .input(ItineraryItemIdSchema)
    .query(async ({ input, ctx }) => {
      return getItineraryItemController({
        userId: ctx.user.id,
        itemId: input.id,
      });
    }),

  update: protectedProcedure
    .input(updateItineraryItemSchema)
    .mutation(async ({ input, ctx }) => {
      return updateItineraryItemController({
        userId: ctx.user.id,
        itemId: input.id,
        data: {
          title: input.title,
          placeId: input.placeId,
          notes: input.notes,
          endAt: input.endAt,
          startAt: input.startAt,
        },
      });
    }),
});
