import jwt from "jsonwebtoken";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const token =
    getCookie(event, "authToken") || // If stored in cookies
    event.req.headers.authorization?.split(" ")[1]; // If sent in headers

  if (!token) {
    console.warn("No token found in request.");
    event.context.auth = null;
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    const user = await User.findById(decoded.id).select("_id email name");

    if (user) {
      event.context.auth = { user };
    } else {
      console.warn("User not found.");
      event.context.auth = null;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    event.context.auth = null;
  }
});
