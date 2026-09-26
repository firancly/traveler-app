import {
  getTripMembersService,
  updateTripMemberRoleService,
} from "./trip-member.service";

export async function updatetripMemberController({
  userId,
  tripId,
  targetUserId,
  role,
}: {
  userId: string;
  tripId: string;
  targetUserId: string;
  role: "viewer" | "editor";
}) {
  return updateTripMemberRoleService({ userId, tripId, targetUserId, role });
}

export async function getTripMemberController({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  return getTripMembersService({ userId, tripId });
}
