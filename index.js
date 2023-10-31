const express = require('express');
const app = express();
const connectToMongo = require('./config/database');
const cors = require("cors");


const { API_PORT } = process.env

app.use(express.json({ extended: false }));
app.use(cors({
    origin: true,
    credentials: true,
    methods: 'POST,GET,PUT,OPTIONS,DELETE' 
}));
connectToMongo();

app.use("/api/auth", require("./routes/api/auth"));

app.use("/api/password", require("./routes/api/forgotPassword"));

app.use("/api", require("./routes/api/routes"));
  

app.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});