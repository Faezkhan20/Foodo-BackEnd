// middleware.js
// import UserModels from "../Models/UserModels.js"
import jwt from "jsonwebtoken"



export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
