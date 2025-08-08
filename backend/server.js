const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:5173", "https://prishaswaroop.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/api/Skills", require("./routes/Skills"));
app.use("/api/Experiences", require("./routes/Experiences"));
app.use("/api/Projects", require("./routes/Projects"));
app.use("/api/AboutMe", require("./routes/AboutMe"));
app.use("/api/ContactMessages", require("./routes/ContactMessages"));
app.use("/api/AccountSettings", require("./routes/AccountSettings"));
app.use("/api/Auth", require("./routes/Auth"));
app.use("/api/Upload",require("./routes/Upload"))
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
