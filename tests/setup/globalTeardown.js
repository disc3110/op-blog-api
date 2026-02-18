const path = require("path");
module.exports = async () => {
  require("dotenv").config({ path: path.resolve(process.cwd(), ".env.test") });
  const prisma = require("../../src/config/prisma");
  await prisma.$disconnect();
};