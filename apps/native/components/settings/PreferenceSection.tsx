import { useThemeColor } from "heroui-native";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import {
	PACES,
	type Pace,
	setDefaultPace,
	setTripReminders,
} from "@/lib/preferences";
import { FieldRow } from "../ui/FieldRow";
import { SegmentControl } from "../ui/SegmentControl";
import SettingsGroup from "./SettingsGroup";

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function saveFailed() {
	Alert.alert("Couldn't save", "Try again in a moment.");
}

export default function PreferenceSection() {
	const [pace, setPace] = useState<Pace>("normal");
	const [isPickingPace, setIsPickingPace] = useState(false);
	const [hasReminders, setHasReminders] = useState(false);

	const foregroundColor = useThemeColor("foreground");
	const borderColor = useThemeColor("border");
	const surfaceColor = useThemeColor("surface");

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

			{/* UPDATE LATER: placeholder for now, nothing sends reminders yet */}
			<FieldRow
				icon="notifications-outline"
				label="Morning of each trip day"
				value="Trip day reminders"
				right={
					<Switch
						value={hasReminders}
						onValueChange={toggleReminders}
						trackColor={{ false: borderColor, true: foregroundColor }}
						thumbColor={surfaceColor}
					/>
				}
			/>
		</SettingsGroup>
	);
}
