import { auth } from "@traveler-app/auth";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export async function createContext({ req }: CreateExpressContextOptions) {
    const session = await auth.api.getSession({
        headers: req.headers,
    });
    return {
        session,
    }

}

export type Context = Awaited<ReturnType<typeof createContext>>;