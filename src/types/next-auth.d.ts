import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"

interface IUser {
    id: string;
    username: string;
    email: string;
    isVerify: boolean,
    type: string;
    role: string;
    id_token: string;
}

// interface IAccount {
//     provider: string;
//     type: string;
//     providerAccountId: string;
//     refresh_token?: string;
//     access_token?: string;
//     expires_at?: number;
//     token_type?: string;
//     scope?: string;
//     id_token?: string;
//     session_state?: string;
// }

// interface IProfile {
//     email: string;
//     email_verified: boolean;
//     name: string;
//     picture: string;
// }

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        access_token: string;
        refresh_token: string;
        user: IUser;
        access_expire: number;
        error: string;
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: IUser,
        access_token: string;
        refresh_token: string;
        access_expire: number;
        error: string;
    }

    // interface Account extends IAccount { }
    // interface Profile extends IProfile { }
}