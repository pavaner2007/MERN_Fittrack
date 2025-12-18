import Workout from "../models/Workout.js";

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .sort({ date: -1 });
    
    res.json({ success: true, workouts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const { name, type, duration, calories, intensity, notes, date, icon } = req.body;
    
    const workout = await Workout.create({
      user: req.user.id,
      name,
      type,
      duration,
      calories,
      intensity,
      notes,
      date,
      icon
    });

    res.status(201).json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ success: true, message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$calories' },
          totalDuration: { $sum: '$duration' },
          avgCalories: { $avg: '$calories' },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    res.json({ 
      success: true, 
      stats: stats[0] || {
        totalWorkouts: 0,
        totalCalories: 0,
        totalDuration: 0,
        avgCalories: 0,
        avgDuration: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};