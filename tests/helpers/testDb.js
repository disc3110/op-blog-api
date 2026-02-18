const prisma = require("../../src/config/prisma");

async function cleanDb() {
  // Orden importa por foreign keys:
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

module.exports = { prisma, cleanDb };