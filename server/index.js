import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import connectMongodb from "./Config/connection.js";
import dotenv from "dotenv";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import PostRoutes from "./Routes/PostRoutes.js";
import authenticateJWT from "./Middlewares/jwtMiddleware.js";
/* declearing port */
dotenv.config();
const PORT = process.env.HOST_PORT || 4000;
const app = express();

mongoose.set("strictQuery", true);
// Allow requests from client-side http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// to serve images for public
app.use(express.static("public"));
app.use("/images", express.static("images"));

/* bodyParser.json() or express.json() is used for add the built-in JSON body parser to properly add the "body" property to the request object. */
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

/* connecting to mongodb */
await connectMongodb();

// usages of routes
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/post", PostRoutes);
// Route handler for GET /
app.get("/hi", (req, res) => {
  res.sendFile(path.join(path.resolve(), "index.html"));
});

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err?.status || 500).json({
    // error: {
    //   message: err.message || "Internal Server Error",
    //   status: err.status || 500,
    // },
    message: err?.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log("port is running", PORT);
});
