import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await api.get("/dashboard/appointments");
      console.log("Loaded appointments:", data);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id) {
    try {
      await api.post(`/dashboard/appointments/${id}/cancel`);
      setSuccessMessage("✅ Appointment cancelled!");
      setError(null);
      loadAppointments();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setError("Failed to cancel appointment");
    }
  }

  async function postponeAppointment(id) {
    const newDate = prompt("Enter new date in Nairobi time (YYYY-MM-DD HH:mm):\nExample: 2025-09-20 15:30");
    if (!newDate) return;
    
    // Validate the date format before sending
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(newDate.trim())) {
      setError("Invalid date format. Please use YYYY-MM-DD HH:mm");
      return;
    }
    
    try {
      // Create date in Nairobi time (database stores Nairobi time)
      const [datePart, timePart] = newDate.trim().split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      
      // Create date in Nairobi time directly
      const nairobiDate = new Date(
        parseInt(year), 
        parseInt(month) - 1, 
        parseInt(day), 
        parseInt(hour), 
        parseInt(minute)
      );
      
      // Format as Nairobi time string (same format as backend expects)
      const yearStr = nairobiDate.getFullYear();
      const monthStr = (nairobiDate.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = nairobiDate.getDate().toString().padStart(2, '0');
      const hourStr = nairobiDate.getHours().toString().padStart(2, '0');
      const minuteStr = nairobiDate.getMinutes().toString().padStart(2, '0');
      const nairobiDateString = `${yearStr}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}`;
      
      await api.post(`/dashboard/appointments/${id}/postpone`, { newDate: nairobiDateString });
      
      setSuccessMessage("✅ Appointment postponed!");
      setError(null);
      
      // Force reload appointments immediately
      await loadAppointments();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error postponing appointment:", err);
      setError("Failed to postpone appointment");
    }
  }

  async function deleteAppointment(id) {
    if (!window.confirm("Permanently delete this canceled appointment?")) {
      return;
    }
    
    try {
      await api.delete(`/dashboard/appointments/${id}/delete`);
      setSuccessMessage("✅ Appointment deleted!");
      setError(null);
      loadAppointments();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment");
    }
  }

  const formatDate = (dateString) => {
    // Parse the date - it's already in Nairobi time from the database
    const date = new Date(dateString);
    
    // Use local time methods since the database stores Nairobi time
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formattedMinute = minute.toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${monthNames[month]} ${day}, ${year}, ${displayHour}:${formattedMinute} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading appointments...</p>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow)',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    backgroundColor: 'var(--btn-primary)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const deleteButtonStyle = {
    backgroundColor: 'var(--btn-danger)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    backgroundColor: status === 'cancelled' ? 'var(--btn-danger)' : 
                    status === 'confirmed' ? 'var(--btn-success)' : 'var(--btn-warning)',
    color: 'white'
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link 
          to="/" 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "var(--btn-secondary)",
            color: "var(--text-primary)",
            textDecoration: "none",
            borderRadius: "6px",
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
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{
          color: "var(--text-primary)",
          fontSize: "28px",
          fontWeight: "700",
          margin: 0
        }}>📅 Appointments Management</h1>
        <button
          onClick={loadAppointments}
          style={buttonStyle}
        >
          🔄 Refresh
        </button>
      </div>
      
      {error && (
        <div style={{
          backgroundColor: "var(--alert-danger)",
          color: "var(--alert-danger-text)",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "1.5rem",
          border: "1px solid var(--border-color)"
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: "var(--alert-success)",
          color: "var(--alert-success-text)",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "1.5rem",
          border: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--alert-success-text)",
              fontSize: "18px",
              cursor: "pointer",
              padding: "0",
              marginLeft: "10px"
            }}
          >
            ×
          </button>
        </div>
      )}

      {appointments.length === 0 ? (
        <div style={{
          backgroundColor: "var(--card-bg)",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          textAlign: "center",
          boxShadow: "var(--shadow)"
        }}>
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
            No appointments found.
          </p>
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          {appointments.map((appointment) => (
            <div key={appointment.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "500", fontSize: "16px", color: "var(--text-primary)" }}>
                    Student: {appointment.student_name || `Student #${appointment.student_id}`}
                  </p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--text-secondary)" }}>
                    {formatDate(appointment.start_ts)} → {formatDate(appointment.end_ts)}
                  </p>
                  <div style={statusBadgeStyle(appointment.status || 'pending')}>
                    {appointment.status || 'pending'}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {appointment.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        style={deleteButtonStyle}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => postponeAppointment(appointment.id)}
                        style={{
                          backgroundColor: "var(--btn-warning)",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}
                      >
                        Postpone
                      </button>
                    </>
                  )}
                  {appointment.status === 'cancelled' && (
                    <button
                      onClick={() => deleteAppointment(appointment.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
