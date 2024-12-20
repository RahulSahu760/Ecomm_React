import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authentication from "./routes/authentication.js";

dotenv.config();

connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authentication);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send({
    message: "Ecomm project",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
