"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export async function createOnRampTxns(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = (Math.random() * 1000).toString();
    await db.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount
        }
    })
    return {
        message: "OnRamp Transaction Added!"
    }

}