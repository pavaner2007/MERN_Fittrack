import express from "express";
import { 
  getWorkouts, 
  createWorkout, 
  getWorkout, 
  updateWorkout, 
  deleteWorkout,
  getWorkoutStats 
} from "../controllers/workoutController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWorkouts)
  .post(createWorkout);

router.get('/stats', getWorkoutStats);

router.route('/:id')
  .get(getWorkout)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router;