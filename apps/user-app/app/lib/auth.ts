import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { z } from "zod";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1234567890", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          async authorize(credentials: {phone: string, password: string} | undefined) {
            if(!credentials) {
                return null;
            }
            const schema = z.object({
                phone: z.string().length(10, { message: "Phone number must be exactly 10 digits" }),
                password: z.string().min(6, { message: "Password must be at least 6 characters" })
            });

            const parsedCredentials = schema.safeParse(credentials);

            if (!parsedCredentials.success) {
                throw new Error(parsedCredentials.error.errors.map(err => err.message).join(", "));
            }      

            const { phone, password } = parsedCredentials.data;

            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    const userData = {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        number: existingUser.number 
                    };
                    console.log("User data returned:", userData);
                    return userData;
                }
                return null;
            }

            try {
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    number: user.number
                }
            } catch(e) {
                console.error("Error creating user:", e);
                throw new Error("User creation failed");
            }
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    }
  }