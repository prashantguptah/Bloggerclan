import User from "~/server/models/User";
import connectDB from "~/server/utils/db";
import { faker } from "@faker-js/faker";

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event); // Get request body
  const { email, password } = body;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const newUser = new User({
      email,
      password,
      profileImage: faker.image.avatar(), // Generate a random profile image
    });

    await newUser.save();
    return { message: "User registered successfully" };
  } catch (error) {
    return { error: error.message };
  }
});
