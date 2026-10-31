import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { PinState, RoutePin } from "@/lib/itinerary-days";

export type { PinState, RoutePin };

type Props = {
	pins: readonly RoutePin[];
	bottomInset: number; // height covered by the sheet
	isInteractive?: boolean; // false for a static preview inside a scroll view
};

const KL_REGION = {
	latitude: 3.1478,
	longitude: 101.6953,
	latitudeDelta: 0.08,
	longitudeDelta: 0.08,
};
const TOP_CHROME = 72; // back button row
const SIDE_PADDING = 48;
const ROUTE_WIDTH = 4;

export function RouteMap({ pins, bottomInset, isInteractive = true }: Props) {
	const mapRef = useRef<MapView>(null);
	const [isReady, setIsReady] = useState(false);
	const insets = useSafeAreaInsets();
	const routeColor = useThemeColor("foreground");

	// re-centre on the route when the day or the sheet height changes
	useEffect(() => {
		if (!isReady || pins.length === 0) return;
		mapRef.current?.fitToCoordinates(
			pins.map(({ latitude, longitude }) => ({ latitude, longitude })),
			{
				edgePadding: {
					top: insets.top + TOP_CHROME,
					right: SIDE_PADDING,
					bottom: bottomInset + SIDE_PADDING,
					left: SIDE_PADDING,
				},
				animated: true,
			},
		);
	}, [isReady, pins, bottomInset, insets.top]);

	return (
		<MapView
			ref={mapRef}
			style={{ flex: 1 }}
			initialRegion={KL_REGION}
			onMapReady={() => setIsReady(true)}
			showsPointsOfInterests={false}
			toolbarEnabled={false}
			scrollEnabled={isInteractive}
			zoomEnabled={isInteractive}
			rotateEnabled={isInteractive}
			pitchEnabled={isInteractive}
			userInterfaceStyle="light"
		>
			{pins.length > 1 && (
				<Polyline
					coordinates={pins.map(({ latitude, longitude }) => ({
						latitude,
						longitude,
					}))}
					strokeColor={routeColor}
					strokeWidth={ROUTE_WIDTH}
				/>
			)}
			{pins.map((pin) => (
				<Marker
					// remount when the state changes so the custom view redraws
					key={`${pin.id}-${pin.state}`}
					coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
					anchor={{ x: 0.5, y: 0.5 }}
					zIndex={pin.state === "next" ? 2 : 1}
				>
					<PinBadge number={pin.number} state={pin.state} />
				</Marker>
			))}
		</MapView>
	);
}

function PinBadge({ number, state }: { number: number; state: PinState }) {
	const sageColor = useThemeColor("background");

	if (state === "done") {
		return (
			<View className="h-8 w-8 items-center justify-center rounded-full bg-foreground">
				<Ionicons name="checkmark" size={16} color={sageColor} />
			</View>
		);
	}

	const isNext = state === "next";
	return (
		<View
			className={cn(
				"items-center justify-center rounded-full border-2 border-foreground",
				isNext ? "h-11 w-11 bg-accent" : "h-8 w-8 bg-surface",
			)}
		>
			<Text
				className={cn(
					"font-bold text-foreground",
					isNext ? "text-base" : "text-xs",
				)}
			>
				{number}
			</Text>
		</View>
	);
}
