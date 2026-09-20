import { itineraryRouter } from './itinerary/itinerary.router';
import { tripRouter } from './trips/trip.router';
import { t } from './trpc'

export const appRouter = t.router({
	trips : tripRouter,
	itinerary : itineraryRouter
});

export type AppRouter = typeof appRouter;