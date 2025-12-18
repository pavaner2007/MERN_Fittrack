import React, { useState, useEffect } from "react";
import WalkStatCard from "../components/WalkStatCard";
import { useNavigate } from "react-router-dom";
import { authAPI, User } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stepGoal, setStepGoal] = useState(8000);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [currentSteps] = useState(4520);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.user) {
        setUser(response.user);
        setStepGoal(response.user.dailyStepGoal);
        
        // Check if user has default step goal (first time)
        if (response.user.dailyStepGoal === 8000) {
          const hasSetGoal = localStorage.getItem('hasSetStepGoal');
          if (!hasSetGoal) {
            setIsFirstTime(true);
            setShowGoalModal(true);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { status: "Normal", color: "text-green-600" };
    if (bmi < 30) return { status: "Overweight", color: "text-yellow-600" };
    return { status: "Obese", color: "text-red-600" };
  };

  const updateStepGoal = async () => {
    if (!newGoal || isNaN(Number(newGoal))) return;
    
    setStepGoal(Number(newGoal));
    setShowGoalModal(false);
    setNewGoal('');
    
    // Mark that user has set their goal
    if (isFirstTime) {
      localStorage.setItem('hasSetStepGoal', 'true');
      setIsFirstTime(false);
    }
  };

  const progressPercentage = Math.min((currentSteps / stepGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Welcome back{user ? `, ${user.name}` : ''}! 👋
              </h1>
              <p className="text-gray-600 mt-2">Here's your fitness progress for today</p>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Your BMI</p>
                    <p className={`text-2xl font-bold ${getBMIStatus(parseFloat(calculateBMI(user.weight, user.height))).color}`}>
                      {calculateBMI(user.weight, user.height)}
                    </p>
                    <p className={`text-xs ${getBMIStatus(parseFloat(calculateBMI(user.weight, user.height))).color}`}>
                      {getBMIStatus(parseFloat(calculateBMI(user.weight, user.height))).status}
                    </p>
                  </div>
                </div>
              )}
              <div className="text-right">
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <WalkStatCard
            title="Steps Walked"
            value={currentSteps.toLocaleString()}
            subtitle="Today's total steps"
            icon="👟"
            progress={Math.round(progressPercentage)}
          />

          <div className="relative">
            <WalkStatCard
              title="Target Steps"
              value={stepGoal.toLocaleString()}
              subtitle="Daily target"
              icon="🎯"
              progress={100}
            />
            <button
              onClick={() => setShowGoalModal(true)}
              className="absolute top-2 right-2 w-8 h-8 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
              title="Edit Goal"
            >
              ✏️
            </button>
          </div>

          <WalkStatCard
            title="Distance Walked"
            value="3.2 km"
            subtitle="Based on steps"
            icon="📍"
            progress={64}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate("/walktime")}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🚶‍♂️</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-semibold text-left">Walk Time</h3>
            <p className="text-blue-100 text-sm text-left">Track your walks</p>
          </button>

          <button
            onClick={() => navigate("/workouts")}
            className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">💪</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-semibold text-left">Workouts</h3>
            <p className="text-purple-100 text-sm text-left">View all workouts</p>
          </button>

          <button
            onClick={() => navigate("/add-workout")}
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">➕</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-semibold text-left">Add Workout</h3>
            <p className="text-green-100 text-sm text-left">Log new exercise</p>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">👤</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-semibold text-left">Profile</h3>
            <p className="text-orange-100 text-sm text-left">Manage account</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🏃‍♂️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Morning Run</h3>
                  <p className="text-gray-600 text-sm">30 minutes • 5.2 km</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🏋️‍♀️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Strength Training</h3>
                  <p className="text-gray-600 text-sm">45 minutes • Upper body</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Step Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center mb-4">
              {isFirstTime && (
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {isFirstTime ? 'Welcome! Set Your Daily Step Goal' : 'Update Daily Step Goal'}
              </h3>
              {isFirstTime && (
                <p className="text-gray-600 text-sm mt-2">Let's personalize your fitness journey by setting a daily step target!</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Step Target
              </label>
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder={stepGoal.toString()}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {[5000, 8000, 10000, 12000, 15000].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setNewGoal(goal.toString())}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    {goal.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isFirstTime && (
                <button
                  onClick={() => {
                    setShowGoalModal(false);
                    setNewGoal('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={updateStepGoal}
                className={`${isFirstTime ? 'w-full' : 'flex-1'} px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200`}
              >
                {isFirstTime ? 'Set My Goal' : 'Save Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
