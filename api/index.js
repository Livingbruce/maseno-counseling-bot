export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Get the pathname from the URL
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    // Route handling
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
          // Handle login request
          const { email, password } = req.body;
          
          // Check if credentials are provided
          if (!email || !password) {
            return res.status(400).json({
              error: "Email and password are required"
            });
          }

          // For now, return a simple success response
          // In a real implementation, you would validate against the database
          if (email === "admin@maseno.ac.ke" && password === "123456") {
            res.status(200).json({
              message: "Login successful",
              token: "mock-jwt-token-" + Date.now(),
              user: {
                id: 1,
                name: "Admin User",
                email: "admin@maseno.ac.ke",
                is_admin: true
              }
            });
          } else {
            res.status(401).json({
              error: "Invalid credentials"
            });
          }
        } else {
          res.status(405).json({
            error: "Method not allowed. Use POST for login."
          });
        }
        break;

      case "/api/me":
        if (req.method === "GET") {
          // Handle get current user request
          res.status(200).json({
            message: "User profile retrieved",
            user: {
              id: 1,
              name: "Admin User",
              email: "admin@maseno.ac.ke",
              is_admin: true
            }
          });
        } else {
          res.status(405).json({
            error: "Method not allowed. Use GET for profile."
          });
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
}
