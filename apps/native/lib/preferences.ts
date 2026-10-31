import AsyncStorage from "@react-native-async-storage/async-storage";

// Small on-device settings. Not synced to the account.

export const PACES = ["relaxed", "normal", "packed"] as const;
export type Pace = (typeof PACES)[number];

const DEFAULT_PACE_KEY = "pref.default_pace";
const TRIP_REMINDERS_KEY = "pref.trip_reminders";

function isPace(value: string | null): value is Pace {
	return PACES.some((pace) => pace === value);
}

export async function getDefaultPace(): Promise<Pace> {
	const stored = await AsyncStorage.getItem(DEFAULT_PACE_KEY);
	return isPace(stored) ? stored : "normal";
}

export async function setDefaultPace(pace: Pace): Promise<void> {
	await AsyncStorage.setItem(DEFAULT_PACE_KEY, pace);
}

export async function getTripReminders(): Promise<boolean> {
	return (await AsyncStorage.getItem(TRIP_REMINDERS_KEY)) === "true";
}

export async function setTripReminders(enabled: boolean): Promise<void> {
	await AsyncStorage.setItem(TRIP_REMINDERS_KEY, String(enabled));
}
