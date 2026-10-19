package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.model.AppNotification
import com.example.data.model.Appointment
import com.example.data.model.AppointmentStatus
import com.example.data.model.Pet
import com.example.data.model.PetService
import com.example.data.model.Product
import com.example.data.model.ProductCategory
import com.example.data.model.SupabaseConfig
import com.example.data.model.UserProfile
import com.example.data.model.UserRole
import com.example.data.repository.PetsHubRepository
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed class UiEvent {
    data class ShowSnackbar(val message: String) : UiEvent()
}

class PetsHubViewModel(
    private val repository: PetsHubRepository = PetsHubRepository()
) : ViewModel() {

    val currentUser: StateFlow<UserProfile?> = repository.currentUser
    val supabaseConfig: StateFlow<SupabaseConfig> = repository.supabaseConfig

    val clinicName: String = repository.clinicName
    val clinicLocation: String = repository.clinicLocation
    val clinicPhone: String = repository.clinicPhone
    val clinicRating: String = repository.clinicRating
    val clinicHours: String = repository.clinicHours

    val pets: StateFlow<List<Pet>> = repository.pets
    val services: StateFlow<List<PetService>> = repository.services
    val allAppointments: StateFlow<List<Appointment>> = repository.appointments
    val products: StateFlow<List<Product>> = repository.products
    val notifications: StateFlow<List<AppNotification>> = repository.notifications

    private val _eventFlow = MutableSharedFlow<UiEvent>()
    val eventFlow: SharedFlow<UiEvent> = _eventFlow.asSharedFlow()

    // Customer Filtered Appointments
    val customerAppointments: StateFlow<List<Appointment>> = combine(
        currentUser,
        allAppointments
    ) { user, apts ->
        if (user == null) emptyList()
        else apts.filter { it.customerId == user.id || user.role == UserRole.ADMIN }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Customer Filtered Pets
    val customerPets: StateFlow<List<Pet>> = combine(
        currentUser,
        pets
    ) { user, petList ->
        if (user == null) emptyList()
        else if (user.role == UserRole.ADMIN) petList
        else petList.filter { it.ownerId == user.id }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Unread notification count for current user
    val unreadNotificationCount: StateFlow<Int> = combine(
        currentUser,
        notifications
    ) { user, notifs ->
        if (user == null) 0
        else notifs.count { (it.userId == user.id || user.role == UserRole.ADMIN) && !it.isRead }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // Admin Dashboard KPI Stats
    val adminKpiTodayCount: StateFlow<Int> = allAppointments.combine(currentUser) { apts, _ ->
        apts.count { it.appointmentDate.equals("Today", ignoreCase = true) }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val adminKpiPendingCount: StateFlow<Int> = allAppointments.combine(currentUser) { apts, _ ->
        apts.count { it.status == AppointmentStatus.PENDING }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val adminKpiConfirmedCount: StateFlow<Int> = allAppointments.combine(currentUser) { apts, _ ->
        apts.count { it.status == AppointmentStatus.CONFIRMED }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val adminKpiTotalCustomers: StateFlow<Int> = allAppointments.combine(currentUser) { apts, _ ->
        // Distinct customers + demo customer count
        apts.map { it.customerId }.distinct().size.coerceAtLeast(18)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 18)

    // Search and filter states
    val productSearchQuery = MutableStateFlow("")
    val productCategoryFilter = MutableStateFlow(ProductCategory.ALL)

    // Filtered products
    val filteredProducts: StateFlow<List<Product>> = combine(
        products,
        productSearchQuery,
        productCategoryFilter
    ) { prods, query, category ->
        prods.filter { p ->
            val matchesCategory = category == ProductCategory.ALL || p.category == category
            val matchesQuery = query.isBlank() ||
                    p.name.contains(query, ignoreCase = true) ||
                    p.description.contains(query, ignoreCase = true)
            matchesCategory && matchesQuery
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // UI Dialog & Modal visibility states
    val showSupabaseConfigDialog = MutableStateFlow(false)
    val showAddPetDialog = MutableStateFlow(false)
    val showAddProductDialog = MutableStateFlow(false)
    val editingProduct = MutableStateFlow<Product?>(null)
    val reschedulingAppointment = MutableStateFlow<Appointment?>(null)
    val viewingAppointmentDetails = MutableStateFlow<Appointment?>(null)
    val viewingProductDetails = MutableStateFlow<Product?>(null)
    val showBroadcastDialog = MutableStateFlow(false)

    // Loading & Error States
    val isAuthLoading = MutableStateFlow(false)
    val authError = MutableStateFlow<String?>(null)

    // Auth Actions
    fun login(email: String, pass: String) {
        viewModelScope.launch {
            isAuthLoading.value = true
            authError.value = null
            val result = repository.login(email, pass)
            isAuthLoading.value = false
            result.fold(
                onSuccess = {
                    _eventFlow.emit(UiEvent.ShowSnackbar("Welcome back, ${it.fullName}!"))
                },
                onFailure = {
                    authError.value = it.message ?: "Login failed. Please check credentials."
                }
            )
        }
    }

    fun register(fullName: String, email: String, pass: String, phone: String, adminPasscode: String) {
        viewModelScope.launch {
            isAuthLoading.value = true
            authError.value = null
            val result = repository.register(fullName, email, pass, phone, adminPasscode)
            isAuthLoading.value = false
            result.fold(
                onSuccess = {
                    _eventFlow.emit(UiEvent.ShowSnackbar("Account created! Logged in as ${it.role.name.lowercase()}."))
                },
                onFailure = {
                    authError.value = it.message ?: "Registration failed."
                }
            )
        }
    }

    fun loginDemo(role: UserRole) {
        repository.loginDemo(role)
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Signed in as Demo ${if (role == UserRole.ADMIN) "Admin" else "Customer"}"))
        }
    }

    fun logout() {
        repository.logout()
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Logged out successfully."))
        }
    }

    // Config Actions
    fun updateSupabaseConfig(url: String, key: String, enableLive: Boolean) {
        repository.updateSupabaseConfig(url, key, enableLive)
        showSupabaseConfigDialog.value = false
        viewModelScope.launch {
            _eventFlow.emit(
                UiEvent.ShowSnackbar(
                    if (enableLive) "Supabase credentials updated! Live mode enabled."
                    else "Supabase configuration saved (Demo mode active)."
                )
            )
        }
    }

    // Customer Actions
    fun addPet(name: String, species: String, breed: String, ageYears: Int, weightKg: Double, medicalNotes: String) {
        repository.addPet(name, species, breed, ageYears, weightKg, medicalNotes)
        showAddPetDialog.value = false
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Pet $name added to your profile! 🐾"))
        }
    }

    fun bookAppointment(petId: String, serviceId: String, date: String, time: String, notes: String) {
        val apt = repository.bookAppointment(petId, serviceId, date, time, notes)
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Appointment requested for ${apt.petName}! Status: Pending."))
        }
    }

    fun cancelCustomerAppointment(appointmentId: String, reason: String = "") {
        repository.cancelCustomerAppointment(appointmentId, reason)
        viewingAppointmentDetails.value = null
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Appointment has been cancelled."))
        }
    }

    // Admin Actions
    fun adminApproveAppointment(appointmentId: String) {
        repository.adminUpdateStatus(appointmentId, AppointmentStatus.CONFIRMED, "Approved by admin.")
        viewingAppointmentDetails.value = null
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Appointment confirmed & customer notified!"))
        }
    }

    fun adminRejectAppointment(appointmentId: String, reason: String) {
        repository.adminUpdateStatus(appointmentId, AppointmentStatus.CANCELLED, reason)
        viewingAppointmentDetails.value = null
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Appointment declined & customer notified."))
        }
    }

    fun adminCompleteAppointment(appointmentId: String) {
        repository.adminUpdateStatus(appointmentId, AppointmentStatus.COMPLETED, "Service completed successfully.")
        viewingAppointmentDetails.value = null
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Appointment marked completed!"))
        }
    }

    fun adminReschedule(appointmentId: String, newDate: String, newTime: String, notes: String) {
        repository.adminReschedule(appointmentId, newDate, newTime, notes)
        reschedulingAppointment.value = null
        viewingAppointmentDetails.value = null
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Appointment rescheduled & customer notified."))
        }
    }

    // Product Actions
    fun addProduct(name: String, description: String, imageUrl: String, category: ProductCategory, price: Double, isAvailable: Boolean) {
        repository.addProduct(name, description, imageUrl, category, price, isAvailable)
        showAddProductDialog.value = false
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Product \"$name\" added to catalog!"))
        }
    }

    fun updateProduct(product: Product) {
        repository.updateProduct(product)
        editingProduct.value = null
        viewingProductDetails.value = null
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Product updated!"))
        }
    }

    fun deleteProduct(productId: String) {
        repository.deleteProduct(productId)
        editingProduct.value = null
        viewingProductDetails.value = null
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Product removed from catalog."))
        }
    }

    fun toggleProductAvailability(productId: String) {
        repository.toggleProductAvailability(productId)
    }

    // Notification Actions
    fun markNotificationAsRead(id: String) {
        repository.markNotificationAsRead(id)
    }

    fun markAllNotificationsAsRead() {
        val userId = currentUser.value?.id ?: ""
        repository.markAllNotificationsAsRead(userId)
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("All notifications marked as read."))
        }
    }

    fun sendBroadcastNotification(title: String, message: String) {
        repository.sendBroadcastNotification(title, message)
        showBroadcastDialog.value = false
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowSnackbar("Broadcast announcement dispatched to customers!"))
        }
    }
}
