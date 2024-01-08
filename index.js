const express = require('express');
const app = express();
const connectToMongo = require('./config/database');
const cors = require("cors");

const { API_PORT } = process.env;

app.use(express.json())

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));

app.use(cors({
  origin: '*',
  credentials: true,
  methods: 'POST, GET, PUT, OPTIONS, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://simed-six.vercel.app");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

connectToMongo();

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/password", require("./routes/api/forgotPassword"));
app.use("/api", require("./routes/api/routes"));

app.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});
