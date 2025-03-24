import jwt from "jsonwebtoken";
import { getCookie } from "h3"; // Nuxt 3 function for getting cookies

export const getUserSession = (event) => {
  try {
    const token = getCookie(event, "authToken"); // Extract token from cookies
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    return { _id: decoded.id }; // Return user ID from token
  } catch (error) {
    return null;
  }
};
