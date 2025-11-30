require("dotenv").config();
const app = require("./app");
const DB = require("./config/database");

DB.connect()
  .then(() => {
    console.log("🔥 Database Connected Successfully");
    DB.sequelize.sync({ alter: true })
      .then(() => console.log("📦 Models Synced"))
      .catch((err) => console.log("❌ Model Sync Error:", err));
  })
  .catch((err) => console.log("❌ DB Connection Failed:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
