import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { authClient } from "@/lib/auth-client";
import { FieldRow } from "../ui/FieldRow";

const MAX_NAME_LENGTH = 50;
const SAVE_ERROR = "Couldn't save your name. Try again.";

type Props = {
	name: string;
	isEditing: boolean;
	onStartEdit: () => void;
	onDone: () => void;
};

export function NameRow({ name, isEditing, onStartEdit, onDone }: Props) {
	if (!isEditing) {
		return (
			<FieldRow
				icon="person-circle-outline"
				label="Name"
				value={name}
				onPress={onStartEdit}
			/>
		);
	}
	return <NameEditor initialName={name} onDone={onDone} />;
}

export function NameEditor({
	initialName,
	onDone,
}: {
	initialName: string;
	onDone: () => void;
}) {
	const [draft, setDraft] = useState(initialName);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const foregroundColor = useThemeColor("foreground");

	const trimmed = draft.trim();
	const canSave = trimmed.length > 0 && trimmed !== initialName && !isSaving;

	async function save() {
		if (!canSave) return;

		setIsSaving(true);
		setError(null);

		try {
			const result = await authClient.updateUser({ name: trimmed });

			if (result.error) {
				setError(SAVE_ERROR);
				return;
			}
			onDone();
		} catch {
			setError(SAVE_ERROR);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<View className="gap-1 py-3">
			<Text className="text-muted text-xs">Name</Text>
			<View>
				<TextInput
					value={draft}
					onChangeText={setDraft}
					autoFocus
					maxLength={MAX_NAME_LENGTH}
					returnKeyType="done"
					onSubmitEditing={save}
					editable={!isSaving}
					className="flex-1 rounded-2xl bg-background px-4 py-3 font-semibold text-base text-foreground"
				/>

				<Pressable
					onPress={onDone}
					disabled={isSaving}
					hitSlop={6}
					className="h-11 w-11 items-center justify-center rounded-full bg-border"
				>
					<Ionicons name="close" size={20} color={foregroundColor} />
				</Pressable>

				<Pressable
					onPress={save}
					disabled={!canSave}
					hitSlop={6}
					className={cn(
						"h-11 w-11 items-center justify-center rounded-full bg-accent",
						!canSave && !isSaving && "opacity-45",
					)}
				>
					{isSaving ? (
						<ActivityIndicator color={foregroundColor} />
					) : (
						<Ionicons name="checkmark" size={20} color={foregroundColor} />
					)}
				</Pressable>
			</View>

			{error && <Text className="text-danger text-sm">{error}</Text>}
		</View>
	);
}
