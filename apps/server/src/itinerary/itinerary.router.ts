import { protectedProcedure, t } from "@/trpc";
import { createItineraryItemSchema } from './itinerary.schema';
import { createItineraryController } from "./itinerary.controller";

export const itineraryRouter = t.router({
	create : protectedProcedure.input(createItineraryItemSchema).mutation(async ({ctx, input})=>{
		return createItineraryController({
			userId : ctx.user.id,
			data : input
		})
	})
})