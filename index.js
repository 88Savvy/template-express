import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import connectToDB from "./config/db.config.js";

import userRouter from "./routes/user.routes.js";
import uploadRoute from "./routes/upload.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import followRouter from "./routes/follow.routes.js";
import likeRouter from "./routes/like.routes.js";
import viewsRouter from "./routes/view.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/upload", uploadRoute);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/following", followRouter);
app.use("/likes", likeRouter);
app.use("/views", viewsRouter);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next(err);
  }
});

connectToDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server up and running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });
