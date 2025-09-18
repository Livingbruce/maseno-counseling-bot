import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useTheme } from "../ThemeContext";

const Login = () => {
  const { login, user, loading: authLoading } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Navigation will be handled by the useEffect above
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Invalid credentials. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="dashboard-container" style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div className="loading-spinner" style={{ width: "40px", height: "40px" }}></div>
        <div style={{ 
          color: "var(--text-primary)", 
          fontSize: "18px",
          fontWeight: "500"
        }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  // Don't render login form if user is already logged in
  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="dashboard-container" style={{ 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="modern-card" style={{
        width: "100%",
        maxWidth: "420px",
        padding: "48px 40px",
        textAlign: "center"
      }}>
        {/* Logo and Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            background: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 24px auto"
          }}>
            🏥
          </div>
          <h1 style={{
            color: "var(--text-primary)",
            fontSize: "28px",
            fontWeight: "700",
            margin: "0 0 8px 0"
          }}>
            Counselor Login
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "16px",
            margin: 0
          }}>
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: "var(--alert-danger)",
            color: "var(--alert-danger-text)",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px"
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="input-modern"
              placeholder="Enter your email address"
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{
              display: "block",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="input-modern"
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-modern btn-primary-modern"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "600",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{ width: "16px", height: "16px" }}></div>
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border-color)"
        }}>
          <p style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            margin: 0
          }}>
            Maseno University Counseling Services
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
