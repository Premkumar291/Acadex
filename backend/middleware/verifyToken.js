import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Ensure req.user is properly set with all necessary information
    req.userId = decoded.userId;
    req.user = {
      _id: decoded.userId,
      userId: decoded.userId,
      id: decoded.userId,
      role: decoded.role // Include role from token
    };
    
    next(); // Call the next middleware

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

// Middleware to verify admin role
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Admin privileges required." 
    });
  }
};

// Middleware to verify faculty role
export const verifyFaculty = (req, res, next) => {
  if (req.user && req.user.role === 'faculty') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Faculty privileges required." 
    });
  }
};
