import prisma from "@traveler-app/db";

const places = await prisma.place.findMany({
	where: {
		latitude: { gte: 3.25 - 0.05, lte: 3.25 + 0.05 },
		longitude: { gte: 101.8 - 0.05, lte: 101.8 + 0.05 },
	},
	select: {
		name: true,
		category: true,
		score: true,
		latitude: true,
		longitude: true,
	},
	orderBy: { score: "desc" },
	take: 20,
});

const groups = await prisma.place.groupBy({
	by: ["category"],
	where: { openingHours: { not: null } },
	_count: { openingHours: true },
	orderBy: { _count: { openingHours: "desc" } },
	take: 10,
});

const fivePlaces = await prisma.place.findMany({
	select: { name: true, category: true, verified: true, id: true },
	take: 5,
});

const verified = await prisma.$transaction(async (tx) => {
	const places = await tx.place.updateMany({
		where: { id: { in: fivePlaces.map((p) => p.id) } },
		data: { verified: true },
	});
});

console.log("total:", await prisma.place.count());
// console.table(places);
// console.table(
// 	groups.map((g) => ({
// 		category: g.category,
// 		count: g._count.openingHours,
// 	})),
// );
console.table(
	fivePlaces.map((p) => ({ ...p, verified: p.verified ? "yes" : "no" })),
);
