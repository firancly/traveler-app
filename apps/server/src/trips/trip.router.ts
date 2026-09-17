import { t } from "@/trpc";
import { createTripSchema } from "./trip.schema";
import { createTripController } from "./trip.controller";
import { protectedProcedure } from '../trpc';

export const tripRouter = t.router({
    create : protectedProcedure.input(createTripSchema).mutation(async ({ input, ctx })=>{
        return createTripController({
            userId : ctx.user.id,
            data : input,
        });
    })
})