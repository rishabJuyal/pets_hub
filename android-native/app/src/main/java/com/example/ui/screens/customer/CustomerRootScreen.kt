package com.example.ui.screens.customer

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.ShoppingBag
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.sp
import com.example.data.model.UserRole
import com.example.ui.components.PetsHubTopAppBar
import com.example.ui.theme.CrimsonRedContainer
import com.example.ui.theme.CrimsonRedPrimary
import com.example.ui.viewmodel.PetsHubViewModel

@Composable
fun CustomerRootScreen(
    viewModel: PetsHubViewModel,
    modifier: Modifier = Modifier
) {
    var currentTab by remember { mutableIntStateOf(0) }

    val user by viewModel.currentUser.collectAsState()
    val unreadNotifs by viewModel.unreadNotificationCount.collectAsState()
    val supabaseConfig by viewModel.supabaseConfig.collectAsState()

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            PetsHubTopAppBar(
                userRole = UserRole.CUSTOMER,
                userName = user?.fullName,
                unreadNotificationCount = unreadNotifs,
                isSupabaseLive = supabaseConfig.isConfigured,
                onOpenSupabaseConfig = { viewModel.showSupabaseConfigDialog.value = true },
                onOpenNotifications = { currentTab = 4 },
                onLogout = { viewModel.logout() }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface,
                modifier = Modifier.windowInsetsPadding(WindowInsets.navigationBars)
            ) {
                // Home
                NavigationBarItem(
                    selected = currentTab == 0,
                    onClick = { currentTab = 0 },
                    icon = { Icon(if (currentTab == 0) Icons.Filled.Home else Icons.Outlined.Home, contentDescription = "Home") },
                    label = { Text("Home", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Book
                NavigationBarItem(
                    selected = currentTab == 1,
                    onClick = { currentTab = 1 },
                    icon = { Icon(if (currentTab == 1) Icons.Filled.CalendarMonth else Icons.Outlined.CalendarMonth, contentDescription = "Book") },
                    label = { Text("Book", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Visits
                NavigationBarItem(
                    selected = currentTab == 2,
                    onClick = { currentTab = 2 },
                    icon = { Icon(if (currentTab == 2) Icons.Filled.CalendarMonth else Icons.Outlined.CalendarMonth, contentDescription = "Appointments") },
                    label = { Text("Visits", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Shop
                NavigationBarItem(
                    selected = currentTab == 3,
                    onClick = { currentTab = 3 },
                    icon = { Icon(if (currentTab == 3) Icons.Filled.ShoppingBag else Icons.Outlined.ShoppingBag, contentDescription = "Shop") },
                    label = { Text("Shop", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Alerts
                NavigationBarItem(
                    selected = currentTab == 4,
                    onClick = { currentTab = 4 },
                    icon = {
                        BadgedBox(
                            badge = {
                                if (unreadNotifs > 0) {
                                    Badge(containerColor = CrimsonRedPrimary, contentColor = Color.White) {
                                        Text(unreadNotifs.toString())
                                    }
                                }
                            }
                        ) {
                            Icon(if (currentTab == 4) Icons.Filled.Notifications else Icons.Outlined.Notifications, contentDescription = "Alerts")
                        }
                    },
                    label = { Text("Alerts", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Profile
                NavigationBarItem(
                    selected = currentTab == 5,
                    onClick = { currentTab = 5 },
                    icon = { Icon(if (currentTab == 5) Icons.Filled.Person else Icons.Outlined.Person, contentDescription = "Profile") },
                    label = { Text("Profile", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.fillMaxSize().padding(innerPadding)) {
            when (currentTab) {
                0 -> CustomerHomeScreen(
                    viewModel = viewModel,
                    onNavigateToBook = { currentTab = 1 },
                    onNavigateToAppointments = { currentTab = 2 },
                    onNavigateToShop = { currentTab = 3 }
                )
                1 -> BookAppointmentScreen(
                    viewModel = viewModel,
                    onBookingComplete = { currentTab = 2 }
                )
                2 -> MyAppointmentsScreen(
                    viewModel = viewModel,
                    onNavigateToBook = { currentTab = 1 }
                )
                3 -> CustomerProductsScreen(viewModel = viewModel)
                4 -> CustomerNotificationsScreen(
                    viewModel = viewModel,
                    onNavigateToAppointment = { currentTab = 2 }
                )
                5 -> CustomerProfileScreen(viewModel = viewModel)
            }
        }
    }
}
