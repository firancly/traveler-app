import {
  createItineraryItemService,
  deleteItineraryItemService,
  getItineraryItemService,
  getItineraryItemServices,
  updateItineraryItemService,
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

export async function updateItineraryItemController({
  userId,
  itemId,
  data,
}: {
  userId: string;
  itemId: string;
  data: {
    title?: string;
    notes?: string | null;
    placeId?: string | null;
    startAt?: Date | null;
    endAt?: Date | null;
		done? : boolean
  };
}) {
  return updateItineraryItemService({ userId, itemId, data });
}

export async function deleteItineraryItemController({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) {
  return deleteItineraryItemService({
    userId,
    itemId,
  });
}

export async function reorderItineraryController({
	userId,
	tripId,
	itemIds,
} : {
	userId : string;
	tripId : string;
	itemIds : string[];
}){
	return reorderItineraryController({
		userId,
		tripId,
		itemIds,
	})
}
