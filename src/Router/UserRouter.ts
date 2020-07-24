import express from "express";
import { UserController } from "../controller/UserController";

const userRouter = express.Router();

userRouter.post("/", new UserController().signup);
userRouter.post("/login", new UserController().login);
userRouter.post("/renew_token", new UserController().getNewAccessToken);

export default userRouter;