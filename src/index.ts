import express, { Request, Response } from "express";
import dotenv from "dotenv";
import moment from "moment";
import { AddressInfo } from "net";
import IdGenerator from "./services/IdGen.class";
import UserDatabase, { User } from "./data/UserDatabase";
import Authenticator from "./services/Authenticator.class";
import HashManager from "./services/HashManager.class";
import userRouter from "./Router/UserRouter";
import postRouter from "./Router/PostRouter";
dotenv.config();

const app = express();

app.use(express.json());

app.use("/user", userRouter);

app.use("/post", postRouter);

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
