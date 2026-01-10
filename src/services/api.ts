// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Types
export interface User {
  _id: string;
  role: 'donor' | 'hospital' | 'blood-bank';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  // Donor fields
  phone?: string;
  pincode?: string;
  bloodGroup?: string;
  isAvailable?: boolean;
  lastDonation?: string;
  totalDonations?: number;
  // Hospital fields
  hospitalName?: string;
  email?: string;
  address?: string;
  registrationNumber?: string;
  contactPerson?: string;
  emergencyContact?: string;
  // Blood bank fields
  bloodBankName?: string;
  licenseNumber?: string;
  operatingHours?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on init
    this.token = localStorage.getItem('bloodsync_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('bloodsync_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('bloodsync_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Always check localStorage for latest token (in case it was updated)
    const latestToken = localStorage.getItem('bloodsync_token');
    if (latestToken && latestToken !== this.token) {
      this.token = latestToken;
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Use latest token from localStorage if available
    const tokenToUse = latestToken || this.token;
    if (tokenToUse) {
      headers.Authorization = `Bearer ${tokenToUse}`;
    } else {
      console.warn('No authentication token available for request:', endpoint);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        
        // Handle token errors specifically
        if (response.status === 401) {
          // Token expired or invalid - clear it
          this.token = null;
          localStorage.removeItem('bloodsync_token');
          localStorage.removeItem('bloodsync_user');
          throw new Error('Authentication required. Please login again.');
        }
        
        throw new Error(errorMessage);
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authAPI = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', {
      identifier,
      password,
    });
    return response.json();
  },

  async registerDonor(data: {
    phone: string;
    pincode: string;
    password: string;
    confirmPassword: string;
    bloodGroup?: string;
  }): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register/donor', data);
    return response.json();
  },

  async registerHospital(data: {
    hospitalName: string;
    email: string;
    address: string;
    password: string;
    confirmPassword: string;
    registrationNumber?: string;
    contactPerson?: string;
    emergencyContact?: string;
  }): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register/hospital', data);
    return response.json();
  },

  async registerBloodBank(data: {
    bloodBankName: string;
    email: string;
    address: string;
    password: string;
    confirmPassword: string;
    licenseNumber?: string;
    operatingHours?: string;
  }): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register/blood-bank', data);
    return response.json();
  },

  async verifyToken(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await apiClient.get('/auth/verify');
    return response.json();
  },
};

// Users API
export const usersAPI = {
  async getProfile(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await apiClient.get('/users/profile');
    return response.json();
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data: { user: User } }> {
    const response = await apiClient.put('/users/profile', data);
    return response.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.json();
  },

  async updateDonorAvailability(isAvailable: boolean): Promise<{ success: boolean }> {
    const response = await apiClient.put('/users/donor/availability', { isAvailable });
    return response.json();
  },

  async recordDonation(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.post('/users/donor/donation');
    return response.json();
  },
};

// Blood Requests API
export interface BloodRequest {
  _id: string;
  requestId: string;
  hospitalId: string;
  bloodGroup: string;
  units: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  medicalReason: string;
  status: 'pending' | 'approved' | 'declined' | 'fulfilled' | 'cancelled';
  assignedBloodBankId?: string;
  assignedBloodBankName?: string;
  isEmergency: boolean;
  hospitalAddress: string;
  createdAt: string;
}

export const requestsAPI = {
  async createRequest(data: {
    bloodGroup: string;
    units: number;
    urgency: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    medicalReason: string;
    hospitalAddress: string;
    hospitalWard?: string;
    notes?: string;
  }): Promise<{ success: boolean; data: { request: BloodRequest } }> {
    const response = await apiClient.post('/requests', data);
    return response.json();
  },

  async getMyRequests(page = 1, limit = 10, status?: string): Promise<{
    success: boolean;
    data: { requests: BloodRequest[]; pagination: any };
  }> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    
    const response = await apiClient.get(`/requests/my-requests?${params}`);
    return response.json();
  },

  async getActiveRequests(page = 1, limit = 10, bloodGroup?: string, urgency?: string): Promise<{
    success: boolean;
    data: { requests: BloodRequest[]; pagination: any };
  }> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (urgency) params.append('urgency', urgency);
    
    const response = await apiClient.get(`/requests/active?${params}`);
    return response.json();
  },

  async acceptRequest(requestId: string, estimatedDeliveryTime?: string, responseMessage?: string): Promise<{
    success: boolean;
    data: { request: BloodRequest };
  }> {
    const response = await apiClient.put(`/requests/${requestId}/accept`, {
      estimatedDeliveryTime,
      responseMessage,
    });
    return response.json();
  },

  async declineRequest(requestId: string, reason?: string): Promise<{
    success: boolean;
    data: { request: BloodRequest };
  }> {
    const response = await apiClient.put(`/requests/${requestId}/decline`, { reason });
    return response.json();
  },

  async fulfillRequest(requestId: string): Promise<{
    success: boolean;
    data: { request: BloodRequest };
  }> {
    const response = await apiClient.put(`/requests/${requestId}/fulfill`);
    return response.json();
  },

  async cancelRequest(requestId: string, reason?: string): Promise<{
    success: boolean;
    data: { request: BloodRequest };
  }> {
    const response = await apiClient.put(`/requests/${requestId}/cancel`, { reason });
    return response.json();
  },
};

// Emergency API
export const emergencyAPI = {
  async activatePanicMode(requestId?: string, reason?: string): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const response = await apiClient.post('/emergency/panic', { requestId, reason });
    return response.json();
  },

  async getEmergencyRequests(status = 'active', page = 1, limit = 10): Promise<{
    success: boolean;
    data: { requests: BloodRequest[]; pagination: any };
  }> {
    const params = new URLSearchParams({ status, page: page.toString(), limit: limit.toString() });
    const response = await apiClient.get(`/emergency/requests?${params}`);
    return response.json();
  },

  async acceptEmergencyRequest(requestId: string, data: {
    estimatedDeliveryTime?: string;
    responseMessage?: string;
    priority?: string;
  }): Promise<{ success: boolean; data: { request: BloodRequest } }> {
    const response = await apiClient.put(`/emergency/${requestId}/accept-emergency`, data);
    return response.json();
  },
};

// Inventory API
export interface BloodInventory {
  _id: string;
  bloodBankId: string;
  bloodGroups: {
    [key: string]: {
      units: number;
      minimumThreshold: number;
      lastUpdated: string;
    };
  };
  totalUnits: number;
  isOperational: boolean;
}

export const inventoryAPI = {
  async getInventory(): Promise<{ success: boolean; data: { inventory: BloodInventory } }> {
    const response = await apiClient.get('/inventory');
    return response.json();
  },

  async updateInventory(bloodGroup: string, units: number, operation: 'add' | 'subtract' | 'set'): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const response = await apiClient.put('/inventory/update', {
      bloodGroup,
      units,
      operation,
    });
    return response.json();
  },

  async getAlerts(): Promise<{ success: boolean; data: { alerts: any[]; totalUnits: number } }> {
    const response = await apiClient.get('/inventory/alerts');
    return response.json();
  },

  async getAvailableBlood(bloodGroup?: string): Promise<{
    success: boolean;
    data: { availableBloodGroups: any; totalUnits: number };
  }> {
    const params = bloodGroup ? `?bloodGroup=${bloodGroup}` : '';
    const response = await apiClient.get(`/inventory/available${params}`);
    return response.json();
  },

  async getStatistics(): Promise<{ success: boolean; data: { statistics: any } }> {
    const response = await apiClient.get('/inventory/statistics');
    return response.json();
  },
};
