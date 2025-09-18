import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#0077cc", color: "white" }}>
      <Link to="/" style={{ margin: "0 10px", color: "white" }}>Dashboard</Link>
      <Link to="/appointments" style={{ margin: "0 10px", color: "white" }}>Appointments</Link>
      <Link to="/announcements" style={{ margin: "0 10px", color: "white" }}>Announcements</Link>
      <Link to="/activities" style={{ margin: "0 10px", color: "white" }}>Activities</Link>
      <Link to="/books" style={{ margin: "0 10px", color: "white" }}>Books</Link>
    </nav>
  );
}