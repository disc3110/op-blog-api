const path = require("path");
const { execSync } = require("child_process");

module.exports = async () => {
  // Carga .env.test ANTES de correr prisma
  require("dotenv").config({ path: path.resolve(process.cwd(), ".env.test") });

  // Aplica migraciones a la DB de test
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
};