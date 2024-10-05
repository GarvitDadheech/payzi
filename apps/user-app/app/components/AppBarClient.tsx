import { Appbar } from "@repo/ui/AppBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AppBarClient() {
    const session = useSession();
    const router = useRouter();
    return (
        <div>
            <Appbar onSignin={signIn} onSignout={async () => {
            await signOut()
            router.push("/api/auth/signin")
            }} user={session.data?.user} />
        </div>
    )
}