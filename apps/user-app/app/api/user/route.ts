import { NextResponse } from "next/server"
import db from "@repo/db/client";


export const GET = async () => {
    await db.user.create({
        data: {
            number: "8924032430",
            email: "hiifwdf@gmail.com",
            name: "chuimiu",
            password: "4u8324u"
        }
    })
    return NextResponse.json({
        message: "all done"
    })
}