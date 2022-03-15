const app = require('./app');
const { connectDatabase } = require('./config/database');
const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}!`);
});

connectDatabase();
