// Maseno Counseling Bot API - Complete Authentication Solution
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    switch (pathname) {
      case "/api/":
      case "/api":
        res.status(200).json({
          message: "Maseno Counseling Bot API",
          status: "ONLINE",
          version: "1.0.0",
          timestamp: new Date().toISOString(),
          authentication: "READY",
          database: process.env.DATABASE_URL ? "CONNECTED" : "NOT_CONFIGURED",
          jwt: process.env.JWT_SECRET ? "CONFIGURED" : "NOT_CONFIGURED",
          availableEndpoints: [
            "/api/",
            "/api/health",
            "/api/login",
            "/api/me",
            "/api/test"
          ]
        });
        break;

      case "/api/health":
        res.status(200).json({
          message: "Health check successful",
          status: "OK",
          timestamp: new Date().toISOString(),
          version: "1.0.0"
        });
        break;

      case "/api/test":
        res.status(200).json({
          message: "Test endpoint working!",
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.url,
          version: "1.0.0"
        });
        break;

      case "/api/login":
        if (req.method === "POST") {
          // Parse request body
          let body = "";
          req.on("data", chunk => {
            body += chunk.toString();
          });
          
          req.on("end", async () => {
            try {
              const { email, password } = JSON.parse(body);

              // Check environment variables
              if (!process.env.DATABASE_URL) {
                res.status(500).json({
                  error: "Database configuration missing",
                  details: "DATABASE_URL not set"
                });
                return;
              }

              if (!process.env.JWT_SECRET) {
                res.status(500).json({
                  error: "JWT configuration missing",
                  details: "JWT_SECRET not set"
                });
                return;
              }

              // Get user from database
              const userResult = await pool.query(
                "SELECT id, name, email, password_hash, is_admin FROM counselors WHERE email = $1",
                [email]
              );

              if (userResult.rows.length === 0) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
              }

              const user = userResult.rows[0];

              // Check password
              const passwordMatch = await bcrypt.compare(password, user.password_hash);

              if (!passwordMatch) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
              }

              // Generate JWT token
              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  is_admin: user.is_admin
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
              );

              res.status(200).json({
                message: "Login successful",
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  is_admin: user.is_admin
                }
              });

            } catch (error) {
              console.error("Login error:", error);
              res.status(500).json({
                error: "Internal server error",
                details: error.message
              });
            }
          });
        } else {
          res.status(405).json({ error: "Method not allowed" });
        }
        break;

      case "/api/me":
        if (req.method === "GET") {
          // Get token from Authorization header
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "No token provided" });
            return;
          }

          const token = authHeader.substring(7);

          try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from database
            const userResult = await pool.query(
              "SELECT id, name, email, is_admin FROM counselors WHERE id = $1",
              [decoded.id]
            );

            if (userResult.rows.length === 0) {
              res.status(401).json({ error: "User not found" });
              return;
            }

            const user = userResult.rows[0];

            res.status(200).json({
              message: "User data retrieved",
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
              }
            });

          } catch (error) {
            console.error("Token verification error:", error);
            res.status(401).json({ error: "Invalid token" });
          }
        } else {
          res.status(405).json({ error: "Method not allowed" });
        }
        break;

      default:
        res.status(404).json({
          error: "Route not found",
          path: pathname,
          method: req.method,
          availableRoutes: ["/api/", "/api/health", "/api/login", "/api/me", "/api/test"]
        });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
};
