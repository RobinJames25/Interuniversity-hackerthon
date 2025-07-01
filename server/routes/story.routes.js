import { Router } from "express";;
import { createStory } from "../controllers/story.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();
router.post('/story', verifyToken, createStory);
export default router;
