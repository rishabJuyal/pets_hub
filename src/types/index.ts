export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string; // 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other'
  breed: string;
  ageYears: number;
  weightKg: number;
  medicalNotes: string;
  imageUrl?: string;
}

export interface PetService {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
  iconName: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  petId: string;
  petName: string;
  petSpecies: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
  appointmentDate: string; // 'Today', 'Tomorrow', '2026-10-25'
  appointmentTime: string; // '10:30 AM'
  status: AppointmentStatus;
  notes: string;
  adminNotes?: string;
  createdAt: string;
}

export type ProductCategory =
  | 'ALL'
  | 'FOOD_TREATS'
  | 'TOYS_PLAY'
  | 'HEALTH_WELLNESS'
  | 'GROOMING'
  | 'ACCESSORIES';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: ProductCategory;
  price: number;
  isAvailable: boolean;
  createdAt: string;
}

export type NotificationType = 'APPOINTMENT_UPDATE' | 'ANNOUNCEMENT' | 'REMINDER';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  appointmentId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  isLiveEnabled: boolean;
}
