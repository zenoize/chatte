import * as express from "express";
import * as mongoose from "mongoose";
import * as path from "path";
// import * as http from "http";
import * as socketIO from "socket.io";

import ws from "./ws";

// import auth from "./routes/api/auth";
import account from "./http/routes/api/account";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

async function init() {
  app.use("/api/account", account);
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) throw "ENV VARIABLES INCORRECT";

  //production mode
  if (process.env.NODE_ENV === "production") {
    console.log("yeah");

    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  mongoose
    .connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(console.log);

  const port = process.env.PORT || 5000;

  // io.on("connection", s => {
  //   console.log("WHAT");
  // });

  const server = app.listen(port, async () => {
    console.log(`Server listening at ${port} port`);

    // console.log("yeah");
    // await test();
  });
  const io = socketIO.listen(server);
  ws(io);
  // io.on("connection", () => {
  //   console.log("WORK");
  // });
}

init();
