package com.example.ui.screens.admin

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.EventNote
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.outlined.Campaign
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.EventNote
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
fun AdminRootScreen(
    viewModel: PetsHubViewModel,
    modifier: Modifier = Modifier
) {
    var currentTab by remember { mutableIntStateOf(0) }

    val user by viewModel.currentUser.collectAsState()
    val unreadNotifs by viewModel.unreadNotificationCount.collectAsState()
    val pendingApts by viewModel.adminKpiPendingCount.collectAsState()
    val supabaseConfig by viewModel.supabaseConfig.collectAsState()

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            PetsHubTopAppBar(
                userRole = UserRole.ADMIN,
                userName = user?.fullName,
                unreadNotificationCount = unreadNotifs,
                isSupabaseLive = supabaseConfig.isConfigured,
                onOpenSupabaseConfig = { viewModel.showSupabaseConfigDialog.value = true },
                onOpenNotifications = { currentTab = 3 },
                onLogout = { viewModel.logout() }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface,
                modifier = Modifier.windowInsetsPadding(WindowInsets.navigationBars)
            ) {
                // Dashboard
                NavigationBarItem(
                    selected = currentTab == 0,
                    onClick = { currentTab = 0 },
                    icon = { Icon(if (currentTab == 0) Icons.Filled.Dashboard else Icons.Outlined.Dashboard, contentDescription = "Dashboard") },
                    label = { Text("Dashboard", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Appointments with pending badge
                NavigationBarItem(
                    selected = currentTab == 1,
                    onClick = { currentTab = 1 },
                    icon = {
                        BadgedBox(
                            badge = {
                                if (pendingApts > 0) {
                                    Badge(containerColor = CrimsonRedPrimary, contentColor = Color.White) {
                                        Text(pendingApts.toString())
                                    }
                                }
                            }
                        ) {
                            Icon(if (currentTab == 1) Icons.Filled.EventNote else Icons.Outlined.EventNote, contentDescription = "Appointments")
                        }
                    },
                    label = { Text("Bookings", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Products
                NavigationBarItem(
                    selected = currentTab == 2,
                    onClick = { currentTab = 2 },
                    icon = { Icon(if (currentTab == 2) Icons.Filled.ShoppingBag else Icons.Outlined.ShoppingBag, contentDescription = "Products") },
                    label = { Text("Products", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = CrimsonRedContainer,
                        selectedIconColor = CrimsonRedPrimary
                    )
                )

                // Announcements
                NavigationBarItem(
                    selected = currentTab == 3,
                    onClick = { currentTab = 3 },
                    icon = { Icon(if (currentTab == 3) Icons.Filled.Campaign else Icons.Outlined.Campaign, contentDescription = "Announcements") },
                    label = { Text("Broadcasts", fontSize = 11.sp) },
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
                0 -> AdminDashboardScreen(
                    viewModel = viewModel,
                    onNavigateToAppointments = { currentTab = 1 },
                    onNavigateToProducts = { currentTab = 2 },
                    onNavigateToBroadcasts = { currentTab = 3 }
                )
                1 -> AdminAppointmentsScreen(viewModel = viewModel)
                2 -> AdminProductsScreen(viewModel = viewModel)
                3 -> AdminNotificationsScreen(viewModel = viewModel)
            }
        }
    }
}
