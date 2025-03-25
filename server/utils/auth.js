import jwt from "jsonwebtoken";
import { getCookie } from "h3"; 

export const getUserSession = (event) => {
  try {
    const token = getCookie(event, "authToken"); 
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    return { _id: decoded.id }; 
  } catch (error) {
    return null;
  }
};
