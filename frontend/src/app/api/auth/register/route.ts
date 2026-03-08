import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { User } from "@gap/db";

export async function POST(req: NextRequest) {
    try {
        const { name, userId, password, role } = await req.json();

        if (!name || !userId || !password) {
            return NextResponse.json(
                { error: "Name, User ID and password are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return NextResponse.json(
                { error: "User ID already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            userId,
            password: hashedPassword,
            role: role || "operator",
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    userId: user.userId,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
