import express, { Request, Response } from "express";
import dotenv from "dotenv";
import moment from "moment";
import { AddressInfo } from "net";
import IdGenerator from "./services/IdGen.class";
import UserDB, { User } from "./data/UserDB.class";
import Authenticator from "./services/Authenticator.class";
import HashManager from "./services/HashManager.class";
dotenv.config();

const app = express();

app.use(express.json());

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});

