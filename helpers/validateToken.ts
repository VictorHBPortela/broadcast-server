import jwt from "jsonwebtoken";
import type { ExtendedError, Socket } from "socket.io";
const JWT_SECRET = process.env.JWT_SECRET || "TH3SN3AKYKEY";

export const validateToken = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const token = socket.handshake?.auth?.token;
  if (!token) {
    console.log("No token provided");
    return next(new Error("No token provided"));
  }
  jwt.verify(token, JWT_SECRET, (err: Error | null) => {
    if (err) {
      console.log("Authentication failed");
      return next(new Error("Authentication failed"));
    }
    console.log("User authenticated.", socket.id);
    next();
  });
};
