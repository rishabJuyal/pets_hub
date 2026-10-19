package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import com.example.data.model.UserRole
import com.example.ui.components.AddEditProductDialog
import com.example.ui.components.AddPetDialog
import com.example.ui.components.AppointmentDetailDialog
import com.example.ui.components.BroadcastNotificationDialog
import com.example.ui.components.ProductDetailDialog
import com.example.ui.components.RescheduleDialog
import com.example.ui.components.SupabaseConfigDialog
import com.example.ui.screens.admin.AdminRootScreen
import com.example.ui.screens.auth.LoginScreen
import com.example.ui.screens.customer.CustomerRootScreen
import com.example.ui.theme.PetsHubTheme
import com.example.ui.viewmodel.PetsHubViewModel
import com.example.ui.viewmodel.UiEvent

class MainActivity : ComponentActivity() {

    private val viewModel: PetsHubViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            PetsHubTheme {
                PetsHubApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun PetsHubApp(viewModel: PetsHubViewModel) {
    val currentUser by viewModel.currentUser.collectAsState()
    val supabaseConfig by viewModel.supabaseConfig.collectAsState()

    val showSupabaseDialog by viewModel.showSupabaseConfigDialog.collectAsState()
    val showAddPetDialog by viewModel.showAddPetDialog.collectAsState()
    val showAddProductDialog by viewModel.showAddProductDialog.collectAsState()
    val editingProduct by viewModel.editingProduct.collectAsState()
    val reschedulingAppointment by viewModel.reschedulingAppointment.collectAsState()
    val viewingAppointmentDetails by viewModel.viewingAppointmentDetails.collectAsState()
    val viewingProductDetails by viewModel.viewingProductDetails.collectAsState()
    val showBroadcastDialog by viewModel.showBroadcastDialog.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }

    // Listen to ViewModel events (Snackbars)
    LaunchedEffect(viewModel) {
        viewModel.eventFlow.collect { event ->
            when (event) {
                is UiEvent.ShowSnackbar -> {
                    snackbarHostState.showSnackbar(event.message)
                }
            }
        }
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Main Role-Based Screen Router
            AnimatedContent(
                targetState = currentUser,
                transitionSpec = { fadeIn() togetherWith fadeOut() },
                label = "AuthRouting"
            ) { user ->
                if (user == null) {
                    LoginScreen(viewModel = viewModel)
                } else {
                    // Back handler logs out if pressed at root
                    BackHandler {
                        viewModel.logout()
                    }

                    when (user.role) {
                        UserRole.ADMIN -> AdminRootScreen(viewModel = viewModel)
                        UserRole.CUSTOMER -> CustomerRootScreen(viewModel = viewModel)
                    }
                }
            }

            // Global Dialog Overlays
            if (showSupabaseDialog) {
                SupabaseConfigDialog(
                    currentConfig = supabaseConfig,
                    onSave = { url, key, enableLive ->
                        viewModel.updateSupabaseConfig(url, key, enableLive)
                    },
                    onDismiss = { viewModel.showSupabaseConfigDialog.value = false }
                )
            }

            if (showAddPetDialog) {
                AddPetDialog(
                    onDismiss = { viewModel.showAddPetDialog.value = false },
                    onSave = { name, species, breed, age, weight, notes ->
                        viewModel.addPet(name, species, breed, age, weight, notes)
                    }
                )
            }

            if (showAddProductDialog) {
                AddEditProductDialog(
                    initialProduct = null,
                    onDismiss = { viewModel.showAddProductDialog.value = false },
                    onSave = { name, desc, img, cat, price, stock ->
                        viewModel.addProduct(name, desc, img, cat, price, stock)
                    }
                )
            }

            editingProduct?.let { prod ->
                AddEditProductDialog(
                    initialProduct = prod,
                    onDismiss = { viewModel.editingProduct.value = null },
                    onSave = { name, desc, img, cat, price, stock ->
                        viewModel.updateProduct(
                            prod.copy(
                                name = name,
                                description = desc,
                                imageUrl = img,
                                category = cat,
                                price = price,
                                isAvailable = stock
                            )
                        )
                    }
                )
            }

            reschedulingAppointment?.let { apt ->
                RescheduleDialog(
                    appointment = apt,
                    onDismiss = { viewModel.reschedulingAppointment.value = null },
                    onConfirm = { newDate, newTime, adminNotes ->
                        viewModel.adminReschedule(apt.id, newDate, newTime, adminNotes)
                    }
                )
            }

            viewingAppointmentDetails?.let { apt ->
                AppointmentDetailDialog(
                    appointment = apt,
                    isAdminView = currentUser?.role == UserRole.ADMIN,
                    onDismiss = { viewModel.viewingAppointmentDetails.value = null },
                    onApprove = { viewModel.adminApproveAppointment(apt.id) },
                    onReject = { reason -> viewModel.adminRejectAppointment(apt.id, reason) },
                    onReschedule = {
                        viewModel.viewingAppointmentDetails.value = null
                        viewModel.reschedulingAppointment.value = apt
                    },
                    onComplete = { viewModel.adminCompleteAppointment(apt.id) },
                    onCancel = { reason -> viewModel.cancelCustomerAppointment(apt.id, reason) }
                )
            }

            viewingProductDetails?.let { prod ->
                ProductDetailDialog(
                    product = prod,
                    isAdminView = currentUser?.role == UserRole.ADMIN,
                    onDismiss = { viewModel.viewingProductDetails.value = null },
                    onEdit = {
                        viewModel.viewingProductDetails.value = null
                        viewModel.editingProduct.value = prod
                    },
                    onDelete = {
                        viewModel.deleteProduct(prod.id)
                    }
                )
            }

            if (showBroadcastDialog) {
                BroadcastNotificationDialog(
                    onDismiss = { viewModel.showBroadcastDialog.value = false },
                    onSend = { title, message ->
                        viewModel.sendBroadcastNotification(title, message)
                    }
                )
            }
        }
    }
}
