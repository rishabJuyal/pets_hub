import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  UserRole,
  Pet,
  PetService,
  Appointment,
  AppointmentStatus,
  Product,
  ProductCategory,
  AppNotification,
  SupabaseConfig,
} from '../types';

export const CLINIC_INFO = {
  name: "Pet's Hub",
  location: 'Silver Jubilee Road, Near Rani Palace, Sikar - 332001, Rajasthan',
  phone: '+91 9672288833',
  phoneRaw: '+919672288833',
  rating: '4.9 ★ (Google Reviews)',
  hours: 'Open Daily: 9:00 AM – 8:30 PM',
  mapsUrl:
    'https://www.google.com/maps/place/Pet\'s+Hub/@27.6142292,75.1517584,15z/data=!4m15!1m8!3m7!1s0x396ca4cb9df166cb:0x5fad2ef98e5043dd!2sPet\'s+Hub!8m2!3d27.6142105!4d75.1515899!10e5!16s%2Fg%2F11d_ytn_yl!3m5!1s0x396ca4cb9df166cb:0x5fad2ef98e5043dd!8m2!3d27.6142105!4d75.1515899!16s%2Fg%2F11d_ytn_yl!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D',
};

const INITIAL_SERVICES: PetService[] = [
  {
    id: 'srv-1',
    title: 'Veterinary Consultation & Checkup',
    description: 'Comprehensive physical exam, vital assessment, diet recommendations & general diagnosis by certified vet.',
    durationMinutes: 30,
    price: 450,
    iconName: 'medical',
  },
  {
    id: 'srv-2',
    title: 'Complete Pet Grooming & Medicated Bath',
    description: 'Anti-tick/flea herbal bath, high-velocity blow dry, nail clipping, ear cleansing & sanitary coat trimming.',
    durationMinutes: 75,
    price: 850,
    iconName: 'cut',
  },
  {
    id: 'srv-3',
    title: 'Pet Boarding & Daycare (Per Day)',
    description: 'Climate-controlled private kennel suites, 3 daily exercise walks, nutritional meals & 24/7 CCTV surveillance.',
    durationMinutes: 1440,
    price: 700,
    iconName: 'home',
  },
  {
    id: 'srv-4',
    title: 'Pet Vaccination & Deworming',
    description: 'Rabies, DHPPi 7-in-1, or Anti-viral shots with verified vaccine passport stamping and weight check.',
    durationMinutes: 20,
    price: 600,
    iconName: 'medkit',
  },
  {
    id: 'srv-5',
    title: 'Minor Surgery & Wound Dressing',
    description: 'Sterile wound debridement, surgical suture dressing, antiseptic bandaging & recovery monitoring.',
    durationMinutes: 60,
    price: 1200,
    iconName: 'bandage',
  },
];

const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    ownerId: 'cust-rohan',
    name: 'Sheru',
    species: 'Dog',
    breed: 'German Shepherd',
    ageYears: 3,
    weightKg: 31.0,
    medicalNotes: 'Scheduled for annual 7-in-1 booster vaccination.',
  },
  {
    id: 'pet-2',
    ownerId: 'cust-rohan',
    name: 'Simba',
    species: 'Dog',
    breed: 'Golden Retriever',
    ageYears: 2,
    weightKg: 26.5,
    medicalNotes: 'Needs herbal anti-tick bath and paw trimming.',
  },
  {
    id: 'pet-3',
    ownerId: 'cust-priya',
    name: 'Kitty',
    species: 'Cat',
    breed: 'Persian Cat',
    ageYears: 1,
    weightKg: 3.8,
    medicalNotes: 'Gentle handling. Hairball treatment prescribed.',
  },
  {
    id: 'pet-4',
    ownerId: 'cust-amit',
    name: 'Rocky',
    species: 'Dog',
    breed: 'Labrador',
    ageYears: 4,
    weightKg: 29.0,
    medicalNotes: 'Weight management diet in progress.',
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    customerId: 'cust-rohan',
    customerName: 'Rohan Verma',
    customerPhone: '+91 9829012345',
    petId: 'pet-1',
    petName: 'Sheru',
    petSpecies: 'Dog',
    serviceId: 'srv-2',
    serviceTitle: 'Complete Pet Grooming & Medicated Bath',
    servicePrice: 850,
    appointmentDate: 'Today',
    appointmentTime: '11:00 AM',
    status: 'PENDING',
    notes: 'Herbal shampoo requested for coat shine.',
    createdAt: '1 hour ago',
  },
  {
    id: 'apt-102',
    customerId: 'cust-rohan',
    customerName: 'Rohan Verma',
    customerPhone: '+91 9829012345',
    petId: 'pet-2',
    petName: 'Simba',
    petSpecies: 'Dog',
    serviceId: 'srv-1',
    serviceTitle: 'Veterinary Consultation & Checkup',
    servicePrice: 450,
    appointmentDate: 'Today',
    appointmentTime: '04:30 PM',
    status: 'CONFIRMED',
    notes: 'Routine ear and dental examination.',
    adminNotes: 'Dr. Raj Sharma assigned at Silver Jubilee clinic.',
    createdAt: 'Yesterday',
  },
  {
    id: 'apt-103',
    customerId: 'cust-priya',
    customerName: 'Priya Soni',
    customerPhone: '+91 9414056789',
    petId: 'pet-3',
    petName: 'Kitty',
    petSpecies: 'Cat',
    serviceId: 'srv-4',
    serviceTitle: 'Pet Vaccination & Deworming',
    servicePrice: 600,
    appointmentDate: 'Tomorrow',
    appointmentTime: '10:00 AM',
    status: 'CONFIRMED',
    notes: 'Tricat booster shot.',
    adminNotes: 'Vaccine batch reserved in cold storage.',
    createdAt: '2 days ago',
  },
  {
    id: 'apt-104',
    customerId: 'cust-amit',
    customerName: 'Amit Choudhary',
    customerPhone: '+91 9784011223',
    petId: 'pet-4',
    petName: 'Rocky',
    petSpecies: 'Dog',
    serviceId: 'srv-3',
    serviceTitle: 'Pet Boarding & Daycare (Per Day)',
    servicePrice: 700,
    appointmentDate: 'Yesterday',
    appointmentTime: '09:00 AM',
    status: 'COMPLETED',
    notes: 'Boarded overnight with homemade chicken & rice diet.',
    adminNotes: 'Picked up on time. Happy & active.',
    createdAt: '3 days ago',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Royal Canin Maxi Adult Dog Food (1kg)',
    description: 'Optimal digestive security and joint support for large breed adult dogs. Enriched with EPA-DHA for bone health.',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80',
    category: 'FOOD_TREATS',
    price: 2850,
    isAvailable: true,
    createdAt: '2026-10-01',
  },
  {
    id: 'prod-2',
    name: 'Whiskas Adult Cat Food (1.2kg)',
    description: 'Nutritionally balanced adult cat food formulated with real fish, vitamins and zinc for shiny coat and vitality.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop&q=80',
    category: 'FOOD_TREATS',
    price: 699,
    isAvailable: true,
    createdAt: '2026-10-02',
  },
  {
    id: 'prod-3',
    name: 'Pedigree Puppy Food (1kg)',
    description: 'Complete and balanced meal for growing puppies. Contains calcium and phosphorus to strengthen bones and teeth.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=80',
    category: 'FOOD_TREATS',
    price: 499,
    isAvailable: false,
    createdAt: '2026-10-03',
  },
  {
    id: 'prod-4',
    name: 'Dog Chew Rope Toy',
    description: 'Durable multi-color cotton braided rope toy with knot ball. Perfect for teething, tug-of-war and dental cleaning.',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80',
    category: 'TOYS_PLAY',
    price: 250,
    isAvailable: true,
    createdAt: '2026-10-04',
  },
  {
    id: 'prod-5',
    name: "Pet's Hub Orthopedic Velvet Bed (Medium)",
    description: 'Cushioned orthopedic foam base with warm velvet bolsters. Perfect for soothing hip and joint pressure in cold winters.',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80',
    category: 'ACCESSORIES',
    price: 1499,
    isAvailable: true,
    createdAt: '2026-10-05',
  },
  {
    id: 'prod-6',
    name: 'Beaphar Ear Care Cleaner Solution (50ml)',
    description: 'Gentle veterinary ear drops that dissolve stubborn wax and prevent ear mite infections in dogs and cats.',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=60',
    category: 'HEALTH_WELLNESS',
    price: 320,
    isAvailable: true,
    createdAt: '2026-10-06',
  },
  {
    id: 'prod-7',
    name: "Pet's Hub Crimson Red Reflective Harness",
    description: 'Durable padded nylon chest harness with 3M reflective strip for secure evening walks around Kalyan Circle.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60',
    category: 'ACCESSORIES',
    price: 499,
    isAvailable: false,
    createdAt: '2026-10-07',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'cust-rohan',
    title: 'Appointment Confirmed! 🐾',
    message: "Simba's Veterinary Consultation is confirmed for Today at 04:30 PM at Pet's Hub, Silver Jubilee Road, Sikar.",
    type: 'APPOINTMENT_UPDATE',
    appointmentId: 'apt-102',
    isRead: false,
    createdAt: '15 minutes ago',
  },
  {
    id: 'notif-2',
    userId: 'cust-rohan',
    title: 'Clinic Notice: Anti-Rabies Camp in Sikar',
    message: "Special discounted vaccination camp this Sunday at Pet's Hub clinic, near Rani Palace. Free pet health advice!",
    type: 'ANNOUNCEMENT',
    appointmentId: null,
    isRead: false,
    createdAt: 'Yesterday',
  },
  {
    id: 'notif-3',
    userId: 'cust-rohan',
    title: 'Deworming Due Reminder',
    message: 'Sheru is due for his quarterly deworming dose. Tablets available at front counter.',
    type: 'REMINDER',
    appointmentId: null,
    isRead: true,
    createdAt: '2 days ago',
  },
];

interface PetsHubContextType {
  currentUser: UserProfile | null;
  supabaseConfig: SupabaseConfig;
  pets: Pet[];
  customerPets: Pet[];
  services: PetService[];
  appointments: Appointment[];
  customerAppointments: Appointment[];
  products: Product[];
  notifications: AppNotification[];
  customerNotifications: AppNotification[];
  unreadNotificationCount: number;
  adminPendingCount: number;
  adminTodayCount: number;
  adminConfirmedCount: number;
  adminTotalCustomers: number;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, pass: string, phone: string, adminPasscode?: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: (role: UserRole) => void;
  logout: () => void;
  addPet: (name: string, species: string, breed: string, ageYears: number, weightKg: number, medicalNotes: string) => Pet;
  bookAppointment: (petId: string, serviceId: string, date: string, time: string, notes: string) => Appointment;
  cancelCustomerAppointment: (appointmentId: string, reason?: string) => void;
  adminApproveAppointment: (appointmentId: string) => void;
  adminRejectAppointment: (appointmentId: string, reason: string) => void;
  adminRescheduleAppointment: (appointmentId: string, newDate: string, newTime: string, adminNotes?: string) => void;
  adminCompleteAppointment: (appointmentId: string) => void;
  addProduct: (name: string, description: string, imageUrl: string, category: ProductCategory, price: number, isAvailable: boolean) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendBroadcastNotification: (title: string, message: string, targetCustomerId?: string) => void;
  updateSupabaseConfig: (url: string, key: string, isLiveEnabled: boolean) => void;
}

const PetsHubContext = createContext<PetsHubContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = '@petshub_';

export const PetsHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [services] = useState<PetService[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    projectUrl: '',
    anonKey: '',
    isLiveEnabled: false,
  });

  // Load persisted state on startup
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const [savedUser, savedPets, savedApts, savedProducts, savedNotifs, savedConfig] = await Promise.all([
          AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}user`),
          AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}pets`),
          AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}apts`),
          AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}products`),
          AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}notifs`),
          AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}config`),
        ]);

        if (savedUser) setCurrentUser(JSON.parse(savedUser));
        if (savedPets) setPets(JSON.parse(savedPets));
        if (savedApts) setAppointments(JSON.parse(savedApts));
        if (savedProducts) setProducts(JSON.parse(savedProducts));
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
        if (savedConfig) setSupabaseConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.warn('Failed to load storage state:', e);
      }
    };
    loadSavedState();
  }, []);

  // Save changes to AsyncStorage
  const saveItem = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed for:', key, e);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pass) {
      return { success: false, error: 'Please enter both email and password' };
    }

    if (trimmedEmail.includes('admin') || trimmedEmail === 'admin@petshub.com') {
      const adminUser: UserProfile = {
        id: 'admin-sikar',
        fullName: "Dr. Raj Sharma (Pet's Hub)",
        email: trimmedEmail,
        phone: '+91 9672288833',
        role: 'ADMIN',
      };
      setCurrentUser(adminUser);
      saveItem('user', adminUser);
      return { success: true };
    } else {
      const customerUser: UserProfile = {
        id: 'cust-rohan',
        fullName: trimmedEmail.startsWith('alex') || trimmedEmail.startsWith('rohan') ? 'Rohan Verma' : trimmedEmail.split('@')[0],
        email: trimmedEmail,
        phone: '+91 9829012345',
        role: 'CUSTOMER',
      };
      setCurrentUser(customerUser);
      saveItem('user', customerUser);
      return { success: true };
    }
  };

  const register = async (
    fullName: string,
    email: string,
    pass: string,
    phone: string,
    adminPasscode: string = ''
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!fullName.trim() || !trimmedEmail || !pass) {
      return { success: false, error: 'Please fill in all required fields' };
    }

    const role: UserRole = adminPasscode.trim() === 'PETSHUB_ADMIN_2026' ? 'ADMIN' : 'CUSTOMER';
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: fullName.trim(),
      email: trimmedEmail,
      phone: phone.trim() || '+91 9829012345',
      role,
    };

    setCurrentUser(newUser);
    saveItem('user', newUser);
    return { success: true };
  };

  const loginDemo = (role: UserRole) => {
    if (role === 'ADMIN') {
      const admin: UserProfile = {
        id: 'admin-sikar',
        fullName: "Dr. Raj Sharma (Pet's Hub)",
        email: 'admin@petshub.com',
        phone: '+91 9672288833',
        role: 'ADMIN',
      };
      setCurrentUser(admin);
      saveItem('user', admin);
    } else {
      const customer: UserProfile = {
        id: 'cust-rohan',
        fullName: 'Rohan Verma',
        email: 'alex@petshub.com',
        phone: '+91 9829012345',
        role: 'CUSTOMER',
      };
      setCurrentUser(customer);
      saveItem('user', customer);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}user`).catch(() => {});
  };

  const addPet = (
    name: string,
    species: string,
    breed: string,
    ageYears: number,
    weightKg: number,
    medicalNotes: string
  ): Pet => {
    const newPet: Pet = {
      id: `pet-${Date.now().toString(36)}`,
      ownerId: currentUser?.id || 'cust-rohan',
      name: name.trim(),
      species,
      breed: breed.trim(),
      ageYears,
      weightKg,
      medicalNotes: medicalNotes.trim(),
    };
    const updated = [newPet, ...pets];
    setPets(updated);
    saveItem('pets', updated);
    return newPet;
  };

  const bookAppointment = (
    petId: string,
    serviceId: string,
    date: string,
    time: string,
    notes: string
  ): Appointment => {
    const pet = pets.find((p) => p.id === petId) || pets[0];
    const service = services.find((s) => s.id === serviceId) || services[0];
    const user = currentUser || {
      id: 'cust-rohan',
      fullName: 'Rohan Verma',
      email: 'alex@petshub.com',
      phone: '+91 9829012345',
      role: 'CUSTOMER' as UserRole,
    };

    const newApt: Appointment = {
      id: `apt-${Date.now().toString(36)}`,
      customerId: user.id,
      customerName: user.fullName,
      customerPhone: user.phone,
      petId: pet.id,
      petName: pet.name,
      petSpecies: pet.species,
      serviceId: service.id,
      serviceTitle: service.title,
      servicePrice: service.price,
      appointmentDate: date,
      appointmentTime: time,
      status: 'PENDING',
      notes: notes.trim(),
      createdAt: 'Just now',
    };

    const updatedApts = [newApt, ...appointments];
    setAppointments(updatedApts);
    saveItem('apts', updatedApts);

    // Create booking requested notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now().toString(36)}`,
      userId: user.id,
      title: 'Booking Requested 🐾',
      message: `Your request for ${pet.name}'s ${service.title} on ${date} at ${time} at Pet's Hub Sikar is pending admin review.`,
      type: 'APPOINTMENT_UPDATE',
      appointmentId: newApt.id,
      isRead: false,
      createdAt: 'Just now',
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveItem('notifs', updatedNotifs);

    return newApt;
  };

  const cancelCustomerAppointment = (appointmentId: string, reason?: string) => {
    const updated = appointments.map((apt) =>
      apt.id === appointmentId
        ? {
            ...apt,
            status: 'CANCELLED' as AppointmentStatus,
            notes: reason ? `${apt.notes}\n[Cancelled by customer: ${reason}]` : apt.notes,
          }
        : apt
    );
    setAppointments(updated);
    saveItem('apts', updated);
  };

  const adminApproveAppointment = (appointmentId: string) => {
    let approvedApt: Appointment | null = null;
    const updated = appointments.map((apt) => {
      if (apt.id === appointmentId) {
        approvedApt = { ...apt, status: 'CONFIRMED' as AppointmentStatus };
        return approvedApt;
      }
      return apt;
    });
    setAppointments(updated);
    saveItem('apts', updated);

    if (approvedApt) {
      const apt = approvedApt as Appointment;
      const notif: AppNotification = {
        id: `notif-${Date.now().toString(36)}`,
        userId: apt.customerId,
        title: 'Appointment Confirmed! 🐾',
        message: `Your appointment for ${apt.petName} (${apt.serviceTitle}) has been CONFIRMED for ${apt.appointmentDate} at ${apt.appointmentTime} at Pet's Hub, Silver Jubilee Road, Sikar.`,
        type: 'APPOINTMENT_UPDATE',
        appointmentId: apt.id,
        isRead: false,
        createdAt: 'Just now',
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      saveItem('notifs', updatedNotifs);
    }
  };

  const adminRejectAppointment = (appointmentId: string, reason: string) => {
    let rejectedApt: Appointment | null = null;
    const updated = appointments.map((apt) => {
      if (apt.id === appointmentId) {
        rejectedApt = {
          ...apt,
          status: 'CANCELLED' as AppointmentStatus,
          adminNotes: reason || 'Declined by clinic doctor.',
        };
        return rejectedApt;
      }
      return apt;
    });
    setAppointments(updated);
    saveItem('apts', updated);

    if (rejectedApt) {
      const apt = rejectedApt as Appointment;
      const notif: AppNotification = {
        id: `notif-${Date.now().toString(36)}`,
        userId: apt.customerId,
        title: 'Appointment Declined ❌',
        message: `Your booking for ${apt.petName} was declined. Reason: ${reason || 'Clinic slot unavailable'}.`,
        type: 'APPOINTMENT_UPDATE',
        appointmentId: apt.id,
        isRead: false,
        createdAt: 'Just now',
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      saveItem('notifs', updatedNotifs);
    }
  };

  const adminRescheduleAppointment = (
    appointmentId: string,
    newDate: string,
    newTime: string,
    adminNotes?: string
  ) => {
    let rescheduledApt: Appointment | null = null;
    const updated = appointments.map((apt) => {
      if (apt.id === appointmentId) {
        rescheduledApt = {
          ...apt,
          appointmentDate: newDate,
          appointmentTime: newTime,
          status: 'CONFIRMED' as AppointmentStatus,
          adminNotes: adminNotes || 'Rescheduled by clinic staff.',
        };
        return rescheduledApt;
      }
      return apt;
    });
    setAppointments(updated);
    saveItem('apts', updated);

    if (rescheduledApt) {
      const apt = rescheduledApt as Appointment;
      const notif: AppNotification = {
        id: `notif-${Date.now().toString(36)}`,
        userId: apt.customerId,
        title: 'Appointment Rescheduled 📅',
        message: `${apt.petName}'s ${apt.serviceTitle} was rescheduled to ${newDate} at ${newTime}. Notes: ${apt.adminNotes}`,
        type: 'APPOINTMENT_UPDATE',
        appointmentId: apt.id,
        isRead: false,
        createdAt: 'Just now',
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      saveItem('notifs', updatedNotifs);
    }
  };

  const adminCompleteAppointment = (appointmentId: string) => {
    let completedApt: Appointment | null = null;
    const updated = appointments.map((apt) => {
      if (apt.id === appointmentId) {
        completedApt = { ...apt, status: 'COMPLETED' as AppointmentStatus };
        return completedApt;
      }
      return apt;
    });
    setAppointments(updated);
    saveItem('apts', updated);

    if (completedApt) {
      const apt = completedApt as Appointment;
      const notif: AppNotification = {
        id: `notif-${Date.now().toString(36)}`,
        userId: apt.customerId,
        title: 'Care Session Completed! ✨',
        message: `The care session for ${apt.petName} has been successfully completed! Thank you for visiting Pet's Hub Sikar.`,
        type: 'APPOINTMENT_UPDATE',
        appointmentId: apt.id,
        isRead: false,
        createdAt: 'Just now',
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      saveItem('notifs', updatedNotifs);
    }
  };

  const addProduct = (
    name: string,
    description: string,
    imageUrl: string,
    category: ProductCategory,
    price: number,
    isAvailable: boolean
  ): Product => {
    const newProd: Product = {
      id: `prod-${Date.now().toString(36)}`,
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60',
      category,
      price,
      isAvailable,
      createdAt: 'Today',
    };
    const updated = [newProd, ...products];
    setProducts(updated);
    saveItem('products', updated);
    return newProd;
  };

  const updateProduct = (product: Product) => {
    const updated = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updated);
    saveItem('products', updated);
  };

  const deleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveItem('products', updated);
  };

  const toggleProductAvailability = (productId: string) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p));
    setProducts(updated);
    saveItem('products', updated);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveItem('notifs', updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveItem('notifs', updated);
  };

  const sendBroadcastNotification = (title: string, message: string, targetCustomerId?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now().toString(36)}`,
      userId: targetCustomerId || 'cust-rohan',
      title: title.trim(),
      message: message.trim(),
      type: 'ANNOUNCEMENT',
      appointmentId: null,
      isRead: false,
      createdAt: 'Just now',
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    saveItem('notifs', updated);
  };

  const updateSupabaseConfig = (url: string, key: string, isLiveEnabled: boolean) => {
    const config: SupabaseConfig = {
      projectUrl: url.trim(),
      anonKey: key.trim(),
      isLiveEnabled,
    };
    setSupabaseConfig(config);
    saveItem('config', config);
  };

  // Derived queries
  const customerPets = pets.filter((p) => p.ownerId === (currentUser?.id || 'cust-rohan'));
  const customerAppointments = appointments.filter((a) => a.customerId === (currentUser?.id || 'cust-rohan'));
  const customerNotifications = notifications.filter((n) => n.userId === (currentUser?.id || 'cust-rohan'));
  const unreadNotificationCount = notifications.filter((n) => !n.isRead && (currentUser?.role === 'ADMIN' || n.userId === currentUser?.id)).length;

  const adminPendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const adminTodayCount = appointments.filter((a) => a.appointmentDate.toLowerCase() === 'today').length;
  const adminConfirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const adminTotalCustomers = new Set(appointments.map((a) => a.customerId)).size + 2;

  return (
    <PetsHubContext.Provider
      value={{
        currentUser,
        supabaseConfig,
        pets,
        customerPets,
        services,
        appointments,
        customerAppointments,
        products,
        notifications,
        customerNotifications,
        unreadNotificationCount,
        adminPendingCount,
        adminTodayCount,
        adminConfirmedCount,
        adminTotalCustomers,
        login,
        register,
        loginDemo,
        logout,
        addPet,
        bookAppointment,
        cancelCustomerAppointment,
        adminApproveAppointment,
        adminRejectAppointment,
        adminRescheduleAppointment,
        adminCompleteAppointment,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendBroadcastNotification,
        updateSupabaseConfig,
      }}
    >
      {children}
    </PetsHubContext.Provider>
  );
};

export const usePetsHub = (): PetsHubContextType => {
  const context = useContext(PetsHubContext);
  if (!context) {
    throw new Error('usePetsHub must be used within a PetsHubProvider');
  }
  return context;
};
