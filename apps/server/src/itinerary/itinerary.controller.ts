import { createItineraryItemService } from "./itinerary.service";

export async function createItineraryController({
  userId,
  data,
}: {
  userId: string;
  data: {
    tripId: string;
    title: string;
    notes?: string;
    placeId?: string;
    startAt?: Date;
    endAt?: Date;
  };
}) {
  return createItineraryItemService({ userId, data });
}
