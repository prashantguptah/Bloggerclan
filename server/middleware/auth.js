import jwt from "jsonwebtoken";
import { getCookie } from "h3";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "authToken");

  if (!token) {
    event.context.auth = null;
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    const user = await User.findById(decoded.id).select("_id email name");

    if (user) {
      event.context.auth = { user };
    } else {
      event.context.auth = null;
    }
  } catch (error) {
    // If token expired, set auth to null
    console.error("Token expired or invalid:", error);
    event.context.auth = null;
  }
});
