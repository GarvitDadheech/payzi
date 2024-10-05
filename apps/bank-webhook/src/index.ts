import express from "express";
import db from "@repo/db/client";
import {z} from "zod";
const app = express();

app.use(express.json());

const paymentInfoSchema = z.object({
    token: z.string(),
    userId: z.string(),
    amount: z.string()
})

app.post("/hdfcWebhook",async (req,res) => {
    const paymentInfoResult = await paymentInfoSchema.safeParse(req.body);
    if (!paymentInfoResult.success) {
        return res.status(400).json({
            message: "Invalid payment info",
            errors: paymentInfoResult.error.errors
        });
    }

    const { token, userId, amount } = paymentInfoResult.data;
    try{
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(userId)
                },
                data: {
                    amount: {
                        increment: Number(amount)
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: token
                },
                data: {
                    status: "Success"
                }
            })
        ])
        res.json({
            message: "Payment Captured"
        })
    }
    catch(e) {        
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
});

app.listen(3003,() => {
    console.log("Server is running on port 3003");
    
})
