import z from "zod";

export const createItineraryItemSchema = z.object({
	tripId : z.string().min(1),
	title : z.string().trim().min(1).max(200),
	notes : z.string().trim().max(2000).optional(),
	placeId : z.string().min(1).optional(),
	startAt : z.coerce.date().optional(),
	endAt : z.coerce.date().optional(),
})