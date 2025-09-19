import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// Simple Login Component
function Login() {
  const [email, setEmail] = React.useState("admin@maseno.ac.ke")
  const [password, setPassword] = React.useState("123456")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()

      if (response.ok && data.message === "Login successful") {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        window.location.href = "/dashboard"
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
          🎓 Maseno Counseling
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>
          
          {error && (
            <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@maseno.ac.ke</p>
          <p>Password: 123456</p>
        </div>
      </div>
    </div>
  )
}

// Simple Dashboard Component
function Dashboard() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: "Arial, sans-serif"
    }}>
      <header style={{
        background: "white",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ margin: 0, color: "#333" }}>🎓 Maseno Counseling Dashboard</h1>
        <div>
          <span style={{ marginRight: "20px" }}>Welcome, {user?.name || "User"}</span>
          <button
            onClick={logout}
            style={{
              background: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </header>
      
      <main style={{ padding: "40px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>��</h2>
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>25</h3>
            <p style={{ margin: 0, color: "#666" }}>Appointments</p>
          </div>
          
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>👥</h2>
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>150</h3>
            <p style={{ margin: 0, color: "#666" }}>Students</p>
          </div>
          
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>👨‍🏫</h2>
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>8</h3>
            <p style={{ margin: 0, color: "#666" }}>Counselors</p>
          </div>
          
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>📢</h2>
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>12</h3>
            <p style={{ margin: 0, color: "#666" }}>Announcements</p>
          </div>
        </div>
        
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "4px" }}>
              <span style={{ color: "#666", fontSize: "14px" }}>2 hours ago</span>
              <span style={{ marginLeft: "10px" }}>New appointment scheduled</span>
            </div>
            <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "4px" }}>
              <span style={{ color: "#666", fontSize: "14px" }}>4 hours ago</span>
              <span style={{ marginLeft: "10px" }}>Student registration completed</span>
            </div>
            <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "4px" }}>
              <span style={{ color: "#666", fontSize: "14px" }}>1 day ago</span>
              <span style={{ marginLeft: "10px" }}>New announcement published</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px"
      }}>
        Loading...
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/" replace />
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
