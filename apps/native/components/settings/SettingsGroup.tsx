import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
	title: string;
	children: ReactNode;
};

// titled white card; rows get a hairline between them
export function SettingsGroup({ title, children }: Props) {
	// toArray drops null/false children, so hidden rows leave no divider
	const rows = Children.toArray(children);

	return (
		<View className="gap-3">
			<Text className="font-bold text-foreground text-lg">{title}</Text>
			<View className="rounded-3xl bg-surface px-4">
				{rows.map((row, index) => (
					<Fragment key={isValidElement(row) && row.key ? row.key : index}>
						{index > 0 && <View className="h-px bg-border" />}
						{row}
					</Fragment>
				))}
			</View>
		</View>
	);
}
