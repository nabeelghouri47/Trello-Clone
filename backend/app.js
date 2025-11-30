const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const boardsRoutes = require("./routes/boards");
const listsRoutes = require("./routes/lists");
const tasksRoutes = require("./routes/tasks");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/tasks", tasksRoutes);

module.exports = app;
