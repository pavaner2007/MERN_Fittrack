import Walk from "../models/Walk.js";

export const getWalks = async (req, res) => {
  try {
    const walks = await Walk.find({ user: req.user.id })
      .sort({ date: -1 });
    
    res.json({ success: true, walks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWalk = async (req, res) => {
  try {
    const { steps, distance, duration, calories, date } = req.body;
    
    const walk = await Walk.create({
      user: req.user.id,
      steps,
      distance,
      duration,
      calories,
      date
    });

    res.status(201).json({ success: true, walk });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayWalk = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const walk = await Walk.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.json({ success: true, walk });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWalk = async (req, res) => {
  try {
    const walk = await Walk.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!walk) {
      return res.status(404).json({ message: 'Walk not found' });
    }

    res.json({ success: true, walk });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};