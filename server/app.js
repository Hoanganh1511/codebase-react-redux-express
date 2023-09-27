require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const communityRoutes = require("./routes/community.route");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");
const search = require("./controllers/search.controller");
// const upload = multer({ dest: "uploads/" });
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
//connect MongoDB
const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);
app.use(cors());
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});
app.use("/communities", communityRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.get("/search", decodeToken, search);

app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to Backend" });
});
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
