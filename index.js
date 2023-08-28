const express = require('express');
const app = express();
const connectToMongo = require('./config/database');

const { API_PORT } = process.env

app.use(express.json({ extended: false }));

connectToMongo();

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/password", require("./routes/api/forgotPassword"));


app.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});