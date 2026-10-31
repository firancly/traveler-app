import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useMemo } from "react";
import {
	ActivityIndicator,
	Alert,
	Linking,
	Pressable,
	ScrollView,
	Share,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DayRow } from "@/components/overview/DayRow";
import { OverviewStats } from "@/components/overview/OverviewStats";
import { type TripTool, TripTools } from "@/components/overview/TripTools";
import { UpNextCard } from "@/components/overview/UpNextCard";
import { RouteMap } from "@/components/trip/RouteMap";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDate } from "@/lib/format-date";
import {
	defaultDayIndex,
	groupByDay,
	isTodayKey,
	mapsRouteUrl,
	routePins,
} from "@/lib/itinerary-days";
import { useTabBarSpace } from "@/lib/tab-bar";
import {
	formatDateRange,
	formatTime,
	TRIP_STATUS_LABEL,
	tripDays,
	tripStatus,
} from "@/lib/trip-dates";
import { trpc } from "@/utils/trpc";

const MAP_HEIGHT = 300;
const MAP_BOTTOM_PADDING = 24;

type Props = {
	tripId: string;
};

// summary of one trip: route preview, stats, tools, next stop and days
export function TripOverview({ tripId }: Props) {
	const insets = useSafeAreaInsets();
	const bottomSpace = useTabBarSpace();
	const foregroundColor = useThemeColor("foreground");

	const tripQuery = useQuery(trpc.trips.getOne.queryOptions({ id: tripId }));
	const itemsQuery = useQuery(
		trpc.itinerary.getAll.queryOptions({ id: tripId }),
	);

	const items = itemsQuery.data ?? [];
	const days = useMemo(
		() => groupByDay(itemsQuery.data ?? []),
		[itemsQuery.data],
	);
	// today while the trip runs, else the first day with stops left
	const dayIndex = defaultDayIndex(days);
	const day = days[dayIndex];
	const pins = useMemo(() => routePins(day?.items ?? []), [day]);

	if (tripQuery.isPending || itemsQuery.isPending) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator />
			</View>
		);
	}

	const trip = tripQuery.data;
	if (!trip) {
		return (
			<View
				className="flex-1 bg-background px-5"
				style={{ paddingTop: insets.top }}
			>
				<EmptyState
					icon="map-outline"
					title="Trip not found"
					message="It may have been deleted, or you no longer have access."
					actionLabel="Go to my trips"
					onAction={() => router.push("/trips")}
				/>
			</View>
		);
	}

	const dayStops = day?.items ?? [];
	const nextIndex = dayStops.findIndex((stop) => !stop.done);
	const nextStop = nextIndex === -1 ? undefined : dayStops[nextIndex];
	const isToday = day ? isTodayKey(day.key) : false;

	const doneCount = items.filter((item) => item.done).length;
	const tripLength = tripDays(trip.startDate, trip.endDate);
	const dateRange = formatDateRange(trip.startDate, trip.endDate);
	const status = TRIP_STATUS_LABEL[tripStatus(trip.startDate, trip.endDate)];

	const remaining = pins.filter((pin) => pin.state !== "done");
	const dayRouteUrl = mapsRouteUrl(remaining.length > 0 ? remaining : pins);
	const nextPin = pins.find((pin) => pin.state === "next");
	const nextStopUrl = nextPin ? mapsRouteUrl([nextPin]) : null;

	function openMap(index = dayIndex) {
		router.push({
			pathname: "/trip/[id]",
			params: { id: tripId, day: String(index) },
		});
	}

	function openUrl(url: string | null) {
		if (!url) return;
		Linking.openURL(url).catch(() =>
			Alert.alert("Couldn't open Maps", "Try again in a moment."),
		);
	}

	function shareTrip() {
		const stops = `${items.length} ${items.length === 1 ? "stop" : "stops"}`;
		Share.share({
			message: `${trip?.name} · Kuala Lumpur · ${dateRange} · ${stops}`,
		}).catch(() => Alert.alert("Couldn't share", "Try again in a moment."));
	}

	const tools: TripTool[] = [
		{ icon: "map-outline", label: "Map", onPress: () => openMap() },
		{ icon: "list-outline", label: "Itinerary", onPress: () => openMap() },
		{
			icon: "navigate-outline",
			label: "Directions",
			onPress: () => openUrl(dayRouteUrl),
			disabled: !dayRouteUrl,
		},
		{ icon: "share-social-outline", label: "Share", onPress: shareTrip },
	];

	return (
		<ScrollView
			className="flex-1 bg-background"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: bottomSpace }}
		>
			<View style={{ height: MAP_HEIGHT }}>
				<RouteMap
					pins={pins}
					bottomInset={MAP_BOTTOM_PADDING}
					isInteractive={false}
				/>
				<Pressable
					onPress={() => openMap()}
					accessibilityRole="button"
					accessibilityLabel="Open the route map"
					className="absolute inset-0"
				/>
				<Pressable
					onPress={shareTrip}
					accessibilityRole="button"
					accessibilityLabel="Share trip"
					className="absolute right-5 h-12 w-12 items-center justify-center rounded-full bg-surface shadow-md active:opacity-80"
					style={{ top: insets.top + 8 }}
				>
					<Ionicons
						name="share-social-outline"
						size={20}
						color={foregroundColor}
					/>
				</Pressable>
			</View>

			<View className="gap-6 px-5 pt-5">
				<View className="gap-1">
					<Text className="text-muted text-xs">Kuala Lumpur · {status}</Text>
					<Text className="font-bold text-4xl text-foreground">
						{trip.name}
					</Text>
				</View>

				<OverviewStats
					stats={[
						{ icon: "calendar-outline", value: dateRange, label: "Dates" },
						{
							icon: "time-outline",
							value: `${tripLength} ${tripLength === 1 ? "day" : "days"}`,
							label: "Duration",
						},
						{
							icon: "location-outline",
							value: `${items.length} ${items.length === 1 ? "stop" : "stops"}`,
							label: `${doneCount} done`,
						},
					]}
				/>

				<View>
					<SectionHeader title="Trip tools" />
					<TripTools tools={tools} />
				</View>

				{day && (
					<View>
						<SectionHeader title="Up next" />
						{nextStop ? (
							<UpNextCard
								title={nextStop.title}
								category={nextStop.place?.category}
								startAt={nextStop.startAt}
								endAt={nextStop.endAt}
								notes={nextStop.notes}
								dayLabel={dayLabel(isToday, nextStop.startAt)}
								stopLabel={`Day ${dayIndex + 1} · stop ${nextIndex + 1} of ${dayStops.length}`}
								onDirections={
									nextStopUrl ? () => openUrl(nextStopUrl) : undefined
								}
							/>
						) : (
							<View className="rounded-3xl bg-surface p-4">
								<Text className="text-muted text-sm">
									{isToday
										? "Every stop today is done."
										: "Every stop on this trip is done."}
								</Text>
							</View>
						)}
					</View>
				)}

				{days.length > 0 && (
					<View>
						<SectionHeader title="Days" />
						<View className="gap-3">
							{days.map((group, index) => (
								<DayRow
									key={group.key}
									weekday={group.weekday}
									date={group.date}
									title={
										isTodayKey(group.key)
											? `Day ${index + 1} · Today`
											: `Day ${index + 1}`
									}
									subtitle={daySubtitle(group.items)}
									done={group.items.filter((stop) => stop.done).length}
									total={group.items.length}
									isToday={isTodayKey(group.key)}
									onPress={() => openMap(index)}
								/>
							))}
						</View>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

type TimedStop = {
	startAt: string | Date | null;
	endAt: string | Date | null;
};

function dayLabel(isToday: boolean, startAt: string | Date | null): string {
	if (isToday) return "Today";
	return startAt ? formatDate(new Date(startAt)) : "";
}

// "9:30 am - 8:30 pm · 5 stops"
function daySubtitle(stops: readonly TimedStop[]): string {
	const count = `${stops.length} ${stops.length === 1 ? "stop" : "stops"}`;
	const first = formatTime(stops[0]?.startAt ?? null);
	const last = formatTime(stops[stops.length - 1]?.endAt ?? null);
	return first && last ? `${first} - ${last} · ${count}` : count;
}
