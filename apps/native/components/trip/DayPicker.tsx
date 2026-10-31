import { ScrollView, Text, View } from "react-native";
import { Day } from "@/components/ui/Day";

type DayCell = { key: string; weekday: string; date: number };

type Props = {
	days: readonly DayCell[];
	activeIndex: number;
	onSelect: (index: number) => void;
	done: number; // ticked stops on the active day
	total: number; // stops on the active day
};

export function DayPicker({ days, activeIndex, onSelect, done, total }: Props) {
	return (
		<View className="flex-row items-center gap-3">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-2"
				className="flex-1"
			>
				{days.map((day, index) => (
					<Day
						key={day.key}
						weekday={day.weekday}
						date={day.date}
						selected={index === activeIndex}
						onPress={() => onSelect(index)}
					/>
				))}
			</ScrollView>

			<View className="items-end">
				<Text className="font-bold text-base text-foreground">
					Day {activeIndex + 1} of {days.length}
				</Text>
				<Text className="text-muted text-xs">
					{done} of {total} done
				</Text>
			</View>
		</View>
	);
}
