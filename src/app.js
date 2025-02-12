const express = require("express");
const healthCheckerRouter = require("./routes/healthchecker");
// const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

const app = express();
app.use(express.json());
app.use("/api", healthCheckerRouter);
//app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);