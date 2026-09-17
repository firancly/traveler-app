import prisma from "@traveler-app/db"

export async function tripService({
    userId,
    data, } : {
        userId : string,
        data : {
        name: string,
        description?: string,
        startDate?: Date,
        endDate?: Date,
        }
    }
) {
    const trip = await prisma.trip.create({
        data : {
            ownerId : userId,
            name : data.name,
            description : data.description,
            startDate : data.startDate ? new Date(data.startDate) : undefined,
            endDate : data.endDate ? new Date(data.endDate) : undefined,

            members : {
                create : {
                    userId,
                    role : "owner",
                }
            }
        }
    })

    return trip;
}

export async function getTripsService({
    userId,
} : {
    userId : string
}){
    const trips = await prisma.trip.findMany({
        where : {
            OR : [
                {
                    ownerId : userId,
                },
                {
                    members : {
                        some : {
                            userId,
                        },
                    },
                },
            ],
        },
        orderBy : {
            updatedAt : 'desc'
        }
    })
    return trips;
}

export async function getTripService({
    userId, tripId,
} : {
    userId : string,
    tripId : string,
}){
    const trip = await prisma.trip.findFirst({
        where : {
            id : tripId,
            OR : [
                {
                    ownerId : userId,
                },
                {
                    members : {
                        some : {
                            userId,
                        },
                    },
                },
            ],
        },
    });
    return trip;
}

export async function updateTripService({
    userId,
    tripId,
    data,
} : {
    userId : string;
    tripId : string;
    data : {
        name? : string;
        description? : string | null;
        startDate? : string | null;
        endDate? : string | null;
    }
}  
) {
    const trip = await prisma.trip.findFirst({
        where : {
            id : tripId,
            OR : [
                {
                    ownerId : userId,
                },
                {
                    members : {
                        some : {
                            userId,
                            role : "editor",
                        },
                    },
                },
            ],
        },
    });

    if(!trip){
        return null;
    }
    const updatedTrip = await prisma.trip.update({
        where : {
            id : tripId,
        },
        data : {
            name : data.name,
            description : data.description,
            startDate : data.startDate ? new Date(data.startDate) : data.startDate === null ? null : undefined,
            endDate : data.endDate ? new Date(data.endDate) : data.endDate === null ? null : undefined,
        }
    })

    return updatedTrip;
}


export async function deleteTripService({userId, tripId} : {userId : string, tripId : string}) {
    const trip = await prisma.trip.findFirst({
        where : {
            id : tripId,
            ownerId : userId,
        },
    });

    if(!trip){
        return null;
    }
    const deletedTrip = await prisma.trip.delete({
        where : {
            id : tripId,
        },
    });

    return deletedTrip;
}