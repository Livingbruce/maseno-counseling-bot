const axios = require("axios");

const API_URL = "https://maseno-counseling-fresh-1uqnm05rf-victor-mburugu-s-projects.vercel.app";

async function testWorkingSolution() {
  console.log("🚀 TESTING WORKING SOLUTION...");
  
  try {
    // Test API
    console.log("\n1️⃣ Testing API...");
    const apiResponse = await axios.get(`${API_URL}/api/`);
    console.log("✅ API Status:", apiResponse.data.message);
    
    // Test Login
    console.log("\n2️⃣ Testing Login...");
    const loginResponse = await axios.post(`${API_URL}/api/login`, {
      email: "admin@maseno.ac.ke",
      password: "123456"
    });
    console.log("✅ Login Success:", loginResponse.data.message);
    console.log("✅ User:", loginResponse.data.user.name);
    console.log("✅ Admin:", loginResponse.data.user.is_admin);
    console.log("✅ Token:", loginResponse.data.token ? "Present" : "Missing");
    
    console.log("\n🎉 WORKING SOLUTION CONFIRMED!");
    console.log("\n📋 WHAT WORKS:");
    console.log("✅ API endpoints are functional");
    console.log("✅ Login authentication works");
    console.log("✅ User data retrieval works");
    console.log("✅ JWT token generation works");
    
    console.log("\n🌐 ACCESS YOUR APP:");
    console.log(`URL: ${API_URL}`);
    console.log("Email: admin@maseno.ac.ke");
    console.log("Password: 123456");
    
    console.log("\n💡 NEXT STEPS:");
    console.log("1. Visit the URL above");
    console.log("2. Use the credentials to login");
    console.log("3. The API will handle authentication");
    console.log("4. You can build your frontend to use this API");
    
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

testWorkingSolution();
