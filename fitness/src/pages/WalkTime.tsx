import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { walkAPI, Walk } from "../services/api";

export default function WalkTime() {
  const navigate = useNavigate();
  const [walks, setWalks] = useState<Walk[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWalks();
  }, []);

  const fetchWalks = async () => {
    try {
      const response = await walkAPI.getWalks();
      if (response.success && response.walks) {
        setWalks(response.walks);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addSession = async () => {
    if (!input) return;
    setLoading(true);
    setError("");
    
    try {
      const walkData = {
        duration: Number(input),
        steps: Math.round(Number(input) * 100),
        distance: Math.round(Number(input) * 0.08 * 100) / 100,
        calories: Math.round(Number(input) * 4),
        date: new Date().toISOString()
      };
      
      const response = await walkAPI.createWalk(walkData);
      if (response.success && response.walk) {
        setWalks([response.walk, ...walks]);
        setInput("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalTime = walks.reduce((sum, w) => sum + w.duration, 0);
  const totalSteps = walks.reduce((sum, w) => sum + w.steps, 0);
  const totalCalories = walks.reduce((sum, w) => sum + w.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2">
            Walking Time 🚶‍♂️
          </h1>
          <p className="text-gray-600">Track your daily walking sessions and monitor your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Time</p>
                <p className="text-3xl font-bold text-blue-600">{totalTime}</p>
                <p className="text-gray-500 text-sm">minutes</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Steps</p>
                <p className="text-3xl font-bold text-green-600">{totalSteps.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">steps</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Calories</p>
                <p className="text-3xl font-bold text-orange-600">{totalCalories}</p>
                <p className="text-gray-500 text-sm">calories</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Session */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Walking Session</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="Enter minutes walked"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSession()}
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <button
                onClick={addSession}
                disabled={!input || loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Session"}
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Walking Sessions</h2>
            
            {walks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚶‍♂️</span>
                </div>
                <p className="text-gray-600">No walking sessions yet</p>
                <p className="text-gray-500 text-sm">Add your first session above</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {walks.map((walk, index) => (
                  <div key={walk._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">🚶‍♂️</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Walk {index + 1}</p>
                        <p className="text-gray-600 text-sm">{new Date(walk.date).toLocaleDateString()}</p>
                        <p className="text-gray-500 text-xs">{walk.steps} steps • {walk.distance} km</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{walk.duration}</p>
                      <p className="text-gray-500 text-sm">minutes</p>
                      <p className="text-orange-500 text-xs">{walk.calories} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}