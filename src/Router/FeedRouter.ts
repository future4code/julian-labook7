import express from "express";
import {FeedController} from '../controller/FeedController';

const feedRouter = express.Router();

feedRouter.get("/", new FeedController().getFeed);
feedRouter.get("/singlePost", new FeedController().getSinglePost)

export default feedRouter;


















