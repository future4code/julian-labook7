import express from "express";
import { UserController } from "../controller/UserController";

const userRouter = express.Router();

userRouter.post("/", new UserController().signup);
userRouter.post("/login", new UserController().login);
userRouter.post("/renew_token", new UserController().getNewAccessToken);
userRouter.post("/make_friends", new UserController().makeFriends);
userRouter.delete("/undo_friends", new UserController().undoFriends);

export default userRouter;