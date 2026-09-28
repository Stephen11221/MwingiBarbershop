export type ServiceCategory = 'cuts' | 'beards' | 'facials' | 'packages';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryTitle: string;
  durationMinutes: number;
  price: number;
  description: string;
  includes: string[];
  popular?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  bio: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'fades' | 'scissor' | 'beard' | 'facials';
  categoryLabel: string;
  barberName: string;
  image: string;
  description: string;
  productUsed: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  serviceName: string;
  barberName: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'hair' | 'beard' | 'skincare' | 'hardware';
  categoryLabel: string;
  price: number;
  size: string;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  ingredients?: string;
}

export interface Appointment {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'confirmed' | 'in-progress' | 'completed' | 'paid' | 'cancelled';
  reminderPreference: 'sms' | 'email' | 'both' | 'whatsapp';
  notes?: string;
  paymentStatus: 'unpaid' | 'paid';
  tipAmount?: number;
  totalPaid?: number;
  paymentMethod?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface ReminderLog {
  id: string;
  appointmentRef: string;
  customerName: string;
  recipient: string;
  type: 'sms' | 'email' | 'whatsapp';
  scheduledTime: string;
  sentAt?: string;
  status: 'scheduled' | 'sent';
  message: string;
}

export interface LoyaltyProfile {
  phone: string;
  customerName: string;
  points: number;
  tier: 'Silver Member' | 'Gold Prestige' | 'Obsidian Black VIP';
  visits: number;
  lifetimeSpend: number;
  nextTierProgress: number;
  availablePerks: {
    id: string;
    title: string;
    pointsCost: number;
    unlocked: boolean;
  }[];
}

export interface AdminMetrics {
  totalRevenue: number;
  serviceRevenue: number;
  productSalesRevenue: number;
  appointmentsCount: number;
  completedRate: number;
  repeatClientRate: number;
  averageTicketValue: number;
  remindersDelivered: number;
  revenueByDay: { day: string; amount: number }[];
  barberPerformance: {
    name: string;
    appointments: number;
    revenue: number;
    rating: number;
  }[];
}

// ========================
// STAFF MANAGEMENT SYSTEM
// Ready for ZKTeco Biometric API integration
// ========================

export type SalaryType = 'daily' | 'monthly';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  salaryType: SalaryType;
  salaryAmount: number; // e.g. KSh 1,000 / day or KSh 30,000 / month
  pin: string; // 4-digit PIN for clock-in/out
  fingerprint_id?: string; // biometric template / device user ID for ZKTeco integration
  active: boolean;
  avatar?: string;
  joinedDate: string;
}

export type AttendanceStatus = 'On Time' | 'Late' | 'Absent';

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  clockInTime: string; // HH:MM AM/PM
  clockOutTime?: string; // HH:MM AM/PM
  clockInIso: string;
  clockOutIso?: string;
  hoursWorked: number; // Decimal hours, e.g., 8.5
  status: AttendanceStatus;
  // Biometric device log fields for future ZKTeco sync
  device_log?: {
    device_id?: string;
    verify_type?: 'PIN' | 'FINGERPRINT' | 'FACE';
    synced?: boolean;
  };
  notes?: string;
}

export interface StaffAdvancePayment {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  amount: number;
  reason: string;
  approvedBy: string;
}

export interface StaffDayOffRequest {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // Requested day off YYYY-MM-DD
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
}

// Runtime stubs to prevent Node.js ESM loader errors if types are imported without 'type' keyword
export const Service = {};
export const Barber = {};
export const GalleryItem = {};
export const Review = {};
export const Product = {};
export const CartItem = {};
export const Order = {};
export const Appointment = {};
export const ReminderLog = {};
export const LoyaltyProfile = {};
export const AdminMetrics = {};
export const StaffMember = {};
export const AttendanceRecord = {};
export const StaffAdvancePayment = {};
export const StaffDayOffRequest = {};

