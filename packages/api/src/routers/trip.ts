import prisma from "@traveler-app/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

export const tripRouter = router({
	list: protectedProcedure.query(({ ctx }) =>
		prisma.trip.findMany({ where: { ownerId: ctx.session.user.id } }),
	),
	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(({ ctx, input }) =>
			prisma.trip.create({
				data: { name: input.name, ownerId: ctx.session.user.id },
			}),
		),
});
