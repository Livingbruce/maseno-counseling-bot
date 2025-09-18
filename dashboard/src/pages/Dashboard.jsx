import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { AuthContext } from "../AuthContext";
import { useSecurity } from "../SecurityContext";
import { fetchWithAuth } from "../utils/api";

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const { isWarning, timeLeft, formatTime } = useSecurity();
  const [stats, setStats] = useState({
    appointments: 0,
    announcements: 0,
    activities: 0,
    books: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentActivities();
  }, []);

  const loadStats = async () => {
    try {
      const [appointments, announcements, activities, books] = await Promise.all([
        fetchWithAuth("/dashboard/appointments").catch(() => []),
        fetchWithAuth("/dashboard/announcements").catch(() => []),
        fetchWithAuth("/activities").catch(() => []),
        fetchWithAuth("/dashboard/books").catch(() => [])
      ]);

      setStats({
        appointments: appointments.length || 0,
        announcements: announcements.length || 0,
        activities: activities.length || 0,
        books: books.length || 0
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await fetchWithAuth("/recent-activity");
      if (response.success) {
        setRecentActivities(response.activities || []);
      }
    } catch (error) {
      console.error("Error loading recent activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const clearRecentActivities = async () => {
    if (!window.confirm("Are you sure you want to clear old activities? This will delete activities older than 30 days.")) {
      return;
    }

    try {
      setActivitiesLoading(true);
      const response = await fetchWithAuth("/recent-activity/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ days: 30 })
      });

      if (response.success) {
        alert(`Successfully cleared ${response.details.activities + response.details.announcements + response.details.appointments} old activities!`);
        // Reload activities to show updated list
        await loadRecentActivities();
      } else {
        alert("Failed to clear activities. Please try again.");
      }
    } catch (error) {
      console.error("Error clearing recent activities:", error);
      alert("Error clearing activities. Please try again.");
    } finally {
      setActivitiesLoading(false);
    }
  };


  const quickActions = [
    {
      title: "Appointments",
      description: "Schedule and manage appointments",
      icon: "📅",
      path: "/appointments",
      colorClass: "counseling-secondary"
    },
    {
      title: "Books",
      description: "Manage book inventory",
      icon: "📚",
      path: "/books",
      colorClass: "counseling-warm"
    },
    {
      title: "Announcements",
      description: "Post student announcements",
      icon: "📢",
      path: "/announcements",
      colorClass: "counseling-accent"
    },
    {
      title: "Activities",
      description: "Plan counseling activities",
      icon: "🗓",
      path: "/activities",
      colorClass: "counseling-cool"
    },
    {
      title: "Absence",
      description: "Mark unavailable days",
      icon: "❌",
      path: "/absence",
      colorClass: "counseling-warm"
    },
    {
      title: "Profile",
      description: "Update your profile",
      icon: "⚙️",
      path: "/profile",
      colorClass: "counseling-secondary"
    },
    {
      title: "Contacts",
      description: "Manage contact details",
      icon: "📞",
      path: "/contacts",
      colorClass: "counseling-accent"
    },
    {
      title: "Support Tickets",
      description: "Handle support requests",
      icon: "🎫",
      path: "/support-tickets",
      colorClass: "counseling-warm"
    },
    {
      title: "Department",
      description: "Department information",
      icon: "🏢",
      path: "/department",
      colorClass: "counseling-cool"
    },
    {
      title: "Notifications",
      description: "Internal notifications",
      icon: "🔔",
      path: "/notifications",
      colorClass: "counseling-primary"
    }
  ];

  // Helper functions for activity display
  const getActivityIcon = (type) => {
    switch (type) {
      case 'activity':
        return '🗓';
      case 'appointment':
        return '📅';
      case 'announcement':
        return '📢';
      case 'support':
        return '🎫';
      default:
        return '📊';
    }
  };

  const getActivityIconColor = (type) => {
    switch (type) {
      case 'activity':
        return '#3B82F6'; // Blue
      case 'appointment':
        return '#10B981'; // Green
      case 'announcement':
        return '#F59E0B'; // Yellow
      case 'support':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const formatActivityTime = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const statCards = [
    {
      title: "Appointments",
      value: stats.appointments,
      icon: "📅",
      colorClass: "counseling-primary",
      description: "Total appointments"
    },
    {
      title: "Announcements",
      value: stats.announcements,
      icon: "📢",
      colorClass: "counseling-accent",
      description: "Active announcements"
    },
    {
      title: "Activities",
      value: stats.activities,
      icon: "🗓",
      colorClass: "counseling-cool",
      description: "Scheduled activities"
    },
    {
      title: "Books",
      value: stats.books,
      icon: "📚",
      colorClass: "counseling-warm",
      description: "Books for sale"
    }
  ];

  return (
    <div className="dashboard-container" style={{ padding: "0" }}>
      {/* Header with Theme Toggle and Logout */}
      <div style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--border-color)",
        boxShadow: "var(--shadow)",
        padding: "16px 24px",
        marginBottom: "24px"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Logo and Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="counseling-primary" style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}>
              🏥
            </div>
            <div>
              <h1 style={{
                color: "var(--text-primary)",
                margin: 0,
                fontSize: "20px",
                fontWeight: "700"
              }}>
                Counseling Dashboard
              </h1>
              <p style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "12px",
                fontWeight: "500"
              }}>
                Welcome, {user?.name || "Counselor"}
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Security Warning */}
            {isWarning && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                backgroundColor: "var(--btn-danger)",
                color: "white",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                <span>⏰</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "var(--btn-secondary)",
                color: "var(--text-primary)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--btn-secondary-hover)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--btn-secondary)";
              }}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "var(--btn-danger)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--btn-danger-hover)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--btn-danger)";
              }}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "0 24px" }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            color: "var(--text-primary)",
            fontSize: "32px",
            fontWeight: "700",
            margin: "0 0 8px 0",
            background: "linear-gradient(135deg, var(--accent-color), var(--btn-primary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Welcome to Your Dashboard
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "16px",
            margin: 0,
            fontWeight: "400"
          }}>
            Manage counseling services and student support efficiently
          </p>
        </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "32px"
      }}>
        {statCards.map((stat, index) => (
          <div key={index} className="stats-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "0 0 4px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {stat.title}
                </p>
                <p style={{
                  color: "var(--text-primary)",
                  fontSize: "32px",
                  fontWeight: "700",
                  margin: "0 0 4px 0"
                }}>
                  {loading ? "..." : stat.value}
                </p>
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  margin: 0
                }}>
                  {stat.description}
                </p>
              </div>
              <div className={`icon-container ${stat.colorClass}`} style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px"
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="modern-card" style={{ padding: "32px" }}>
        <h2 style={{
          color: "var(--text-primary)",
          fontSize: "24px",
          fontWeight: "600",
          margin: "0 0 24px 0"
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              style={{
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div className="quick-action-card" style={{
                padding: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div className={`icon-container ${action.colorClass}`} style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 style={{
                      color: "var(--text-primary)",
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: "0 0 4px 0"
                    }}>
                      {action.title}
                    </h3>
                    <p style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      margin: 0,
                      lineHeight: "1.4"
                    }}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="modern-card" style={{ padding: "32px", marginTop: "24px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{
            color: "var(--text-primary)",
            fontSize: "24px",
            fontWeight: "600",
            margin: 0
          }}>
            Recent Activity
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={loadRecentActivities}
              style={{
                background: "var(--accent-color)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              {activitiesLoading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={clearRecentActivities}
              style={{
                background: "#EF4444",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              Clear Old
            </button>
          </div>
        </div>
        
        {activitiesLoading ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            color: "var(--text-muted)"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "16px" }}>⏳</div>
              <p style={{ margin: 0 }}>Loading recent activity...</p>
            </div>
          </div>
        ) : recentActivities.length > 0 ? (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {recentActivities.map((activity, index) => (
              <div
                key={`${activity.type}-${activity.id}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "16px",
                  borderBottom: index < recentActivities.length - 1 ? "1px solid var(--border-color)" : "none",
                  transition: "background-color 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "var(--hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                  fontSize: "18px",
                  background: getActivityIconColor(activity.type),
                  color: "white",
                  flexShrink: 0
                }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "4px"
                  }}>
                    <h4 style={{
                      color: "var(--text-primary)",
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                      marginBottom: "4px"
                    }}>
                      {activity.category}
                    </h4>
                    <span style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      marginLeft: "16px"
                    }}>
                      {formatActivityTime(activity.date || activity.created_at)}
                    </span>
                  </div>
                  <p style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    margin: 0,
                    lineHeight: "1.4"
                  }}>
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            color: "var(--text-muted)",
            fontSize: "16px"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
              <p style={{ margin: 0 }}>No recent activity found</p>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                Your recent activities will appear here
              </p>
            </div>
          </div>
        )}
      </div>

      </div>
    </div>
  );
};

export default Dashboard;