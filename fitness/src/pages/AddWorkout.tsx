import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workoutAPI } from "../services/api";

export default function AddWorkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "cardio",
    duration: "",
    calories: "",
    intensity: "medium",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [selectedIcon, setSelectedIcon] = useState("🏃♂️");

  const workoutTypes = [
    { value: "cardio", label: "Cardio", icon: "🏃♂️", color: "from-red-500 to-pink-500" },
    { value: "strength", label: "Strength Training", icon: "💪", color: "from-blue-500 to-purple-500" },
    { value: "yoga", label: "Yoga & Flexibility", icon: "🧘♀️", color: "from-green-500 to-teal-500" },
    { value: "sports", label: "Sports", icon: "⚽", color: "from-orange-500 to-red-500" },
    { value: "swimming", label: "Swimming", icon: "🏊♂️", color: "from-blue-400 to-cyan-500" },
    { value: "cycling", label: "Cycling", icon: "🚴♂️", color: "from-yellow-500 to-orange-500" }
  ];

  const intensityLevels = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" }
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const workoutData = {
        ...formData,
        icon: selectedIcon,
        duration: Number(formData.duration),
        calories: Number(formData.calories)
      };
      
      const response = await workoutAPI.createWorkout(workoutData);
      if (response.success) {
        navigate("/workouts");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save workout");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "type") {
      const selectedType = workoutTypes.find(type => type.value === value);
      if (selectedType) {
        setSelectedIcon(selectedType.icon);
      }
    }
  };

  const estimateCalories = () => {
    const duration = parseInt(formData.duration);
    if (!duration) return;
    
    const baseCalories = {
      cardio: 8,
      strength: 6,
      yoga: 3,
      sports: 7,
      swimming: 9,
      cycling: 7
    };
    
    const intensityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.3
    };
    
    const estimated = Math.round(
      duration * 
      (baseCalories[formData.type as keyof typeof baseCalories] || 6) * 
      (intensityMultiplier[formData.intensity as keyof typeof intensityMultiplier] || 1)
    );
    
    setFormData(prev => ({ ...prev, calories: estimated.toString() }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/workouts")}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Workouts
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2">
            Add New Workout 💪
          </h1>
          <p className="text-gray-600">Log your fitness activity and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">Workout Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {workoutTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, type: type.value }));
                        setSelectedIcon(type.icon);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                        formData.type === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-2xl">{type.icon}</span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Morning Run"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    onBlur={estimateCalories}
                    placeholder="30"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Calories Burned</label>
                    <button
                      type="button"
                      onClick={estimateCalories}
                      className="text-blue-600 text-sm hover:text-blue-700 font-medium"
                    >
                      Auto Estimate
                    </button>
                  </div>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    placeholder="250"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Intensity Level</label>
                <div className="flex space-x-4">
                  {intensityLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, intensity: level.value }))}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        formData.intensity === level.value
                          ? level.color
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="How did the workout feel? Any achievements or observations..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/workouts")}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Workout"}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Preview</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">{selectedIcon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {formData.name || "Workout Name"}
                    </h4>
                    <p className="text-gray-600 text-sm">{formData.date}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formData.duration || "0"}</p>
                    <p className="text-gray-500 text-sm">minutes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formData.calories || "0"}</p>
                    <p className="text-gray-500 text-sm">calories</p>
                  </div>
                </div>
                
                {formData.intensity && (
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      intensityLevels.find(l => l.value === formData.intensity)?.color || "bg-gray-100 text-gray-800"
                    }`}>
                      {formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1)} Intensity
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Be specific with workout names</li>
                  <li>• Use the auto-estimate for calories</li>
                  <li>• Add notes for better tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
