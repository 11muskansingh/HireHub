import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Test route to check CORS configuration
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is configured correctly!" });
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import jobRouter from "./routes/job.routes.js";
app.use("/api/v1/jobs", jobRouter);

import companyRouter from "./routes/company.routes.js";
app.use("/api/v1/companies", companyRouter);

import applicationRouter from "./routes/application.routes.js";
app.use("/api/v1/applications", applicationRouter);
export { app };
