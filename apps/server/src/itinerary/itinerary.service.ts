import prisma from "@traveler-app/db";
import { redis } from "bun";

export async function createItineraryItemService({
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
  const trip = await prisma.trip.findFirst({
    where: {
      id: data.tripId,
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
              role: {
                in: ["owner", "editor"],
              },
            },
          },
        },
      ],
    },
  });
  if (!trip) {
    return null;
  }
  const lastItem = await prisma.itineraryItem.findFirst({
    where: {
      tripId: data.tripId,
    },
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });
  const position = lastItem ? lastItem.position + 1 : 0;

  const item = await prisma.itineraryItem.create({
    data: {
      tripId: data.tripId,
      title: data.title,
      notes: data.notes,
      startAt: data.startAt,
      endAt: data.endAt,
      placeId: data.placeId,
      position,
    },
  });

  return item;
}

export async function getItineraryItemServices({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!trip) {
    return null;
  }

  const items = await prisma.itineraryItem.findMany({
    where: {
      tripId,
    },
    orderBy: {
      position: "desc",
    },
  });
  return items;
}

export async function getItineraryItemService({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      trip: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    },
  });
  return item;
}

export async function updateItineraryItemService({
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
		done? : boolean;
  };
}) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      trip: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,

                role: "editor",
              },
            },
          },
        ],
      },
    },
  });

  if (!item) {
    return null;
  }
  return prisma.itineraryItem.update({
    where: {
      id: item.id,
    },
    data: {
      title: data.title,
      notes: data.notes,
      startAt: data.startAt,
      endAt: data.endAt,
			placeId : data.placeId,
			done : data.done
    },
  });
}

export async function deleteItineraryItemService({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      trip: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
                role: "editor",
              },
            },
          },
        ],
      },
    },
    select: {
      id: true,
    },
  });

  if (!item) return null;

  await prisma.itineraryItem.delete({
    where: {
      id: item.id,
    },
  });

  return true;
}

export async function reorderItineraryItemsService({
  userId,
  tripId,
  itemIds,
}: {
  userId: string;
  tripId: string;
  itemIds: string[];
}) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
              role: { in: ["owner", "editor"] },
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!trip) return null;

  const items = await prisma.itineraryItem.findMany({
    where: {
      tripId,
      id: { in: itemIds },
    },
    select: {
      id: true,
    },
  });

  if (items.length !== itemIds.length) {
    throw new Error("Invalid item list");
  }

  await prisma.$transaction(
    itemIds.map((itemId, index) =>
      prisma.itineraryItem.update({
        where: {
          id: itemId,
        },
        data: {
          position: index,
        },
      })
    )
  );
}
