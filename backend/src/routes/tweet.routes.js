import { Router } from "express";
import { createTweet,getUserTweets,updateTweet,deleteTweet,getAllTweets } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/").post(createTweet)
router.route("/user/:userID").get(getUserTweets);
router.route("/:tweetID").patch(updateTweet).delete(deleteTweet);
router.route("/").get(getAllTweets);


export default router

