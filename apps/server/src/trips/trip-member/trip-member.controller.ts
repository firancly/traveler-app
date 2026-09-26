import { updateTripMemberRoleService } from "./trip-member.service";

export async function updatetripMemberController({
	userId, tripId, targetUserId, role
} : {
	userId : string,
	tripId : string,
	targetUserId : string,
	role : "viewer" | "editor"
}){
	return updateTripMemberRoleService({userId, tripId, targetUserId, role})
}