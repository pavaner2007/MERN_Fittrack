import { useState, useEffect } from "react";
import { authAPI, getAuthToken, removeAuthToken, User, RegisterData } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    dailyStepGoal: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await authAPI.getProfile();
        if (response.success && response.user) {
          setUser(response.user);
          setEditData({
            name: response.user.name,
            age: response.user.age.toString(),
            height: response.user.height.toString(),
            weight: response.user.weight.toString(),
            dailyStepGoal: response.user.dailyStepGoal.toString()
          });
        }
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes('authorized')) {
          removeAuthToken();
          localStorage.removeItem('user');
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setEditData({
        name: user.name,
        age: user.age.toString(),
        height: user.height.toString(),
        weight: user.weight.toString(),
        dailyStepGoal: user.dailyStepGoal.toString()
      });
    }
  };

  const handleSaveEdit = async () => {
    setUpdateLoading(true);
    try {
      const response = await authAPI.updateProfile({
        name: editData.name,
        age: Number(editData.age),
        height: Number(editData.height),
        weight: Number(editData.weight),
        dailyStepGoal: Number(editData.dailyStepGoal)
      });
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsEditing(false);
      }
    } catch (err: any) {
      // Temporary fallback when backend is not running
      if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        const updatedUser = {
          ...user!,
          name: editData.name,
          age: Number(editData.age),
          height: Number(editData.height),
          weight: Number(editData.weight),
          dailyStepGoal: Number(editData.dailyStepGoal)
        };
        setUser(updatedUser);
        setIsEditing(false);
        console.warn('Backend not available - using local update only');
      } else {
        setError(err.message || "Failed to update profile");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const bmi = calculateBMI(user.weight, user.height);
  const bmiStatus = getBMIStatus(parseFloat(bmi));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-8">
          Profile 👤
        </h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500 text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={editData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={editData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={editData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Step Goal</label>
                  <input
                    type="number"
                    value={editData.dailyStepGoal}
                    onChange={(e) => handleInputChange('dailyStepGoal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveEdit}
                  disabled={updateLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 text-sm">Height</p>
                    <p className="text-2xl font-bold text-gray-900">{user.height} cm</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 text-sm">Weight</p>
                    <p className="text-2xl font-bold text-gray-900">{user.weight} kg</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 text-sm">BMI</p>
                    <p className={`text-2xl font-bold ${bmiStatus.color}`}>{bmi}</p>
                    <p className={`text-sm ${bmiStatus.color}`}>{bmiStatus.status}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 text-sm">Age</p>
                    <p className="text-2xl font-bold text-gray-900">{user.age}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-gray-600 text-sm">Daily Step Goal</p>
                <p className="text-2xl font-bold text-blue-600">{user.dailyStepGoal.toLocaleString()}</p>
                <p className="text-blue-600 text-sm">steps per day</p>
              </div>
              
              <button
                onClick={handleEditClick}
                className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
