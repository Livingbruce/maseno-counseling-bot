// Create admin user for Maseno Counseling Bot
import bcrypt from "bcrypt";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

async function createAdmin() {
  try {
    console.log("🔐 Creating admin user...");
    
    // Hash the password
    const password = "123456";
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Check if admin already exists
    const existingAdmin = await pool.query(
      "SELECT id FROM counselors WHERE email = $1",
      ["admin@maseno.ac.ke"]
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log("✅ Admin user already exists");
      return;
    }
    
    // Create admin user
    const result = await pool.query(
      "INSERT INTO counselors (name, email, password_hash, is_admin, phone, specialization, bio, office_location, office_hours) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [
        "Admin User",
        "admin@maseno.ac.ke",
        passwordHash,
        true,
        "+254700000000",
        "System Administration",
        "System administrator for Maseno Counseling Bot",
        "Main Campus - Admin Office",
        "Monday-Friday: 8:00 AM - 5:00 PM"
      ]
    );
    
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@maseno.ac.ke");
    console.log("🔑 Password: 123456");
    console.log("👑 Admin: Yes");
    console.log("🆔 ID:", result.rows[0].id);
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

createAdmin().catch(console.error);
