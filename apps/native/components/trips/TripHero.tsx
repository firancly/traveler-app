import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { MetaPill } from "@/components/ui/MetaPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
	currentDay,
	formatDateRange,
	TRIP_STATUS_LABEL,
	tripDays,
	tripStatus,
} from "@/lib/trip-dates";

type DateValue = string | Date | null;

type Props = {
	name: string;
	startDate: DateValue;
	endDate: DateValue;
	stops: number;
	done: number;
	nextStopTitle?: string;
	canDelete?: boolean;
	onPress: () => void;
	onDelete?: () => void;
};

// big dark card for the most recently updated trip
export function TripHero({
	name,
	startDate,
	endDate,
	stops,
	done,
	nextStopTitle,
	canDelete,
	onPress,
	onDelete,
}: Props) {
	const sageColor = useThemeColor("background");
	const foregroundColor = useThemeColor("foreground");

	const status = tripStatus(startDate, endDate);
	const days = tripDays(startDate, endDate);
	const dateLine =
		status === "in-progress"
			? `${formatDateRange(startDate, endDate)} · Day ${currentDay(startDate)} of ${days}`
			: formatDateRange(startDate, endDate);
	const nextLine = nextStopTitle
		? `Next: ${nextStopTitle}`
		: stops > 0 && done >= stops
			? "All stops done"
			: "";

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={`Open ${name}`}
			className="gap-4 rounded-3xl bg-foreground p-3 active:opacity-95"
		>
			<View className="h-40 justify-between overflow-hidden rounded-2xl bg-category-nature p-3">
				<RouteSketch />

				<View className="flex-row items-start justify-between">
					<MetaPill label={TRIP_STATUS_LABEL[status]} />
					{canDelete && (
						<Pressable
							onPress={onDelete}
							hitSlop={8}
							accessibilityRole="button"
							accessibilityLabel="Delete trip"
							className="h-9 w-9 items-center justify-center rounded-full bg-surface"
						>
							<Ionicons
								name="trash-outline"
								size={16}
								color={foregroundColor}
							/>
						</Pressable>
					)}
				</View>
				<View className="flex-row gap-2">
					<MetaPill
						icon="calendar-outline"
						label={`${days} ${days === 1 ? "day" : "days"}`}
					/>
					<MetaPill
						icon="location-outline"
						label={`${stops} ${stops === 1 ? "stop" : "stops"}`}
					/>
				</View>
			</View>

			<View className="gap-1 px-1">
				<Text className="font-bold text-2xl text-background" numberOfLines={2}>
					{name}
				</Text>
				<Text className="text-background/70 text-xs">{dateLine}</Text>
			</View>

			<View className="gap-2 px-1">
				<Text className="text-background/70 text-xs">
					{done} of {stops} stops done
				</Text>
				<ProgressBar
					done={done}
					total={stops}
					trackClassName="flex-none bg-background/20"
					fillClassName="bg-background"
				/>
			</View>

			<View className="flex-row items-center gap-2 px-1 pb-1">
				<Ionicons name="time-outline" size={16} color={sageColor} />
				<Text
					className="flex-1 font-semibold text-background text-xs"
					numberOfLines={1}
				>
					{nextLine}
				</Text>
				<View className="flex-row items-center gap-1 rounded-full bg-surface px-4 py-2">
					<Text className="font-semibold text-foreground text-xs">
						View itinerary
					</Text>
					<Ionicons name="chevron-forward" size={14} color={foregroundColor} />
				</View>
			</View>
		</Pressable>
	);
}

// PLACEHOLDER: decorative route drawing until we render a real map
function RouteSketch() {
	return (
		<View className="absolute inset-0" pointerEvents="none">
			<View className="absolute top-6 left-6 h-16 w-24 rounded-full bg-default-soft-hover" />
			<View className="absolute right-4 bottom-4 h-20 w-28 rounded-full bg-default-soft-hover" />
			<View className="absolute top-[30%] left-[58%] h-[35%] w-0.5 bg-foreground" />
			<View className="absolute top-[65%] left-[38%] h-0.5 w-[20%] bg-foreground" />
			<View className="absolute top-[26%] left-[56%] h-3 w-3 rounded-full bg-foreground" />
			<View className="absolute top-[45%] left-[56%] h-3 w-3 rounded-full bg-foreground" />
			<View className="absolute top-[61%] left-[36%] h-3 w-3 rounded-full bg-foreground" />
			<View className="absolute top-[61%] left-[56%] h-3 w-3 rounded-full bg-foreground" />
		</View>
	);
}
