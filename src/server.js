require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

console.log('DATABASE_URL in prod:', process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});