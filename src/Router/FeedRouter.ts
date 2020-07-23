import express from "express";
import {FeedController} from '../controller/FeedController';

const feedRouter = express.Router();

feedRouter.get("/", new FeedController().getFeed);

export default feedRouter;


















