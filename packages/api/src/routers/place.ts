import prisma, { PlaceCategory, PlaceLabel } from "@traveler-app/db";
import { env } from "@traveler-app/env/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../index";

export const placeRouter = router({
	list: publicProcedure
		.input(
			z.object({
				cityId: z.string(),
				category: z.enum(PlaceCategory).optional(),
				label: z.enum(PlaceLabel).optional(),
				indoor: z.boolean().optional(),
				limit: z.number().int().min(1).max(50).default(20),
				cursor: z.string().nullish(),
				includeUnverified: z.boolean().default(false),
			}),
		)
		.query(async ({ input }) => {
			const places = await prisma.place.findMany({
				where: {
					cityId: input.cityId,
					verified:
						input.includeUnverified && env.NODE_ENV === "development"
							? undefined
							: true,
					category: input.category,
					indoor: input.indoor,
					labels: input.label ? { has: input.label } : undefined,
				},
				orderBy: { id: "asc" },
				take: input.limit + 1,
				cursor: input.cursor ? { id: input.cursor } : undefined,
			});

			let nextCursor: string | null = null;
			if (places.length > input.limit) {
				nextCursor = places.pop()?.id ?? null;
			}
			return { places, nextCursor };
		}),

	byId: publicProcedure
		.input(
			z.object({
				id: z.string(),
				includeUnverified: z.boolean().default(false),
			}),
		)
		.query(async ({ input }) => {
			const place = await prisma.place.findFirst({
				where: {
					id: input.id,
					verified:
						input.includeUnverified && env.NODE_ENV === "development"
							? undefined
							: true,
				},
			});
			if (!place) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Place not found",
				});
			}
			return place;
		}),
});
