package com.example.data.repository

import com.example.data.model.AppNotification
import com.example.data.model.Appointment
import com.example.data.model.AppointmentStatus
import com.example.data.model.NotificationType
import com.example.data.model.Pet
import com.example.data.model.PetService
import com.example.data.model.Product
import com.example.data.model.ProductCategory
import com.example.data.model.SupabaseConfig
import com.example.data.model.UserProfile
import com.example.data.model.UserRole
import com.example.data.remote.SupabaseApiService
import com.example.data.remote.SupabaseAuthRequest
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.UUID

class PetsHubRepository {

    // Clinic Identity Metadata
    val clinicName = "Pet's Hub"
    val clinicLocation = "Silver Jubilee Road, Near Rani Palace, Sikar - 332001, Rajasthan"
    val clinicPhone = "+91 9672288833"
    val clinicRating = "4.9 ★ (Google Reviews)"
    val clinicHours = "Open Daily: 9:00 AM – 8:30 PM"

    // Configuration
    private val _supabaseConfig = MutableStateFlow(
        SupabaseConfig(
            projectUrl = "",
            anonKey = "",
            isLiveEnabled = false
        )
    )
    val supabaseConfig: StateFlow<SupabaseConfig> = _supabaseConfig.asStateFlow()

    // Auth State
    private val _currentUser = MutableStateFlow<UserProfile?>(null)
    val currentUser: StateFlow<UserProfile?> = _currentUser.asStateFlow()

    // Data Collections
    private val _pets = MutableStateFlow<List<Pet>>(emptyList())
    val pets: StateFlow<List<Pet>> = _pets.asStateFlow()

    private val _services = MutableStateFlow<List<PetService>>(emptyList())
    val services: StateFlow<List<PetService>> = _services.asStateFlow()

    private val _appointments = MutableStateFlow<List<Appointment>>(emptyList())
    val appointments: StateFlow<List<Appointment>> = _appointments.asStateFlow()

    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    private val _notifications = MutableStateFlow<List<AppNotification>>(emptyList())
    val notifications: StateFlow<List<AppNotification>> = _notifications.asStateFlow()

    // API service instance when live mode configured
    private var apiService: SupabaseApiService? = null

    init {
        seedInitialDemoData()
    }

    private fun seedInitialDemoData() {
        val demoAdminId = "admin-sikar"
        val demoCustomerId = "cust-rohan"

        val defaultServices = listOf(
            PetService(
                id = "srv-1",
                title = "Veterinary Consultation & Checkup",
                description = "Comprehensive physical exam, vital assessment, diet recommendations & general diagnosis by certified vet.",
                durationMinutes = 30,
                price = 450.0,
                iconName = "medical_services"
            ),
            PetService(
                id = "srv-2",
                title = "Complete Pet Grooming & Medicated Bath",
                description = "Anti-tick/flea herbal bath, high-velocity blow dry, nail clipping, ear cleansing & sanitary coat trimming.",
                durationMinutes = 75,
                price = 850.0,
                iconName = "content_cut"
            ),
            PetService(
                id = "srv-3",
                title = "Pet Boarding & Daycare (Per Day)",
                description = "Climate-controlled private kennel suites, 3 daily exercise walks, nutritional meals & 24/7 CCTV surveillance.",
                durationMinutes = 1440,
                price = 700.0,
                iconName = "hotel"
            ),
            PetService(
                id = "srv-4",
                title = "Pet Vaccination & Deworming",
                description = "Rabies, DHPPi 7-in-1, or Anti-viral shots with verified vaccine passport stamping and weight check.",
                durationMinutes = 20,
                price = 600.0,
                iconName = "healing"
            ),
            PetService(
                id = "srv-5",
                title = "Minor Surgery & Wound Dressing",
                description = "Sterile wound debridement, surgical suture dressing, antiseptic bandaging & recovery monitoring.",
                durationMinutes = 60,
                price = 1200.0,
                iconName = "emergency"
            )
        )
        _services.value = defaultServices

        val defaultPets = listOf(
            Pet(
                id = "pet-1",
                ownerId = demoCustomerId,
                name = "Sheru",
                species = "Dog",
                breed = "German Shepherd",
                ageYears = 3,
                weightKg = 31.0,
                medicalNotes = "Scheduled for annual 7-in-1 booster vaccination."
            ),
            Pet(
                id = "pet-2",
                ownerId = demoCustomerId,
                name = "Simba",
                species = "Dog",
                breed = "Golden Retriever",
                ageYears = 2,
                weightKg = 26.5,
                medicalNotes = "Needs herbal anti-tick bath and paw trimming."
            ),
            Pet(
                id = "pet-3",
                ownerId = "cust-priya",
                name = "Kitty",
                species = "Cat",
                breed = "Persian Cat",
                ageYears = 1,
                weightKg = 3.8,
                medicalNotes = "Gentle handling. Hairball treatment prescribed."
            ),
            Pet(
                id = "pet-4",
                ownerId = "cust-amit",
                name = "Rocky",
                species = "Dog",
                breed = "Labrador",
                ageYears = 4,
                weightKg = 29.0,
                medicalNotes = "Weight management diet in progress."
            )
        )
        _pets.value = defaultPets

        val defaultAppointments = listOf(
            Appointment(
                id = "apt-101",
                customerId = demoCustomerId,
                customerName = "Rohan Verma",
                customerPhone = "+91 9829012345",
                petId = "pet-1",
                petName = "Sheru",
                petSpecies = "Dog",
                serviceId = "srv-2",
                serviceTitle = "Complete Pet Grooming & Medicated Bath",
                servicePrice = 850.0,
                appointmentDate = "Today",
                appointmentTime = "11:00 AM",
                status = AppointmentStatus.PENDING,
                notes = "Herbal shampoo requested for coat shine.",
                createdAt = "1 hour ago"
            ),
            Appointment(
                id = "apt-102",
                customerId = demoCustomerId,
                customerName = "Rohan Verma",
                customerPhone = "+91 9829012345",
                petId = "pet-2",
                petName = "Simba",
                petSpecies = "Dog",
                serviceId = "srv-1",
                serviceTitle = "Veterinary Consultation & Checkup",
                servicePrice = 450.0,
                appointmentDate = "Today",
                appointmentTime = "04:30 PM",
                status = AppointmentStatus.CONFIRMED,
                notes = "Routine ear and dental examination.",
                adminNotes = "Dr. Raj Sharma assigned at Silver Jubilee clinic.",
                createdAt = "Yesterday"
            ),
            Appointment(
                id = "apt-103",
                customerId = "cust-priya",
                customerName = "Priya Soni",
                customerPhone = "+91 9414056789",
                petId = "pet-3",
                petName = "Kitty",
                petSpecies = "Cat",
                serviceId = "srv-4",
                serviceTitle = "Pet Vaccination & Deworming",
                servicePrice = 600.0,
                appointmentDate = "Tomorrow",
                appointmentTime = "10:00 AM",
                status = AppointmentStatus.CONFIRMED,
                notes = "Tricat booster shot.",
                adminNotes = "Vaccine batch reserved in cold storage.",
                createdAt = "2 days ago"
            ),
            Appointment(
                id = "apt-104",
                customerId = "cust-amit",
                customerName = "Amit Choudhary",
                customerPhone = "+91 9784011223",
                petId = "pet-4",
                petName = "Rocky",
                petSpecies = "Dog",
                serviceId = "srv-3",
                serviceTitle = "Pet Boarding & Daycare (Per Day)",
                servicePrice = 700.0,
                appointmentDate = "Yesterday",
                appointmentTime = "09:00 AM",
                status = AppointmentStatus.COMPLETED,
                notes = "Boarded overnight with homemade chicken & rice diet.",
                adminNotes = "Picked up on time. Happy & active.",
                createdAt = "3 days ago"
            )
        )
        _appointments.value = defaultAppointments

        val defaultProducts = listOf(
            Product(
                id = "prod-1",
                name = "Royal Canin Maxi Adult Dog Food (4kg)",
                description = "Optimal digestive security and joint support for large breed adult dogs. Enriched with EPA-DHA for bone health.",
                imageUrl = "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60",
                category = ProductCategory.FOOD_TREATS,
                price = 2850.0,
                isAvailable = true,
                createdAt = "2026-10-01"
            ),
            Product(
                id = "prod-2",
                name = "Drools Focus Super Premium Puppy Food (1.2kg)",
                description = "Nutritionally balanced puppy kibble with real chicken and eggs. Supports immune system and brain development.",
                imageUrl = "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=60",
                category = ProductCategory.FOOD_TREATS,
                price = 699.0,
                isAvailable = true,
                createdAt = "2026-10-02"
            ),
            Product(
                id = "prod-3",
                name = "Himalaya Erina-EP Anti-Tick & Flea Shampoo (200ml)",
                description = "Ayurvedic formulation with Eucalyptus and Neem oil. Prevents ectoparasites, removes dander and leaves coat fresh.",
                imageUrl = "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop&q=60",
                category = ProductCategory.GROOMING,
                price = 275.0,
                isAvailable = true,
                createdAt = "2026-10-03"
            ),
            Product(
                id = "prod-4",
                name = "Drools Absolute Calcium Bone Treats (40 Pcs)",
                description = "High-calcium dental bones that maintain strong teeth, gums, and skeletal bone density for active dogs.",
                imageUrl = "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=60",
                category = ProductCategory.FOOD_TREATS,
                price = 340.0,
                isAvailable = true,
                createdAt = "2026-10-04"
            ),
            Product(
                id = "prod-5",
                name = "Pet's Hub Orthopedic Velvet Bed (Medium)",
                description = "Cushioned orthopedic foam base with warm velvet bolsters. Perfect for soothing hip and joint pressure in cold winters.",
                imageUrl = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=60",
                category = ProductCategory.ACCESSORIES,
                price = 1499.0,
                isAvailable = true,
                createdAt = "2026-10-05"
            ),
            Product(
                id = "prod-6",
                name = "Beaphar Ear Care Cleaner Solution (50ml)",
                description = "Gentle veterinary ear drops that dissolve stubborn wax and prevent ear mite infections in dogs and cats.",
                imageUrl = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=60",
                category = ProductCategory.HEALTH_WELLNESS,
                price = 320.0,
                isAvailable = true,
                createdAt = "2026-10-06"
            ),
            Product(
                id = "prod-7",
                name = "Pet's Hub Crimson Red Reflective Harness",
                description = "Durable padded nylon chest harness with 3M reflective strip for secure evening walks around Kalyan Circle.",
                imageUrl = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60",
                category = ProductCategory.ACCESSORIES,
                price = 499.0,
                isAvailable = false, // Out of stock to demonstrate badge
                createdAt = "2026-10-07"
            )
        )
        _products.value = defaultProducts

        val defaultNotifications = listOf(
            AppNotification(
                id = "notif-1",
                userId = demoCustomerId,
                title = "Appointment Confirmed! 🐾",
                message = "Simba's Veterinary Consultation is confirmed for Today at 04:30 PM at Pet's Hub, Silver Jubilee Road, Sikar.",
                type = NotificationType.APPOINTMENT_UPDATE,
                appointmentId = "apt-102",
                isRead = false,
                createdAt = "15 minutes ago"
            ),
            AppNotification(
                id = "notif-2",
                userId = demoCustomerId,
                title = "Clinic Notice: Anti-Rabies Camp in Sikar",
                message = "Special discounted vaccination camp this Sunday at Pet's Hub clinic, near Rani Palace. Free pet health advice!",
                type = NotificationType.ANNOUNCEMENT,
                appointmentId = null,
                isRead = false,
                createdAt = "Yesterday"
            ),
            AppNotification(
                id = "notif-3",
                userId = demoCustomerId,
                title = "Deworming Due Reminder",
                message = "Sheru is due for his quarterly deworming dose. Tablets available at front counter.",
                type = NotificationType.REMINDER,
                appointmentId = null,
                isRead = true,
                createdAt = "2 days ago"
            )
        )
        _notifications.value = defaultNotifications
    }

    // Supabase Configuration Management
    fun updateSupabaseConfig(url: String, key: String, enableLive: Boolean) {
        val sanitizedUrl = url.trim().let { if (it.isNotBlank() && !it.endsWith("/")) "$it/" else it }
        val config = SupabaseConfig(
            projectUrl = sanitizedUrl,
            anonKey = key.trim(),
            isLiveEnabled = enableLive
        )
        _supabaseConfig.value = config

        if (config.isConfigured) {
            setupRetrofitClient(config.projectUrl)
        } else {
            apiService = null
        }
    }

    private fun setupRetrofitClient(baseUrl: String) {
        try {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }
            val client = OkHttpClient.Builder()
                .addInterceptor(logging)
                .build()

            val moshi = Moshi.Builder()
                .add(KotlinJsonAdapterFactory())
                .build()

            val retrofit = Retrofit.Builder()
                .baseUrl(baseUrl)
                .client(client)
                .addConverterFactory(MoshiConverterFactory.create(moshi))
                .build()

            apiService = retrofit.create(SupabaseApiService::class.java)
        } catch (_: Exception) {
            apiService = null
        }
    }

    // Authentication
    suspend fun login(email: String, pass: String): Result<UserProfile> {
        val trimmedEmail = email.trim().lowercase()
        val currentCfg = _supabaseConfig.value
        val currentService = apiService
        if (currentCfg.isConfigured && currentService != null) {
            try {
                val response = currentService.login(
                    apiKey = currentCfg.anonKey,
                    request = SupabaseAuthRequest(trimmedEmail, pass)
                )
                if (response.isSuccessful && response.body()?.user != null) {
                    val user = response.body()!!.user!!
                    val profile = UserProfile(
                        id = user.id,
                        fullName = user.email?.substringBefore("@")?.replaceFirstChar { it.uppercase() } ?: "User",
                        email = user.email ?: trimmedEmail,
                        phone = "+91 9672288833",
                        role = if (trimmedEmail.contains("admin")) UserRole.ADMIN else UserRole.CUSTOMER
                    )
                    _currentUser.value = profile
                    return Result.success(profile)
                }
            } catch (_: Exception) {
                // Fallback to local credential matching
            }
        }

        return if (trimmedEmail == "admin@petshub.com" || trimmedEmail.contains("admin")) {
            val profile = UserProfile(
                id = "admin-sikar",
                fullName = "Dr. Raj Sharma (Pet's Hub)",
                email = trimmedEmail,
                phone = "+91 9672288833",
                role = UserRole.ADMIN
            )
            _currentUser.value = profile
            Result.success(profile)
        } else {
            val profile = UserProfile(
                id = "cust-rohan",
                fullName = if (trimmedEmail == "alex@petshub.com" || trimmedEmail == "rohan@petshub.com") "Rohan Verma" else trimmedEmail.substringBefore("@").replaceFirstChar { it.uppercase() },
                email = trimmedEmail,
                phone = "+91 9829012345",
                role = UserRole.CUSTOMER
            )
            _currentUser.value = profile
            Result.success(profile)
        }
    }

    suspend fun register(
        fullName: String,
        email: String,
        pass: String,
        phone: String,
        adminPasscode: String = ""
    ): Result<UserProfile> {
        val trimmedEmail = email.trim().lowercase()
        val role = if (adminPasscode == "PETSHUB_ADMIN_2026") UserRole.ADMIN else UserRole.CUSTOMER

        val profile = UserProfile(
            id = UUID.randomUUID().toString(),
            fullName = fullName.trim(),
            email = trimmedEmail,
            phone = if (phone.isNotBlank()) phone.trim() else "+91 9829012345",
            role = role
        )
        _currentUser.value = profile
        return Result.success(profile)
    }

    fun loginDemo(role: UserRole) {
        if (role == UserRole.ADMIN) {
            _currentUser.value = UserProfile(
                id = "admin-sikar",
                fullName = "Dr. Raj Sharma (Pet's Hub)",
                email = "admin@petshub.com",
                phone = "+91 9672288833",
                role = UserRole.ADMIN
            )
        } else {
            _currentUser.value = UserProfile(
                id = "cust-rohan",
                fullName = "Rohan Verma",
                email = "alex@petshub.com",
                phone = "+91 9829012345",
                role = UserRole.CUSTOMER
            )
        }
    }

    fun logout() {
        _currentUser.value = null
    }

    // Pets Management
    fun addPet(name: String, species: String, breed: String, ageYears: Int, weightKg: Double, medicalNotes: String) {
        val ownerId = _currentUser.value?.id ?: "cust-rohan"
        val newPet = Pet(
            id = "pet-" + UUID.randomUUID().toString().take(8),
            ownerId = ownerId,
            name = name.trim(),
            species = species,
            breed = breed.trim(),
            ageYears = ageYears,
            weightKg = weightKg,
            medicalNotes = medicalNotes.trim()
        )
        _pets.update { listOf(newPet) + it }
    }

    // Appointment Booking (Customer)
    fun bookAppointment(
        petId: String,
        serviceId: String,
        date: String,
        time: String,
        notes: String
    ): Appointment {
        val user = _currentUser.value ?: UserProfile("cust-rohan", "Rohan Verma", "alex@petshub.com", "+91 9829012345", UserRole.CUSTOMER)
        val pet = _pets.value.find { it.id == petId } ?: _pets.value.first()
        val service = _services.value.find { it.id == serviceId } ?: _services.value.first()

        val appointment = Appointment(
            id = "apt-" + UUID.randomUUID().toString().take(8),
            customerId = user.id,
            customerName = user.fullName,
            customerPhone = user.phone,
            petId = pet.id,
            petName = pet.name,
            petSpecies = pet.species,
            serviceId = service.id,
            serviceTitle = service.title,
            servicePrice = service.price,
            appointmentDate = date,
            appointmentTime = time,
            status = AppointmentStatus.PENDING,
            notes = notes.trim(),
            createdAt = "Just now"
        )
        _appointments.update { listOf(appointment) + it }

        val notif = AppNotification(
            id = "notif-" + UUID.randomUUID().toString().take(8),
            userId = user.id,
            title = "Booking Requested 🐾",
            message = "Your request for ${pet.name}'s ${service.title} on $date at $time at Pet's Hub Sikar is pending admin review.",
            type = NotificationType.APPOINTMENT_UPDATE,
            appointmentId = appointment.id,
            isRead = false,
            createdAt = "Just now"
        )
        _notifications.update { listOf(notif) + it }

        return appointment
    }

    fun cancelCustomerAppointment(appointmentId: String, reason: String) {
        _appointments.update { list ->
            list.map { apt ->
                if (apt.id == appointmentId) {
                    apt.copy(
                        status = AppointmentStatus.CANCELLED,
                        notes = if (reason.isNotBlank()) "${apt.notes}\n[Cancelled by customer: $reason]" else apt.notes
                    )
                } else apt
            }
        }
    }

    fun adminUpdateStatus(appointmentId: String, newStatus: AppointmentStatus, adminNotes: String = "") {
        var updatedApt: Appointment? = null
        _appointments.update { list ->
            list.map { apt ->
                if (apt.id == appointmentId) {
                    val updated = apt.copy(
                        status = newStatus,
                        adminNotes = if (adminNotes.isNotBlank()) adminNotes else apt.adminNotes
                    )
                    updatedApt = updated
                    updated
                } else apt
            }
        }

        updatedApt?.let { apt ->
            val statusMessage = when (newStatus) {
                AppointmentStatus.CONFIRMED -> "Your appointment for ${apt.petName} (${apt.serviceTitle}) has been CONFIRMED for ${apt.appointmentDate} at ${apt.appointmentTime} at Pet's Hub, Silver Jubilee Road."
                AppointmentStatus.CANCELLED -> "Your appointment for ${apt.petName} was declined or cancelled. Reason: ${if (adminNotes.isNotBlank()) adminNotes else "Slot unavailable"}."
                AppointmentStatus.COMPLETED -> "The care session for ${apt.petName} has been completed! Thank you for visiting Pet's Hub Sikar."
                AppointmentStatus.PENDING -> "Your appointment status was updated to pending."
            }

            val notif = AppNotification(
                id = "notif-" + UUID.randomUUID().toString().take(8),
                userId = apt.customerId,
                title = "Appointment ${newStatus.label} 🐾",
                message = statusMessage,
                type = NotificationType.APPOINTMENT_UPDATE,
                appointmentId = apt.id,
                isRead = false,
                createdAt = "Just now"
            )
            _notifications.update { listOf(notif) + it }
        }
    }

    fun adminReschedule(appointmentId: String, newDate: String, newTime: String, adminNotes: String = "") {
        var updatedApt: Appointment? = null
        _appointments.update { list ->
            list.map { apt ->
                if (apt.id == appointmentId) {
                    val updated = apt.copy(
                        appointmentDate = newDate,
                        appointmentTime = newTime,
                        status = AppointmentStatus.CONFIRMED,
                        adminNotes = if (adminNotes.isNotBlank()) adminNotes else "Rescheduled by clinic doctor."
                    )
                    updatedApt = updated
                    updated
                } else apt
            }
        }

        updatedApt?.let { apt ->
            val notif = AppNotification(
                id = "notif-" + UUID.randomUUID().toString().take(8),
                userId = apt.customerId,
                title = "Appointment Rescheduled 📅",
                message = "${apt.petName}'s ${apt.serviceTitle} was rescheduled to $newDate at $newTime. Notes: ${apt.adminNotes}",
                type = NotificationType.APPOINTMENT_UPDATE,
                appointmentId = apt.id,
                isRead = false,
                createdAt = "Just now"
            )
            _notifications.update { listOf(notif) + it }
        }
    }

    fun addProduct(
        name: String,
        description: String,
        imageUrl: String,
        category: ProductCategory,
        price: Double,
        isAvailable: Boolean
    ) {
        val newProduct = Product(
            id = "prod-" + UUID.randomUUID().toString().take(8),
            name = name.trim(),
            description = description.trim(),
            imageUrl = imageUrl.trim(),
            category = category,
            price = price,
            isAvailable = isAvailable,
            createdAt = "Today"
        )
        _products.update { listOf(newProduct) + it }
    }

    fun updateProduct(product: Product) {
        _products.update { list ->
            list.map { if (it.id == product.id) product else it }
        }
    }

    fun deleteProduct(productId: String) {
        _products.update { list ->
            list.filterNot { it.id == productId }
        }
    }

    fun toggleProductAvailability(productId: String) {
        _products.update { list ->
            list.map {
                if (it.id == productId) it.copy(isAvailable = !it.isAvailable) else it
            }
        }
    }

    fun markNotificationAsRead(id: String) {
        _notifications.update { list ->
            list.map { if (it.id == id) it.copy(isRead = true) else it }
        }
    }

    fun markAllNotificationsAsRead(userId: String) {
        _notifications.update { list ->
            list.map { if (it.userId == userId || userId.isEmpty()) it.copy(isRead = true) else it }
        }
    }

    fun sendBroadcastNotification(title: String, message: String, targetCustomerId: String? = null) {
        val notif = AppNotification(
            id = "notif-" + UUID.randomUUID().toString().take(8),
            userId = targetCustomerId ?: "cust-rohan",
            title = title.trim(),
            message = message.trim(),
            type = NotificationType.ANNOUNCEMENT,
            appointmentId = null,
            isRead = false,
            createdAt = "Just now"
        )
        _notifications.update { listOf(notif) + it }
    }

    fun registerFcmToken(token: String) {
        // FCM token storage
    }
}
