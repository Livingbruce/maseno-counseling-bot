export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
