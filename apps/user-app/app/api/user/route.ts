import { NextResponse } from "next/server"
import { PrismaClient } from "@repo/db/client";

const client = new PrismaClient();

export const GET = async () => {
    await client.user.create({
        data: {
            email: "hiifwdf@gmail.com",
            name: "chuimiu"
        }
    })
    return NextResponse.json({
        message: "all done"
    })
}