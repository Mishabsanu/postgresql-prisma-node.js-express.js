
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const verifyRefreshToken = async (req, res, next) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];
  
    if (!accessToken) {
      return res.status(403).json({ error: 'Refresh token not provided' });
    }

    try {
      const decoded = jwt.verify(accessToken, `${process.env.accessToken}`); 
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid access token' });
      }
  
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'Invalid access token' });
    }
  };
module.exports = verifyRefreshToken;