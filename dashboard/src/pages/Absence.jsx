import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Absence = () => {
  const [days, setDays] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadDays() {
    try {
      setLoading(true);
      const data = await api.get("/dashboard/absence");
      setDays(data);
      setError(null);
    } catch (err) {
      console.error("Error loading absence days:", err);
      setError("Failed to load absence days");
    } finally {
      setLoading(false);
    }
  }

  async function markAbsent(e) {
    e.preventDefault();
    if (!date) return;

    try {
      setLoading(true);
      await api.post("/dashboard/absence", { date });
      setDate("");
      loadDays();
      setError(null);
    } catch (err) {
      console.error("Error marking absence:", err);
      setError("Failed to mark absence");
    } finally {
      setLoading(false);
    }
  }

  async function removeAbsence(id) {
    if (!window.confirm("Remove this absence day?")) return;

    try {
      await api.delete(`/dashboard/absence/${id}`);
      loadDays();
      setError(null);
    } catch (err) {
      console.error("Error removing absence:", err);
      setError("Failed to remove absence");
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    loadDays();
  }, []);

  // Define styling objects using theme variables
  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow)",
    marginBottom: "20px"
  };

  const formStyle = {
    backgroundColor: "var(--card-bg)",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow)",
    marginBottom: "20px"
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid var(--input-border)",
    borderRadius: "4px",
    backgroundColor: "var(--input-bg)",
    color: "var(--text-primary)",
    fontSize: "14px",
    flex: 1
  };

  const buttonStyle = {
    backgroundColor: "var(--btn-primary)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px"
  };

  const removeButtonStyle = {
    backgroundColor: "var(--btn-secondary)",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px"
  };

  const messageStyle = {
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid"
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <button style={{
            ...buttonStyle,
            backgroundColor: "var(--btn-secondary)",
            marginBottom: "20px"
          }}>
            ← Back to Dashboard
          </button>
        </Link>
        <h2 style={{ color: "var(--text-primary)", margin: "0" }}>❌ Absence</h2>
      </div>
      
      {error && (
        <div style={{
          ...messageStyle,
          backgroundColor: "var(--alert-danger-bg)",
          color: "var(--alert-danger-text)",
          borderColor: "var(--alert-danger-border)"
        }}>
          {error}
        </div>
      )}

      <div style={formStyle}>
        <h3 style={{ color: "var(--text-primary)", marginBottom: "15px" }}>Mark Absence</h3>
        <form onSubmit={markAbsent}>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
              style={inputStyle}
            />
            <button 
              type="submit" 
              disabled={loading || !date}
              style={{
                ...buttonStyle,
                backgroundColor: loading ? "var(--btn-secondary)" : "var(--alert-danger)",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Saving..." : "Mark Absent"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 style={{ color: "var(--text-primary)", marginBottom: "15px" }}>Absence Days</h3>
        {days.length === 0 ? (
          <div style={{
            ...cardStyle,
            textAlign: "center"
          }}>
            <p style={{ color: "var(--text-secondary)", fontStyle: "italic", margin: 0 }}>
              No absence days marked.
            </p>
          </div>
        ) : (
          <div style={cardStyle}>
            {days.map((day, index) => (
              <div key={day.id} style={{ 
                padding: "15px 0", 
                borderBottom: index < days.length - 1 ? "1px solid var(--border-color)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <p style={{ margin: "0", fontSize: "16px", fontWeight: "500", color: "var(--text-primary)" }}>
                    {formatDate(day.date)}
                  </p>
                </div>
                <button
                  onClick={() => removeAbsence(day.id)}
                  style={removeButtonStyle}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Absence;
