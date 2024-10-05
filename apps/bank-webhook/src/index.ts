import express from "express";
import db from "@repo/db/client"
const app = express();

app.use(express.json());

app.post("/hdfcWebhook",async (req,res) => {
    const paymentInfo : {token: string,userId:string,amount: string} = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.userId
    }
    try{
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInfo.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInfo.amount)
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInfo.token
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
