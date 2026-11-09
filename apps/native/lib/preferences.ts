import AsyncStorage from "@react-native-async-storage/async-storage";

export const PACES = ["relaxed", "normal", "packed"];
export type Pace = (typeof PACES)[number];

const DEFAULT_PACE_KEY = "pref.default_pace";
const TRIP_REMINDERS_KEY = "pref.trip_reminders";

export async function setDefaultPace(pace: Pace): Promise<void> {
	await AsyncStorage.setItem(DEFAULT_PACE_KEY, pace);
}

export async function setTripReminders(enabled: boolean): Promise<void> {
	await AsyncStorage.setItem(TRIP_REMINDERS_KEY, String(enabled));
}
