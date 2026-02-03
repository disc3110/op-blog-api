const prisma = require('../config/prisma');

async function getHealth(req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      message: 'API is running and DB is connected ✅'
    });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({
      status: 'error',
      message: 'API is running but DB connection failed ❌'
    });
  }
}

module.exports = {
  getHealth,
};