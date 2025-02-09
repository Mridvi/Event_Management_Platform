import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access Denied. No token provided." });
    }

    
    token = token.split(" ")[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id || !decoded.email) {
      return res.status(400).json({ error: "Invalid token: Missing user details" });
    }

    
    req.user = {
      id: decoded.id,
      email: decoded.email,  
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); 
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default protect;
