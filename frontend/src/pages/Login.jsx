import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../utils/AuthContext"
import "../styles/theme.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Starting login process...")
      const result = await loginUser(email, password)
      console.log("Login result:", result)
      
      if (result.success) {
        console.log("Login successful, navigating to dashboard...")
        navigate("/dashboard")
      } else {
        console.log("Login failed:", result.error)
        setError(result.error)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#333", margin: "0 0 10px 0", fontSize: "24px" }}>🎓 Maseno Counseling</h1>
          <p style={{ color: "#666", margin: "0" }}>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#333", fontWeight: "500" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#333", fontWeight: "500" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>
          
          {error && <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: "6px", marginBottom: "20px", textAlign: "center" }}>{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#ccc" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div style={{ background: "#f0f8ff", padding: "15px", borderRadius: "6px", marginTop: "20px", textAlign: "center" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Demo Credentials:</h4>
          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}><strong>Email:</strong> admin@maseno.ac.ke</p>
          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}><strong>Password:</strong> 123456</p>
        </div>
      </div>
    </div>
  )
}

export default Login
