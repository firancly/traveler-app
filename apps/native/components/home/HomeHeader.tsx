import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_TOP_GAP = 20;

type Props = {
	name?: string;
};

function greeting(hour: number): string {
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

// dark panel at the top; the quick plan card overlaps its bottom edge
export function HomeHeader({ name }: Props) {
	const insets = useSafeAreaInsets();
	const sageColor = useThemeColor("background");

	const firstName = name?.trim().split(" ")[0];
	const hello = greeting(new Date().getHours());
	const eyebrow = firstName
		? `${hello}, ${firstName} · Kuala Lumpur`
		: `${hello} · Kuala Lumpur`;

	return (
		<View
			className="rounded-b-[36px] bg-foreground px-6 pb-24"
			style={{ paddingTop: insets.top + HEADER_TOP_GAP }}
		>
			<View className="flex-row items-center gap-1.5">
				<Ionicons name="location-outline" size={14} color={sageColor} />
				<Text className="text-background/80 text-xs">{eyebrow}</Text>
			</View>
			<Text className="mt-2 font-bold text-4xl text-background">
				Where to next?
			</Text>
		</View>
	);
}
