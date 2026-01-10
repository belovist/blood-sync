import { User } from '../services/api';

// Auth Context
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string, role?: string) => Promise<boolean>;
  register: (userData: any, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Dashboard Context
export interface DashboardContextType {
  stats: {
    activeRequests?: number;
    pendingApproval?: number;
    fulfilledToday?: number;
    totalUnits?: number;
    lowStockGroups?: number;
    criticalStockGroups?: number;
  };
  notifications: any[];
  refreshData: () => Promise<void>;
}

// Blood Request Context
export interface RequestContextType {
  requests: any[];
  loading: boolean;
  error: string | null;
  createRequest: (data: any) => Promise<void>;
  acceptRequest: (requestId: string, data?: any) => Promise<void>;
  declineRequest: (requestId: string, reason?: string) => Promise<void>;
  fulfillRequest: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string, reason?: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

// Inventory Context
export interface InventoryContextType {
  inventory: any;
  alerts: any[];
  statistics: any;
  loading: boolean;
  updateInventory: (bloodGroup: string, units: number, operation: string) => Promise<void>;
  refreshInventory: () => Promise<void>;
}

// Socket Context
export interface SocketContextType {
  socket: any;
  connected: boolean;
  notifications: any[];
  markNotificationRead: (notificationId: string) => void;
  sendNotification: (data: any) => void;
}

// Form Types
export interface DonorFormData {
  phone: string;
  pincode: string;
  password: string;
  confirmPassword: string;
  bloodGroup?: string;
}

export interface HospitalFormData {
  hospitalName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  registrationNumber?: string;
  contactPerson?: string;
  emergencyContact?: string;
}

export interface BloodBankFormData {
  bloodBankName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  licenseNumber?: string;
  operatingHours?: string;
}

export interface BloodRequestFormData {
  bloodGroup: string;
  units: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  medicalReason: string;
  hospitalAddress: string;
  hospitalWard?: string;
  notes?: string;
}

// Utility Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      current: number;
      pageSize: number;
      total: number;
      pages: number;
    };
  };
}

// Status Options
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export const URGENCY_LEVELS = ['low', 'medium', 'high', 'critical'] as const;
export const GENDER_OPTIONS = ['male', 'female', 'other'] as const;

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Notification Types
export interface Notification {
  _id: string;
  recipientId: string;
  recipientRole: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  relatedRequestId?: string;
}
