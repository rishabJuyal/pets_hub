package com.example.data.remote

import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Query

interface SupabaseApiService {

    // Auth Endpoints
    @POST("auth/v1/token?grant_type=password")
    suspend fun login(
        @Header("apikey") apiKey: String,
        @Body request: SupabaseAuthRequest
    ): Response<SupabaseAuthResponse>

    @POST("auth/v1/signup")
    suspend fun signUp(
        @Header("apikey") apiKey: String,
        @Body request: SupabaseAuthRequest
    ): Response<SupabaseAuthResponse>

    // Profiles
    @GET("rest/v1/profiles")
    suspend fun getProfile(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("id") idFilter: String, // e.g. "eq.xxxx"
        @Query("select") select: String = "*"
    ): Response<List<SupabaseProfileDto>>

    @POST("rest/v1/profiles")
    suspend fun createProfile(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Body profile: SupabaseProfileDto
    ): Response<ResponseBody>

    // Pets
    @GET("rest/v1/pets")
    suspend fun getPets(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("select") select: String = "*"
    ): Response<List<SupabasePetDto>>

    @POST("rest/v1/pets")
    suspend fun insertPet(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Body pet: SupabasePetDto
    ): Response<ResponseBody>

    // Appointments
    @GET("rest/v1/appointments")
    suspend fun getAppointments(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("select") select: String = "*"
    ): Response<List<SupabaseAppointmentDto>>

    @POST("rest/v1/appointments")
    suspend fun createAppointment(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Body appointment: SupabaseAppointmentDto
    ): Response<ResponseBody>

    @PATCH("rest/v1/appointments")
    suspend fun updateAppointment(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("id") idFilter: String,
        @Body updates: Map<String, String>
    ): Response<ResponseBody>

    // Products
    @GET("rest/v1/products")
    suspend fun getProducts(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("select") select: String = "*"
    ): Response<List<SupabaseProductDto>>

    @POST("rest/v1/products")
    suspend fun createProduct(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Body product: SupabaseProductDto
    ): Response<ResponseBody>

    @PATCH("rest/v1/products")
    suspend fun updateProduct(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("id") idFilter: String,
        @Body updates: Map<String, Any>
    ): Response<ResponseBody>

    @DELETE("rest/v1/products")
    suspend fun deleteProduct(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("id") idFilter: String
    ): Response<ResponseBody>

    // Notifications
    @GET("rest/v1/notifications")
    suspend fun getNotifications(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("select") select: String = "*"
    ): Response<List<SupabaseNotificationDto>>

    @POST("rest/v1/notifications")
    suspend fun createNotification(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Body notification: SupabaseNotificationDto
    ): Response<ResponseBody>

    @PATCH("rest/v1/notifications")
    suspend fun markNotificationRead(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Query("id") idFilter: String,
        @Body updates: Map<String, Boolean>
    ): Response<ResponseBody>

    // Device Tokens
    @POST("rest/v1/device_tokens")
    suspend fun registerDeviceToken(
        @Header("apikey") apiKey: String,
        @Header("Authorization") authHeader: String,
        @Body tokenDto: SupabaseDeviceTokenDto
    ): Response<ResponseBody>
}
