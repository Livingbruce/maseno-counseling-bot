import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";
import { SecurityProvider } from "./SecurityContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./styles/theme.css";

// Page imports
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Announcements from "./pages/Announcements.jsx";
import Activities from "./pages/Activities.jsx";
import Books from "./pages/Books.jsx";
import Absence from "./pages/Absence.jsx";
import Profile from "./pages/Profile.jsx";
import Contacts from "./pages/Contacts.jsx";
import Support from "./pages/Support.jsx";
import SupportTickets from "./pages/SupportTickets.jsx";
import Department from "./pages/Department.jsx";
import Notifications from "./pages/Notifications.jsx";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SecurityProvider>
          <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes without NavBar */}
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/appointments" element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          } />
          <Route path="/announcements" element={
            <PrivateRoute>
              <Announcements />
            </PrivateRoute>
          } />
          <Route path="/activities" element={
            <PrivateRoute>
              <Activities />
            </PrivateRoute>
          } />
          <Route path="/books" element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          } />
          <Route path="/absence" element={
            <PrivateRoute>
              <Absence />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/contacts" element={
            <PrivateRoute>
              <Contacts />
            </PrivateRoute>
          } />
          <Route path="/support" element={
            <PrivateRoute>
              <Support />
            </PrivateRoute>
          } />
          <Route path="/support-tickets" element={
            <PrivateRoute>
              <SupportTickets />
            </PrivateRoute>
          } />
          <Route path="/department" element={
            <PrivateRoute>
              <Department />
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          } />
        </Routes>
          </Router>
        </SecurityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
