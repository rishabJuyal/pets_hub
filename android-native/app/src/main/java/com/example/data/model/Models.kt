package com.example.data.model

enum class UserRole {
    ADMIN,
    CUSTOMER
}

data class UserProfile(
    val id: String,
    val fullName: String,
    val email: String,
    val phone: String = "",
    val role: UserRole = UserRole.CUSTOMER
)

data class Pet(
    val id: String,
    val ownerId: String,
    val name: String,
    val species: String, // Dog, Cat, Bird, Rabbit, etc.
    val breed: String = "",
    val ageYears: Int = 1,
    val weightKg: Double = 5.0,
    val medicalNotes: String = "",
    val imageUrl: String = ""
)

data class PetService(
    val id: String,
    val title: String,
    val description: String,
    val durationMinutes: Int,
    val price: Double,
    val iconName: String = "pets"
)

enum class AppointmentStatus(val label: String) {
    PENDING("Pending"),
    CONFIRMED("Confirmed"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled")
}

data class Appointment(
    val id: String,
    val customerId: String,
    val customerName: String,
    val customerPhone: String = "",
    val petId: String,
    val petName: String,
    val petSpecies: String,
    val serviceId: String,
    val serviceTitle: String,
    val servicePrice: Double,
    val appointmentDate: String, // YYYY-MM-DD
    val appointmentTime: String, // HH:MM AM/PM
    val status: AppointmentStatus = AppointmentStatus.PENDING,
    val notes: String = "",
    val adminNotes: String = "",
    val createdAt: String = ""
)

enum class ProductCategory(val displayName: String) {
    ALL("All Products"),
    FOOD_TREATS("Food & Treats"),
    TOYS_PLAY("Toys & Play"),
    HEALTH_WELLNESS("Health & Care"),
    GROOMING("Grooming"),
    ACCESSORIES("Accessories")
}

data class Product(
    val id: String,
    val name: String,
    val description: String,
    val imageUrl: String = "",
    val category: ProductCategory,
    val price: Double,
    val isAvailable: Boolean = true,
    val createdAt: String = ""
)

enum class NotificationType(val label: String) {
    APPOINTMENT_UPDATE("Appointment Update"),
    ANNOUNCEMENT("Clinic Announcement"),
    REMINDER("Care Reminder")
}

data class AppNotification(
    val id: String,
    val userId: String,
    val title: String,
    val message: String,
    val type: NotificationType,
    val appointmentId: String? = null,
    val isRead: Boolean = false,
    val createdAt: String = ""
)

data class SupabaseConfig(
    val projectUrl: String = "",
    val anonKey: String = "",
    val isLiveEnabled: Boolean = false
) {
    val isConfigured: Boolean
        get() = isLiveEnabled && projectUrl.isNotBlank() && anonKey.isNotBlank()
}
