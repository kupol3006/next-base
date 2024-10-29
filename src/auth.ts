import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    const res = await sendRequest<IBackendRes<Ilogin>>({
                        method: "POST",
                        url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                        body: {
                            ...credentials
                        }
                    });

                    if (+res.statusCode === 201) {
                        return {
                            id: res.data?.user?.id,
                            username: res.data?.user?.name,
                            email: res.data?.user?.email,
                            access_token: res.data?.access_token,
                        }
                    } else if (+res.statusCode === 401) {
                        throw new AuthError("Sai mật khẩu hoặc tài khoản không tồn tại");
                    } else if (+res.statusCode === 400) {
                        throw new AuthError("Tài khoản chưa được kích hoạt");
                    } else {
                        throw new AuthError("Internal server error");
                    }
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw error;
                }
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // authorization: {
            //     params: {
            //         prompt: "consent",
            //         access_type: "offline",
            //         response_type: "code"
            //     }
            // },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (user) { // User is available during sign-in
                token.user = (user as IUser)
            }
            if (trigger === "signIn" && account?.provider === "google") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    method: 'POST',
                    url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login-by-google`,
                    body: {
                        id_token: account.id_token,
                        accountType: "GOOGLE"
                    }
                })
                if (res?.data) {
                    token.access_token = res.data.access_token
                    token.user = res.data.user
                }

            }
            return token
        },
        session({ session, token }) {
            (session.user as IUser) = token.user;
            if (token) {
                (session as any).access_token = token.access_token;
                (session.user as IUser) = token.user;
            }
            return session
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
});