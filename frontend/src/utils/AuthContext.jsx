import React, { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        console.log("Token found, user should be authenticated")
        // For now, just set loading to false
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
      setLoading(false)
    }
  }

  const loginUser = async (email, password) => {
    try {
      console.log("Attempting login for:", email)
      
      const API_URL = import.meta.env.VITE_API_URL || "https://maseno-counseling-fresh-euoyl4g4r-victor-mburugu-s-projects.vercel.app"
      
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      console.log("Login response:", data)
      
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        setIsAuthenticated(true)
        console.log("Login successful, user set:", data.user.name)
        return { success: true }
      } else {
        console.log("Login failed:", data.error)
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login failed:", error)
      return { 
        success: false, 
        error: "Login failed" 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    loginUser,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
