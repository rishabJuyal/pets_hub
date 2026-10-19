package com.example.ui.screens.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppointmentStatus
import com.example.ui.components.AppointmentItemCard
import com.example.ui.theme.CrimsonRedPrimary
import com.example.ui.viewmodel.PetsHubViewModel

enum class AdminAppointmentTab(val label: String) {
    ALL("All"),
    PENDING("Pending"),
    CONFIRMED("Confirmed"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled")
}

@Composable
fun AdminAppointmentsScreen(
    viewModel: PetsHubViewModel,
    modifier: Modifier = Modifier
) {
    val appointments by viewModel.allAppointments.collectAsState()
    var selectedTab by remember { mutableStateOf(AdminAppointmentTab.ALL) }
    var searchQuery by remember { mutableStateOf("") }

    val filteredList = appointments.filter { apt ->
        val matchesTab = when (selectedTab) {
            AdminAppointmentTab.ALL -> true
            AdminAppointmentTab.PENDING -> apt.status == AppointmentStatus.PENDING
            AdminAppointmentTab.CONFIRMED -> apt.status == AppointmentStatus.CONFIRMED
            AdminAppointmentTab.COMPLETED -> apt.status == AppointmentStatus.COMPLETED
            AdminAppointmentTab.CANCELLED -> apt.status == AppointmentStatus.CANCELLED
        }
        val matchesSearch = searchQuery.isBlank() ||
                apt.petName.contains(searchQuery, ignoreCase = true) ||
                apt.customerName.contains(searchQuery, ignoreCase = true) ||
                apt.serviceTitle.contains(searchQuery, ignoreCase = true)
        matchesTab && matchesSearch
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
    ) {
        Text(
            text = "Clinic Bookings",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Review consultation requests, confirm slots, reschedule or mark complete",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Search Input
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search pet name, customer, service...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = CrimsonRedPrimary) },
            trailingIcon = {
                if (searchQuery.isNotBlank()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Default.Clear, contentDescription = "Clear")
                    }
                }
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Tabs
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            AdminAppointmentTab.entries.forEach { tab ->
                val isSelected = selectedTab == tab
                val count = when (tab) {
                    AdminAppointmentTab.ALL -> appointments.size
                    AdminAppointmentTab.PENDING -> appointments.count { it.status == AppointmentStatus.PENDING }
                    AdminAppointmentTab.CONFIRMED -> appointments.count { it.status == AppointmentStatus.CONFIRMED }
                    AdminAppointmentTab.COMPLETED -> appointments.count { it.status == AppointmentStatus.COMPLETED }
                    AdminAppointmentTab.CANCELLED -> appointments.count { it.status == AppointmentStatus.CANCELLED }
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (isSelected) CrimsonRedPrimary else MaterialTheme.colorScheme.surface)
                        .clickable { selectedTab = tab }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${tab.label} ($count)",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        if (filteredList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.CalendarMonth,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "No appointments matching filters.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredList) { apt ->
                    AppointmentItemCard(
                        appointment = apt,
                        isAdminView = true,
                        onClick = { viewModel.viewingAppointmentDetails.value = apt },
                        onApprove = { viewModel.adminApproveAppointment(apt.id) },
                        onReject = { viewModel.adminRejectAppointment(apt.id, "Doctor declined due to clinic emergency.") },
                        onReschedule = { viewModel.reschedulingAppointment.value = apt },
                        onComplete = { viewModel.adminCompleteAppointment(apt.id) }
                    )
                }
            }
        }
    }
}
