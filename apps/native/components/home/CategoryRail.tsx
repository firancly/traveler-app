import { Ionicons } from "@expo/vector-icons";
import { PlaceCategory } from "@traveler-app/db/enums";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, ScrollView, Text } from "react-native";
import { CATEGORY_ICONS, CATEGORY_TINTS } from "@/lib/category-icons";

type Props = {
	onSelect: (category: PlaceCategory) => void;
};

const CATEGORIES = Object.values(PlaceCategory);

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function CategoryRail({ onSelect }: Props) {
	const foregroundColor = useThemeColor("foreground");

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerClassName="gap-3 px-5"
		>
			{CATEGORIES.map((category) => (
				<Pressable
					key={category}
					onPress={() => onSelect(category)}
					accessibilityRole="button"
					accessibilityLabel={`Browse ${category}`}
					className={cn(
						"h-32 w-28 justify-between rounded-3xl p-4 active:opacity-80",
						CATEGORY_TINTS[category],
					)}
				>
					<Ionicons
						name={CATEGORY_ICONS[category]}
						size={28}
						color={foregroundColor}
					/>
					<Text className="font-semibold text-foreground text-sm">
						{capitalize(category)}
					</Text>
				</Pressable>
			))}
		</ScrollView>
	);
}
