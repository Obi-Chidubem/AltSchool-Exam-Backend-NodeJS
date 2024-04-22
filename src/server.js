import { connect } from "./database/databaseConnection.js"
import app from "./app.js"
import dotenv from 'dotenv'

dotenv.config();

const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;
const PORT = process.env.PORT || 5000;

connect(MONGODB_CONNECTION_URI).then(() => {
  console.log("Database Connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
