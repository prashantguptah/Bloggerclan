import { deleteCookie } from "h3";

export default defineEventHandler(async (event) => {
  deleteCookie(event, "refreshToken"); // Remove refresh token cookie

  return { message: "Logged out successfully" };
});
