import express from "express";
import { 
  getWalks, 
  createWalk, 
  getTodayWalk, 
  updateWalk 
} from "../controllers/walkController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWalks)
  .post(createWalk);

router.get('/today', getTodayWalk);

router.route('/:id')
  .put(updateWalk);

export default router;