import { useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import { Alert, Switch, View } from "react-native";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { FieldRow } from "@/components/ui/FieldRow";
import { SegmentControl } from "@/components/ui/SegmentControl";
import {
	getDefaultPace,
	getTripReminders,
	PACES,
	type Pace,
	setDefaultPace,
	setTripReminders,
} from "@/lib/preferences";

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function saveFailed() {
	Alert.alert("Couldn't save", "Try again in a moment.");
}

export function PreferencesSection() {
	const [pace, setPace] = useState<Pace>("normal");
	const [isPickingPace, setIsPickingPace] = useState(false);
	const [hasReminders, setHasReminders] = useState(false);

	const foregroundColor = useThemeColor("foreground");
	const borderColor = useThemeColor("border");
	const surfaceColor = useThemeColor("surface");

	useEffect(() => {
		let isActive = true;
		Promise.all([getDefaultPace(), getTripReminders()])
			.then(([savedPace, savedReminders]) => {
				if (!isActive) return;
				setPace(savedPace);
				setHasReminders(savedReminders);
			})
			.catch(() => {}); // keep the defaults if storage can't be read
		return () => {
			isActive = false;
		};
	}, []);

	function choosePace(next: Pace) {
		setPace(next);
		setIsPickingPace(false);
		setDefaultPace(next).catch(saveFailed);
	}

	function toggleReminders(enabled: boolean) {
		setHasReminders(enabled);
		setTripReminders(enabled).catch(saveFailed);
	}

	return (
		<SettingsGroup title="Preferences">
			<View>
				<FieldRow
					icon="speedometer-outline"
					label="Default pace for new trips"
					value={capitalize(pace)}
					onPress={() => setIsPickingPace((open) => !open)}
				/>
				{isPickingPace && (
					<SegmentControl
						options={PACES}
						value={pace}
						onChange={choosePace}
						className="mb-3"
					/>
				)}
			</View>
			{/* PLACEHOLDER: saved on the phone, but nothing sends reminders yet */}
			<FieldRow
				icon="notifications-outline"
				label="Morning of each trip day"
				value="Trip day reminders"
				right={
					<Switch
						value={hasReminders}
						onValueChange={toggleReminders}
						accessibilityLabel="Trip day reminders"
						trackColor={{ false: borderColor, true: foregroundColor }}
						thumbColor={surfaceColor}
					/>
				}
			/>
		</SettingsGroup>
	);
}
