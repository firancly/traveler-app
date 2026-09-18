import {
  createItineraryItemService,
  getItineraryItemService,
  getItineraryItemServices,
} from "./itinerary.service";

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

export async function getItineraryItemsController({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  return getItineraryItemServices({
    userId,
    tripId,
  });
}

export async function getItineraryItemController({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) {
  return getItineraryItemService({ userId, itemId });
}
