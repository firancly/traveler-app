import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { FieldRow } from "@/components/ui/FieldRow";
import { authClient } from "@/lib/auth-client";

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

type EditorProps = {
	initialName: string;
	onDone: () => void;
};

function NameEditor({ initialName, onDone }: EditorProps) {
	const [draft, setDraft] = useState(initialName);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const foregroundColor = useThemeColor("foreground");
	const mutedColor = useThemeColor("muted");
	const inkColor = useThemeColor("accent-foreground");

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
			<View className="flex-row items-center gap-2">
				<TextInput
					value={draft}
					onChangeText={setDraft}
					autoFocus
					maxLength={MAX_NAME_LENGTH}
					returnKeyType="done"
					onSubmitEditing={save}
					editable={!isSaving}
					accessibilityLabel="Name"
					placeholder="Your name"
					placeholderTextColor={mutedColor}
					className="flex-1 rounded-2xl bg-background px-4 py-3 font-semibold text-base text-foreground"
				/>
				<Pressable
					onPress={onDone}
					disabled={isSaving}
					hitSlop={6}
					accessibilityRole="button"
					accessibilityLabel="Cancel"
					className="h-11 w-11 items-center justify-center rounded-full bg-border"
				>
					<Ionicons name="close" size={20} color={foregroundColor} />
				</Pressable>
				<Pressable
					onPress={save}
					disabled={!canSave}
					hitSlop={6}
					accessibilityRole="button"
					accessibilityLabel="Save name"
					className={cn(
						"h-11 w-11 items-center justify-center rounded-full bg-accent",
						!canSave && !isSaving && "opacity-40",
					)}
				>
					{isSaving ? (
						<ActivityIndicator color={inkColor} />
					) : (
						<Ionicons name="checkmark" size={20} color={inkColor} />
					)}
				</Pressable>
			</View>
			{error && <Text className="text-danger text-xs">{error}</Text>}
		</View>
	);
}
