package com.example.data.remote

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class SupabaseAuthRequest(
    @Json(name = "email") val email: String,
    @Json(name = "password") val password: String
)

@JsonClass(generateAdapter = true)
data class SupabaseAuthResponse(
    @Json(name = "access_token") val accessToken: String? = null,
    @Json(name = "token_type") val tokenType: String? = null,
    @Json(name = "user") val user: SupabaseUserDto? = null
)

@JsonClass(generateAdapter = true)
data class SupabaseUserDto(
    @Json(name = "id") val id: String,
    @Json(name = "email") val email: String? = null
)

@JsonClass(generateAdapter = true)
data class SupabaseProfileDto(
    @Json(name = "id") val id: String,
    @Json(name = "full_name") val fullName: String,
    @Json(name = "email") val email: String,
    @Json(name = "phone") val phone: String? = "",
    @Json(name = "role") val role: String = "customer"
)

@JsonClass(generateAdapter = true)
data class SupabasePetDto(
    @Json(name = "id") val id: String? = null,
    @Json(name = "owner_id") val ownerId: String,
    @Json(name = "name") val name: String,
    @Json(name = "species") val species: String,
    @Json(name = "breed") val breed: String? = "",
    @Json(name = "age_years") val ageYears: Int = 1,
    @Json(name = "weight_kg") val weightKg: Double = 5.0,
    @Json(name = "medical_notes") val medicalNotes: String? = "",
    @Json(name = "image_url") val imageUrl: String? = ""
)

@JsonClass(generateAdapter = true)
data class SupabaseAppointmentDto(
    @Json(name = "id") val id: String? = null,
    @Json(name = "customer_id") val customerId: String,
    @Json(name = "pet_id") val petId: String,
    @Json(name = "service_id") val serviceId: String,
    @Json(name = "appointment_date") val appointmentDate: String,
    @Json(name = "appointment_time") val appointmentTime: String,
    @Json(name = "status") val status: String = "pending",
    @Json(name = "notes") val notes: String? = "",
    @Json(name = "admin_notes") val adminNotes: String? = ""
)

@JsonClass(generateAdapter = true)
data class SupabaseProductDto(
    @Json(name = "id") val id: String? = null,
    @Json(name = "name") val name: String,
    @Json(name = "description") val description: String,
    @Json(name = "image_url") val imageUrl: String? = "",
    @Json(name = "category") val category: String,
    @Json(name = "price") val price: Double,
    @Json(name = "is_available") val isAvailable: Boolean = true
)

@JsonClass(generateAdapter = true)
data class SupabaseNotificationDto(
    @Json(name = "id") val id: String? = null,
    @Json(name = "user_id") val userId: String,
    @Json(name = "title") val title: String,
    @Json(name = "message") val message: String,
    @Json(name = "type") val type: String,
    @Json(name = "appointment_id") val appointmentId: String? = null,
    @Json(name = "is_read") val isRead: Boolean = false
)

@JsonClass(generateAdapter = true)
data class SupabaseDeviceTokenDto(
    @Json(name = "user_id") val userId: String,
    @Json(name = "fcm_token") val fcmToken: String
)
