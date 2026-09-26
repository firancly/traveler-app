import prisma from "@traveler-app/db";

export async function updateTripMemberRoleService({userId, tripId, targetUserId, role} : {userId : string, tripId : string, targetUserId : string, role : "editor" | "viewer"}) {
	const ownerMemberShipRole = await prisma.tripMember.findUnique({
		where : {
			tripId_userId : {
				tripId, 
				userId
			},
		},
		select : {
			role : true,
		}
	})

	if(ownerMemberShipRole?.role !== "owner"){
		return null
	}

	const updateMember = await prisma.tripMember.update({
		where : {
			tripId_userId : {
				tripId,
				userId: targetUserId
			},
		},
		data : {
			role,
		},
	});

	return updateMember
}