// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  weight: number;
  height: number;
  age: number;
  dailyStepGoal: number;
  createdAt: string;
}

export interface Workout {
  _id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  intensity: string;
  date: string;
  notes?: string;
  icon: string;
}

export interface Walk {
  _id: string;
  duration: number;
  steps: number;
  distance: number;
  calories: number;
  date: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  workout?: Workout;
  workouts?: Workout[];
  walk?: Walk;
  walks?: Walk[];
  data?: T;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  weight?: number;
  height?: number;
  age?: number;
  dailyStepGoal?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<ApiResponse> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const authAPI = {
  register: (userData: RegisterData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials: { email: string; password: string }) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest('/auth/profile'),
  
  updateProfile: (userData: Partial<User>) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

export const workoutAPI = {
  getWorkouts: () => apiRequest('/workouts'),
  
  createWorkout: (workoutData: Partial<Workout>) => apiRequest('/workouts', {
    method: 'POST',
    body: JSON.stringify(workoutData),
  }),
  
  getWorkout: (id: string) => apiRequest(`/workouts/${id}`),
  
  updateWorkout: (id: string, workoutData: Partial<Workout>) => apiRequest(`/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(workoutData),
  }),
  
  deleteWorkout: (id: string) => apiRequest(`/workouts/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest('/workouts/stats'),
};

export const walkAPI = {
  getWalks: () => apiRequest('/walks'),
  
  createWalk: (walkData: Partial<Walk>) => apiRequest('/walks', {
    method: 'POST',
    body: JSON.stringify(walkData),
  }),
  
  getTodayWalk: () => apiRequest('/walks/today'),
  
  updateWalk: (id: string, walkData: Partial<Walk>) => apiRequest(`/walks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(walkData),
  }),
};

// Create axios-like api instance for easier usage
export const api = {
  get: (endpoint: string) => apiRequest(endpoint),
  post: (endpoint: string, data?: any) => apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  put: (endpoint: string, data?: any) => apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: (endpoint: string) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
};

export { getAuthToken, setAuthToken, removeAuthToken };