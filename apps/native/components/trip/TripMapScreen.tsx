import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useMemo, useRef, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Linking,
	Pressable,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DayPicker } from "@/components/trip/DayPicker";
import { RouteMap } from "@/components/trip/RouteMap";
import { StopStack } from "@/components/trip/StopStack";
import { EmptyState } from "@/components/ui/EmptyState";
import { ItemCard } from "@/components/ui/ItemCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { authClient } from "@/lib/auth-client";
import {
	defaultDayIndex,
	durationMinutes,
	groupByDay,
	mapsRouteUrl,
	routePins,
} from "@/lib/itinerary-days";
import { formatTime } from "@/lib/trip-dates";
import { trpc } from "@/utils/trpc";

// tall enough for the day cells, the card stack and the button
const COLLAPSED_SHEET_HEIGHT = 340;
const EXPANDED_SHEET_FRACTION = 0.62;
const SHEET_RADIUS = 32;

type Props = {
	tripId: string;
	onBack?: () => void; // shows the back button
	onDeleted?: () => void; // shows the delete button to the owner
	bottomOffset?: number; // space kept free below the sheet, e.g. the tab bar
	initialDay?: number; // 0-based day to open on; defaults to today/next
};

// map of the day's route with a sheet of stops on top
export function TripMapScreen({
	tripId,
	onBack,
	onDeleted,
	bottomOffset = 0,
	initialDay,
}: Props) {
	const insets = useSafeAreaInsets();
	const { height: windowHeight } = useWindowDimensions();
	const sheetRef = useRef<BottomSheet>(null);
	const [sheetIndex, setSheetIndex] = useState(0);
	const [pickedDay, setPickedDay] = useState<number | null>(initialDay ?? null);

	const surfaceColor = useThemeColor("surface");
	const borderColor = useThemeColor("border");
	const foregroundColor = useThemeColor("foreground");

	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();
	const tripQuery = useQuery(trpc.trips.getOne.queryOptions({ id: tripId }));
	const itemsQuery = useQuery(
		trpc.itinerary.getAll.queryOptions({ id: tripId }),
	);

	const updateItem = useMutation(
		trpc.itinerary.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.itinerary.getAll.queryFilter({ id: tripId }),
				);
				queryClient.invalidateQueries(trpc.trips.getAll.queryFilter());
			},
		}),
	);
	const deleteTrip = useMutation(
		trpc.trips.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.trips.getAll.queryFilter());
				router.back();
			},
		}),
	);

	const days = useMemo(
		() => groupByDay(itemsQuery.data ?? []),
		[itemsQuery.data],
	);
	const activeDay = Math.min(
		pickedDay ?? defaultDayIndex(days),
		Math.max(0, days.length - 1),
	);
	const stops = days[activeDay]?.items ?? [];
	const nextStop = stops.find((stop) => !stop.done);
	const doneCount = stops.filter((stop) => stop.done).length;

	const pins = useMemo(() => routePins(stops), [stops]);

	// remaining stops for the day, or the whole day once everything is ticked
	const remainingPins = pins.filter((pin) => pin.state !== "done");
	const routeUrl = mapsRouteUrl(
		remainingPins.length > 0 ? remainingPins : pins,
	);

	// with a tab bar below, the bar already covers the home indicator
	const sheetBottomPadding = bottomOffset > 0 ? 16 : insets.bottom + 16;
	const collapsedHeight =
		COLLAPSED_SHEET_HEIGHT + (bottomOffset > 0 ? 0 : insets.bottom);
	const snapPoints = useMemo(
		() => [collapsedHeight, `${EXPANDED_SHEET_FRACTION * 100}%`],
		[collapsedHeight],
	);
	const sheetCover =
		bottomOffset +
		(sheetIndex === 0
			? collapsedHeight
			: windowHeight * EXPANDED_SHEET_FRACTION);

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
					onAction={onBack ?? (() => router.push("/trips"))}
				/>
			</View>
		);
	}

	const canDelete = !!onDeleted && session?.user.id === trip.ownerId;
	const togglingId = updateItem.isPending
		? updateItem.variables?.id
		: undefined;

	function toggleStop(stop: { id: string; done: boolean; version: number }) {
		updateItem.mutate({
			id: stop.id,
			done: !stop.done,
			version: stop.version,
		});
	}

	function openInMaps() {
		if (!routeUrl) return;
		Linking.openURL(routeUrl).catch(() =>
			Alert.alert("Couldn't open Maps", "Try again in a moment."),
		);
	}

	function confirmDelete() {
		Alert.alert(
			"Delete this trip?",
			`"${trip?.name}" and all its stops will be deleted. You can't undo this.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete trip",
					style: "destructive",
					onPress: () => deleteTrip.mutate({ id: tripId }),
				},
			],
		);
	}

	return (
		<View className="flex-1 bg-background">
			<RouteMap pins={pins} bottomInset={sheetCover} />

			<View
				className="absolute right-5 left-5 flex-row items-center gap-3"
				style={{ top: insets.top + 8 }}
			>
				{onBack && (
					<RoundButton
						icon="chevron-back"
						label="Back"
						color={foregroundColor}
						onPress={onBack}
					/>
				)}
				<View className="h-12 flex-1 justify-center rounded-full bg-surface px-4">
					<Text
						className="font-semibold text-foreground text-sm"
						numberOfLines={1}
					>
						{trip.name}
					</Text>
				</View>
				{canDelete && (
					<RoundButton
						icon="trash-outline"
						label="Delete trip"
						color={foregroundColor}
						onPress={confirmDelete}
					/>
				)}
			</View>

			<BottomSheet
				ref={sheetRef}
				index={0}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				bottomInset={bottomOffset}
				onChange={setSheetIndex}
				backgroundStyle={{
					backgroundColor: surfaceColor,
					borderRadius: SHEET_RADIUS,
				}}
				handleIndicatorStyle={{ backgroundColor: borderColor, width: 48 }}
			>
				<BottomSheetScrollView
					contentContainerStyle={{
						gap: 16,
						paddingHorizontal: 20,
						paddingBottom: sheetBottomPadding,
					}}
				>
					{days.length === 0 ? (
						<Text className="py-6 text-center text-muted text-sm">
							This trip has no stops yet.
						</Text>
					) : (
						<DayPicker
							days={days}
							activeIndex={activeDay}
							onSelect={setPickedDay}
							done={doneCount}
							total={stops.length}
						/>
					)}

					{sheetIndex === 0 ? (
						days.length > 0 && (
							<StopStack
								stop={
									nextStop && {
										title: nextStop.title,
										startAt: nextStop.startAt,
										endAt: nextStop.endAt,
										category: nextStop.place?.category,
									}
								}
								peekCount={stops.length - doneCount - 1}
								isToggling={togglingId === nextStop?.id}
								onExpand={() => sheetRef.current?.snapToIndex(1)}
								onToggle={() => nextStop && toggleStop(nextStop)}
							/>
						)
					) : (
						<View className="gap-2">
							{stops.map((stop) => (
								<ItemCard
									key={stop.id}
									title={stop.title}
									startTime={formatTime(stop.startAt)}
									durationMin={durationMinutes(stop.startAt, stop.endAt)}
									description={stop.notes ?? undefined}
									category={stop.place?.category}
									done={stop.done}
									isNext={stop.id === nextStop?.id}
									onToggle={() => toggleStop(stop)}
								/>
							))}
						</View>
					)}

					<PrimaryButton
						label="Open route in Maps"
						onPress={openInMaps}
						disabled={!routeUrl}
					/>
				</BottomSheetScrollView>
			</BottomSheet>
		</View>
	);
}

type RoundButtonProps = {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	color: string;
	onPress: () => void;
};

function RoundButton({ icon, label, color, onPress }: RoundButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}
			className="h-12 w-12 items-center justify-center rounded-full bg-surface shadow-md active:opacity-80"
		>
			<Ionicons name={icon} size={22} color={color} />
		</Pressable>
	);
}
