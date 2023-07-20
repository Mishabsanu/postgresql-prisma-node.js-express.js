const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  userSignup: async (req, res) => {
    const { username, password } = req.body;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: "Signup successful", userId: user.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  userLogin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { userId: user.id },
        `${process.env.accessToken}`,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        `${process.env.refreshToken}`
      );
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  dashboard: async (req, res) => {
    res.json({ message: "Accessed dashboard successfully" });
  },
};
