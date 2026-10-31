import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { FocusedStatusBar } from "@/components/FocusedStatusBar";
import { NameRow } from "@/components/settings/NameRow";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { FieldRow } from "@/components/ui/FieldRow";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { authClient } from "@/lib/auth-client";
import { useTabBarSpace } from "@/lib/tab-bar";
import { queryClient } from "@/utils/trpc";

type User = typeof authClient.$Infer.Session.user;

const APP_VERSION = Constants.expoConfig?.version ?? "";

export default function Profile() {
	const { data: session, isPending } = authClient.useSession();
	const [isEditingName, setIsEditingName] = useState(false);
	const bottomSpace = useTabBarSpace();

	if (isPending) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator />
			</View>
		);
	}

	const user = session?.user;

	return (
		<View className="flex-1 bg-background">
			<FocusedStatusBar style="light" />
			<ScrollView
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ paddingBottom: bottomSpace }}
			>
				<SettingsHeader
					name={user?.name}
					email={user?.email}
					onEditAvatar={user ? () => setIsEditingName(true) : undefined}
				/>

				<View className="gap-6 px-5 pt-4">
					{user ? (
						<>
							<SettingsGroup title="Account">
								<NameRow
									name={user.name}
									isEditing={isEditingName}
									onStartEdit={() => setIsEditingName(true)}
									onDone={() => setIsEditingName(false)}
								/>
								<FieldRow
									icon="mail-outline"
									label="Email · used to sign in"
									value={user.email}
									locked
								/>
							</SettingsGroup>
							<PreferencesSection />
						</>
					) : (
						<PrimaryButton
							label="Sign in"
							onPress={() => router.push("/(auth)/sign-in")}
						/>
					)}

					<AboutSection />

					{user && <AccountActions user={user} />}
				</View>
			</ScrollView>
		</View>
	);
}

// PLACEHOLDER: no policy or terms pages exist yet
function showComingSoon(title: string) {
	Alert.alert(title, "Coming soon.");
}

function AboutSection() {
	return (
		<SettingsGroup title="About">
			<FieldRow
				icon="shield-outline"
				value="Privacy policy"
				onPress={() => showComingSoon("Privacy policy")}
			/>
			<FieldRow
				icon="document-text-outline"
				value="Terms of use"
				onPress={() => showComingSoon("Terms of use")}
			/>
			<FieldRow
				icon="information-circle-outline"
				value="Version"
				right={
					APP_VERSION ? (
						<Text className="text-muted text-sm">v{APP_VERSION}</Text>
					) : null
				}
			/>
		</SettingsGroup>
	);
}

function AccountActions({ user }: { user: User }) {
	const [isBusy, setIsBusy] = useState(false);

	async function signOut() {
		setIsBusy(true);
		try {
			await authClient.signOut();
			queryClient.clear();
		} catch {
			Alert.alert(
				"Couldn't sign out",
				"Check your connection, then try again.",
			);
		} finally {
			setIsBusy(false);
		}
	}

	async function deleteAccount() {
		setIsBusy(true);
		try {
			const result = await authClient.deleteUser();
			if (result.error) {
				Alert.alert(
					"Couldn't delete your account",
					result.error.message ?? "Sign out, sign in again, then retry.",
				);
				return;
			}
			queryClient.clear();
		} catch {
			Alert.alert(
				"Couldn't delete your account",
				"Check your connection, then try again.",
			);
		} finally {
			setIsBusy(false);
		}
	}

	function confirmDelete() {
		Alert.alert(
			"Delete your account?",
			`${user.email} and every trip you own will be deleted. You can't undo this.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete account",
					style: "destructive",
					onPress: deleteAccount,
				},
			],
		);
	}

	return (
		<View className="items-center gap-4">
			<Pressable
				onPress={signOut}
				disabled={isBusy}
				accessibilityRole="button"
				accessibilityState={{ disabled: isBusy }}
				className="h-14 w-full items-center justify-center rounded-full bg-surface active:opacity-80"
			>
				<Text className="font-bold text-base text-foreground">Sign out</Text>
			</Pressable>
			<Pressable
				onPress={confirmDelete}
				disabled={isBusy}
				hitSlop={8}
				accessibilityRole="button"
			>
				<Text className="font-semibold text-danger text-sm">
					Delete account
				</Text>
			</Pressable>
		</View>
	);
}
