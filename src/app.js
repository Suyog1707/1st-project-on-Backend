import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// import routers
import userRouter from "./routes/user.routes.js"
import videoRourter from "./routes/video.routes.js"

//define routers
app.use("/api/v1/user", userRouter)
app.use("/api/v1/video", videoRourter)

export default app;