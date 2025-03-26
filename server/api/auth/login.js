import User from "~/server/models/User";
import connectDB from "~/server/utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setCookie } from "h3"; 

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { error: "Invalid credentials" };
    }
     
     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretKey", {
      expiresIn: "15m",  // Access token expires in 15 minutes
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET || "refreshKey", {
      expiresIn: "7d",  // Refresh token expires in 7 days
    });
    
    
    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      message: "Login successful",
      user: { id: user._id, email: user.email, profileImage: user.profileImage },
      token,
    };
  } catch (error) {
    return { error: error.message };
  }
});
