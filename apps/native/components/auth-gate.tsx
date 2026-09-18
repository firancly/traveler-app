import { authClient } from "@/lib/auth-client";
import { isGuestMode } from "@/lib/guest";
import { Redirect } from "expo-router";
import {type ReactNode} from "react"
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export function AuthGate({children} : {children : ReactNode}) {
    const { data: session, isPending } = authClient.useSession();
    const [guest, setGuest] = useState<boolean | null>(null);

    useEffect(() => {
        if (isPending || session?.user) {
            return
        }
        isGuestMode().then(setGuest);
    }, [isPending, session?.user])
    if (isPending || (!session?.user && guest === null)) {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }} >
                <ActivityIndicator />
            </View>
        )
    }
    if (!session?.user && !guest) {
        return <Redirect href="/" />;
    }
    return <>{children}</>
}