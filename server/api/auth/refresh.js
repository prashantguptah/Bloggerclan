import jwt from "jsonwebtoken";
import { getCookie, setCookie } from "h3";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");

  if (!refreshToken) {
    return { error: "Refresh token missing", statusCode: 401 };
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || "refreshKey");
    const user = await User.findById(decoded.id).select("_id email");

    if (!user) {
      return { error: "User not found", statusCode: 404 };
    }

    // Generate new Access Token
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretKey", {
      expiresIn: "15m",
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    return { error: "Invalid refresh token", statusCode: 403 };
  }
});
