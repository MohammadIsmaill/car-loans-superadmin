import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('super_admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('super_admin_token');
        localStorage.removeItem('super_admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const authAPI = {
  sendOtp: async (phone: string) => {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string; phone?: string; avatar?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Debug auth for development
  debugAuth: async (data: { name: string; email: string; phone: string; role?: string }) => {
    const response = await api.post('/auth/debug-auth', { ...data, role: 'super_admin' });
    return response.data;
  },
};

// ==================== DASHBOARD ====================

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/super-admin/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (limit?: number) => {
    const response = await api.get('/super-admin/dashboard/activity', { params: { limit } });
    return response.data;
  },
};

// ==================== DEALERS ====================

export interface Dealer {
  _id: string;
  name: string;
  code: string;
  rating?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  status: 'pending' | 'active' | 'blocked' | 'deleted';
  commercialRegNumber?: string;
  vatNumber?: string;
  logo?: string;
  documents?: {
    type: string;
    url: string;
    name?: string;
    uploadedAt: string;
  }[];
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    iban?: string;
  };
  blockedReason?: string;
  blockedAt?: string;
  deletedReason?: string;
  deletedAt?: string;
  totalLoans?: number;
  totalApprovedLoans?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DealerFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const dealersAPI = {
  getAll: async (filters?: DealerFilters) => {
    const response = await api.get('/super-admin/dealers', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/super-admin/dealers/${id}`);
    return response.data;
  },

  create: async (data: Partial<Dealer>) => {
    const response = await api.post('/super-admin/dealers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Dealer>) => {
    const response = await api.put(`/super-admin/dealers/${id}`, data);
    return response.data;
  },

  approve: async (id: string) => {
    const response = await api.put(`/super-admin/dealers/${id}/approve`);
    return response.data;
  },

  block: async (id: string, reason: string) => {
    const response = await api.put(`/super-admin/dealers/${id}/block`, { reason });
    return response.data;
  },

  unblock: async (id: string) => {
    const response = await api.put(`/super-admin/dealers/${id}/unblock`);
    return response.data;
  },

  delete: async (id: string, reason?: string) => {
    const response = await api.delete(`/super-admin/dealers/${id}`, { data: { reason } });
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.put(`/super-admin/dealers/${id}/restore`);
    return response.data;
  },
};

// ==================== USERS ====================

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  phoneCountryCode?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'sales' | 'staff' | 'financial-approval' | 'client';
  position?: string;
  isActive: boolean;
  lastLogin?: string;
  nationalId?: string;
  notificationSettings?: {
    newRequests: boolean;
    reminders: boolean;
    policyAndCommunity: boolean;
    accountSupport: boolean;
  };
  globalPreferences?: {
    language: string;
    currency: string;
    timezone: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

export const usersAPI = {
  getAll: async (filters?: UserFilters) => {
    const response = await api.get('/super-admin/users', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/super-admin/users/${id}`);
    return response.data;
  },

  create: async (data: Partial<User>) => {
    const response = await api.post('/super-admin/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<User>) => {
    const response = await api.put(`/super-admin/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/super-admin/users/${id}`);
    return response.data;
  },
};

// ==================== BANKS ====================

export interface Bank {
  _id: string;
  name: string;
  code?: string;
  logo?: string;
  contactPerson?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  loanTerms?: {
    minAmount?: number;
    maxAmount?: number;
    interestRate?: number;
    maxTenure?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankFilters {
  search?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

export const banksAPI = {
  getAll: async (filters?: BankFilters) => {
    const response = await api.get('/super-admin/banks', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/super-admin/banks/${id}`);
    return response.data;
  },

  create: async (data: Partial<Bank>) => {
    const response = await api.post('/super-admin/banks', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Bank>) => {
    const response = await api.put(`/super-admin/banks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/super-admin/banks/${id}`);
    return response.data;
  },
};

// ==================== CAR TYPES ====================

export interface CarType {
  _id: string;
  name: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const carTypesAPI = {
  getAll: async () => {
    const response = await api.get('/super-admin/car-types');
    return response.data;
  },

  create: async (data: Partial<CarType>) => {
    const response = await api.post('/super-admin/car-types', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CarType>) => {
    const response = await api.put(`/super-admin/car-types/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/super-admin/car-types/${id}`);
    return response.data;
  },
};

// ==================== FAQs ====================

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const faqsAPI = {
  getAll: async () => {
    const response = await api.get('/super-admin/faqs');
    return response.data;
  },

  create: async (data: Partial<FAQ>) => {
    const response = await api.post('/super-admin/faqs', data);
    return response.data;
  },

  update: async (id: string, data: Partial<FAQ>) => {
    const response = await api.put(`/super-admin/faqs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/super-admin/faqs/${id}`);
    return response.data;
  },
};

// ==================== PROFILE ====================

export const profileAPI = {
  updateNotificationSettings: async (settings: {
    newRequests?: boolean;
    reminders?: boolean;
    policyAndCommunity?: boolean;
    accountSupport?: boolean;
  }) => {
    const response = await api.put('/super-admin/profile/notification-settings', settings);
    return response.data;
  },

  updateGlobalPreferences: async (preferences: {
    language?: string;
    currency?: string;
    timezone?: string;
    country?: string;
  }) => {
    const response = await api.put('/super-admin/profile/global-preferences', preferences);
    return response.data;
  },
};

// ==================== BANK LOANS ====================

export interface BankLoan {
  _id: string;
  loanNumber: string;
  customer: {
    _id: string;
    name: string;
    email?: string;
    phone: string;
    nationalId?: string;
  };
  vehicle: {
    _id: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
    mileage?: number;
    exteriorColor?: string;
    pricing?: {
      listPrice?: number;
      salePrice?: number;
    };
  };
  bank: {
    _id: string;
    name: string;
    code?: string;
  };
  dealership?: {
    _id: string;
    name: string;
  };
  loanAmount?: number;
  downPayment?: number;
  interestRate?: number;
  tenure?: number;
  monthlyPayment?: number;
  status: 'pending' | 'approved' | 'rejected' | 'closed' | 'cancelled';
  currentPhaseType?: string;
  phases?: Array<{
    type: string;
    status: string;
    startedAt?: string;
    completedAt?: string;
    data?: any;
  }>;
  applicationDate: string;
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankLoanFilters {
  status?: string;
  bank?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const bankLoansAPI = {
  getAll: async (filters?: BankLoanFilters) => {
    const response = await api.get('/super-admin/bank-loans', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/super-admin/bank-loans/${id}`);
    return response.data;
  },
};

export default api;
