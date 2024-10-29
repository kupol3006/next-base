'use server'
import { signIn } from "@/auth";
import { AuthError } from "./errors"; // Import custom error class

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: email,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        });
        return r;
    } catch (error) {
        // console.error("Authentication error:", error);
        let errorMessage = "An unknown error occurred";
        if (error instanceof AuthError || error instanceof Error) {
            errorMessage = error.message.replace(/Read more at https:\/\/errors\.authjs\.dev#\w+/, "").trim();
        }
        return { error: errorMessage };
    }
}
export async function authenticateGoogle() {
    try {
        const r = await signIn("google", {
            // callbackUrl: "/",
            redirect: false,
        });
        return r;
    } catch (error) {
        // console.error("Authentication error:", error);
        let errorMessage = "An unknown error occurred";
        return { error: errorMessage };
    }
}