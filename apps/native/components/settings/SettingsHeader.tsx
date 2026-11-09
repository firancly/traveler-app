import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_TOP_GAP = 12;

type Props = {
	name?: string;
	email?: string;
	onEditAvatar?: () => void;
};

function initials(name?: string): string {
	const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
	return parts
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

export default function SectionHeader({ name, email, onEditAvatar }: Props) {
	const insets = useSafeAreaInsets();

	const letters = initials(name);

	const foregroundColor = useThemeColor("foreground");

	return (
		<View>
			<View
				className="items-center bg-foreground pb-20"
				style={{ paddingTop: insets.top + HEADER_TOP_GAP }}
			>
				<Text className="font-bold text-background text-lg">Settings</Text>
			</View>

			<View className="-mt-10 items-center rounded-t-[36px] bg-background pb-2">
				<View className="-mt-12">
					<View className="h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-category-nature">
						{letters ? (
							<Text className="font-bold text-3xl text-foreground">
								{letters}
							</Text>
						) : (
							<Ionicons name="person" size={36} color={foregroundColor} />
						)}
					</View>

					{onEditAvatar && (
						<Pressable
							onPress={onEditAvatar}
							hitSlop={8}
							className="absolute right-0 bottom-0 h-9 w-9 items-center justify-center rounded-full bg-surface shadow-md"
						>
							<Ionicons name="pencil" size={16} color={foregroundColor} />
						</Pressable>
					)}
				</View>

				<Text className="mt-3 font-bold text-foreground text-xl">
					{name || "Not signed in"}
				</Text>

				{email ? <Text className="text-muted text-sm">{email}</Text> : null}
			</View>
		</View>
	);
}
