const express = require('express');
const morgan = require("morgan");
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userRoutes = require("./routes/user");

app.use(morgan("common"));
app.use(express.json());


async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to the database.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

checkDatabaseConnection();
const PORT = 3000;

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});