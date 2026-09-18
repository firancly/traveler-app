import prisma from "@traveler-app/db"

export async function createItineraryItemService({
	userId,
	data,
} : {
	userId : string,
	data : {
		tripId : string,
		title : string,
		notes? : string,
		placeId? : string,
		startAt? : Date,
		endAt? : Date,
	}
}){
	const trip = await prisma.trip.findFirst({
		where : {
			id : data.tripId,
			OR : [
				{
					ownerId : userId,
				},
				{
					members : {
						some : {
							userId,
							role : {
								in : ['owner', 'editor'],
							},
						},
					},
				},
			],
		},
	});
	if(!trip) {
		return null;
	}
	const lastItem = await prisma.itineraryItem.findFirst({
		where : {
			tripId : data.tripId,
		},
		orderBy : {
			position : "desc",
		},
		select : {
			position : true,
		}
	});
		const position = lastItem? lastItem.position + 1 : 0;

	const item = await prisma.itineraryItem.create({
		data : {
			tripId : data.tripId,
			title : data.title,
			notes: data.notes,
			startAt : data.startAt,
			endAt : data.endAt,
			placeId : data.placeId,
			position,
		}
	})

	return item;
}