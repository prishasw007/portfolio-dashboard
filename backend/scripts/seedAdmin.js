require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  try {
    // Connect to DB (no deprecated options)
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "prishaswaroop6@gmail.com";       // your admin email
    const adminPassword = "P041006b#";                   // your admin password

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const result = await User.updateOne(
      { email: adminEmail },
      {
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true }
    );

    console.log("✅ Admin account seeded successfully:", result);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword} (change after first login)`);

    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
})();
