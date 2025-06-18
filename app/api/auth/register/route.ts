import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/config/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    // await because data can take time when coming from frontend due to edge functions
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required." },
        { status: 400 }
      );
    }

    //checking db connection because of different edge functions
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered!" },
        { status: 400 }
      );
    }

    await User.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Registration failed.", err);
    return NextResponse.json(
      { error: "Failed to register user." },
      { status: 400 }
    );
  }
}
