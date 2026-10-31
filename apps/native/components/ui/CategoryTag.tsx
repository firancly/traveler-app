import type { PlaceCategory } from "@traveler-app/db";
import { cn } from "heroui-native";
import { Text, View } from "react-native";
import { CATEGORY_TINTS } from "@/lib/category-icons";

export function CategoryTag({ category }: { category: PlaceCategory }) {
	return (
		<View
			className={cn(
				"self-start rounded-full px-3 py-1",
				CATEGORY_TINTS[category],
			)}
		>
			<Text className="font-medium text-foreground text-xs">{category}</Text>
		</View>
	);
}
