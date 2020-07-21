import express from "express";
import { PostController } from "../controller/PostController";

const postRouter = express.Router();


postRouter.post("/", new PostController().createNewPost);

export default postRouter;