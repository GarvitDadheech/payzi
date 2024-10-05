"use client"
import { Appbar } from "@repo/ui/AppBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AppBarClient() {
    const session = useSession();
    const router = useRouter();
    return (
        <div className="border-b-2 border-gray-300">
            <Appbar onSignin={signIn} onSignout={async () => {
            await signOut()
            router.push("/api/auth/signin")
            }} user={session.data?.user} />
        </div>
    )
}