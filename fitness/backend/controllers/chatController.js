import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user.id });
    res.json(chat?.messages || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message and get bot response
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // Add user message
    chat.messages.push({
      content: message,
      sender: 'user',
    });

    // Generate bot response
    const botResponse = await generateBotResponse(message, userId);
    
    chat.messages.push({
      content: botResponse,
      sender: 'bot',
    });

    await chat.save();

    res.json({
      userMessage: message,
      botResponse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simple bot response generator
const generateBotResponse = async (message, userId) => {
  try {
    const user = await User.findById(userId);
    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(5);
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      return "Great question! For effective workouts, aim for 3-4 sessions per week with rest days in between. Mix cardio and strength training for best results.";
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return "Nutrition is crucial for fitness! Focus on whole foods, lean proteins, complex carbs, and plenty of water.";
    }
    
    if (lowerMessage.includes('weight') || lowerMessage.includes('lose') || lowerMessage.includes('gain')) {
      return "Weight management combines proper nutrition with regular exercise. Aim for gradual changes - 1-2 pounds per week is healthy and sustainable.";
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('tired') || lowerMessage.includes('lazy')) {
      return "I understand! Remember why you started your fitness journey. Small steps count - even a 10-minute walk is better than nothing. You've got this! 💪";
    }
    
    if (lowerMessage.includes('stats') || lowerMessage.includes('progress')) {
      if (workouts.length > 0) {
        const lastWorkout = workouts[0];
        return `Your last workout was ${lastWorkout.type} on ${new Date(lastWorkout.date).toLocaleDateString()}. You've logged ${workouts.length} recent workouts - keep it up!`;
      }
      return "I'd love to help track your progress! Start by logging some workouts and I can give you insights.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello ${user?.name || 'there'}! I'm your fitness assistant. How can I help you today?`;
    }
    
    if (lowerMessage.includes('help')) {
      return "I can help you with:\n• Workout and exercise advice\n• Nutrition tips\n• Motivation and encouragement\n• Progress tracking insights\n• General fitness questions\n\nWhat would you like to know?";
    }

    return "I'm here to help with your fitness journey! Ask me about workouts, nutrition, or motivation.";
    
  } catch (error) {
    return "I'm here to help with your fitness journey! What would you like to know?";
  }
};