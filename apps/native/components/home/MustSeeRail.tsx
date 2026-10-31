import { Ionicons } from "@expo/vector-icons";
import type { PlaceCategory } from "@traveler-app/db/enums";
import { cn, useThemeColor } from "heroui-native";
import { ScrollView, Text, View } from "react-native";
import { CATEGORY_ICONS, CATEGORY_TINTS } from "@/lib/category-icons";

type Place = {
	id: string;
	name: string;
	category: PlaceCategory;
};

type Props = {
	places: readonly Place[];
};

// Places have no photos, so each card is a category tint + icon.
export function MustSeeRail({ places }: Props) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerClassName="gap-3 px-5"
		>
			{places.map((place) => (
				<PlaceCard key={place.id} place={place} />
			))}
		</ScrollView>
	);
}

function PlaceCard({ place }: { place: Place }) {
	const foregroundColor = useThemeColor("foreground");

	return (
		<View
			accessible
			accessibilityLabel={`${place.name}, ${place.category}, guide verified`}
			className={cn(
				"h-52 w-44 justify-between rounded-3xl p-4",
				CATEGORY_TINTS[place.category],
			)}
		>
			<VerifiedBadge />
			<Ionicons
				name={CATEGORY_ICONS[place.category]}
				size={32}
				color={foregroundColor}
			/>
			<View>
				<Text className="font-bold text-base text-foreground" numberOfLines={2}>
					{place.name}
				</Text>
				<Text className="text-foreground/70 text-xs capitalize">
					{place.category}
				</Text>
			</View>
		</View>
	);
}

function VerifiedBadge() {
	const sageColor = useThemeColor("background");

	return (
		<View className="flex-row items-center gap-1 self-start rounded-full bg-foreground px-2.5 py-1">
			<Ionicons name="shield-checkmark-outline" size={12} color={sageColor} />
			<Text className="font-medium text-[11px] text-background">
				Guide verified
			</Text>
		</View>
	);
}
