import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['cardio', 'strength', 'yoga', 'sports', 'swimming', 'cycling']
  },
  duration: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  icon: {
    type: String,
    default: '🏃‍♂️'
  }
}, {
  timestamps: true
});

export default mongoose.model('Workout', workoutSchema);