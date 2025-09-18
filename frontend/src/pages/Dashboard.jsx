import React, { useState, useEffect } from "react"
import { useAuth } from "../utils/AuthContext"
import "../styles/theme.css"

function Dashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    appointments: 0,
    students: 0,
    counselors: 0,
    announcements: 0
  })

  useEffect(() => {
    // Simulate loading stats
    setStats({
      appointments: 25,
      students: 150,
      counselors: 8,
      announcements: 12
    })
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{
        background: "white",
        padding: "15px 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ margin: 0, color: "#333", fontSize: "20px" }}>🎓 Maseno Counseling Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ color: "#666" }}>Welcome, {user?.name}</span>
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

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "20px"
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea", marginBottom: "10px" }}>📅</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "24px" }}>{stats.appointments}</h3>
            <p style={{ margin: 0, color: "#666" }}>Appointments</p>
          </div>
          
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea", marginBottom: "10px" }}>👥</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "24px" }}>{stats.students}</h3>
            <p style={{ margin: 0, color: "#666" }}>Students</p>
          </div>
          
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea", marginBottom: "10px" }}>👨‍🏫</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "24px" }}>{stats.counselors}</h3>
            <p style={{ margin: 0, color: "#666" }}>Counselors</p>
          </div>
          
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea", marginBottom: "10px" }}>📢</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "24px" }}>{stats.announcements}</h3>
            <p style={{ margin: 0, color: "#666" }}>Announcements</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 15px 0", color: "#333" }}>Recent Activity</h2>
            <div>
              <div style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span style={{ color: "#666", fontSize: "12px" }}>2 hours ago</span>
                <span style={{ marginLeft: "10px" }}>New appointment scheduled</span>
              </div>
              <div style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span style={{ color: "#666", fontSize: "12px" }}>4 hours ago</span>
                <span style={{ marginLeft: "10px" }}>Student registration completed</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                <span style={{ color: "#666", fontSize: "12px" }}>1 day ago</span>
                <span style={{ marginLeft: "10px" }}>New announcement published</span>
              </div>
            </div>
          </div>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 15px 0", color: "#333" }}>Quick Actions</h2>
            <div style={{ display: "grid", gap: "10px" }}>
              <button style={{
                padding: "10px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                📅 Schedule Appointment
              </button>
              <button style={{
                padding: "10px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                📢 Create Announcement
              </button>
              <button style={{
                padding: "10px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                👥 Manage Students
              </button>
              <button style={{
                padding: "10px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                📊 View Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
