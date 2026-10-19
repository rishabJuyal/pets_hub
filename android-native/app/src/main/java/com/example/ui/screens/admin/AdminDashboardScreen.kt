package com.example.ui.screens.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.HourglassTop
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Today
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.AppointmentItemCard
import com.example.ui.components.StatCard
import com.example.ui.theme.CrimsonRedContainer
import com.example.ui.theme.CrimsonRedPrimary
import com.example.ui.theme.LightNeutralBorder
import com.example.ui.theme.RubyAccent
import com.example.ui.theme.RubyContainer
import com.example.ui.viewmodel.PetsHubViewModel

@Composable
fun AdminDashboardScreen(
    viewModel: PetsHubViewModel,
    onNavigateToAppointments: () -> Unit,
    onNavigateToProducts: () -> Unit,
    onNavigateToBroadcasts: () -> Unit,
    modifier: Modifier = Modifier
) {
    val todayCount by viewModel.adminKpiTodayCount.collectAsState()
    val pendingCount by viewModel.adminKpiPendingCount.collectAsState()
    val confirmedCount by viewModel.adminKpiConfirmedCount.collectAsState()
    val totalCustomers by viewModel.adminKpiTotalCustomers.collectAsState()
    val allAppointments by viewModel.allAppointments.collectAsState()

    val todayAppointments = allAppointments.filter { it.appointmentDate.equals("Today", ignoreCase = true) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Red Top Welcome Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(CrimsonRedPrimary)
                .padding(20.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Pet's Hub Sikar Admin 🛡️",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Silver Jubilee Road, Near Rani Palace • Clinic & Store Operations",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFFFFEBEE)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    androidx.compose.foundation.Image(
                        painter = androidx.compose.ui.res.painterResource(id = com.example.R.drawable.petshub_logo),
                        contentDescription = "Pet's Hub Official Logo",
                        modifier = Modifier
                            .width(115.dp)
                            .height(44.dp),
                        contentScale = androidx.compose.ui.layout.ContentScale.Fit
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { viewModel.showAddProductDialog.value = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = CrimsonRedPrimary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, tint = CrimsonRedPrimary, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("+ Product", fontSize = 12.sp, color = CrimsonRedPrimary, fontWeight = FontWeight.Bold)
                    }

                    OutlinedButton(
                        onClick = { viewModel.showBroadcastDialog.value = true },
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Campaign, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Broadcast Notice", fontSize = 12.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Pending Request Alert if any
        if (pendingCount > 0) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0xFFFFF3CD))
                    .border(1.dp, Color(0xFFFFEEBA), RoundedCornerShape(14.dp))
                    .clickable(onClick = onNavigateToAppointments)
                    .padding(14.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = null,
                        tint = Color(0xFF856404),
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "$pendingCount Pending Appointment Request${if (pendingCount > 1) "s" else ""}",
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF856404),
                            fontSize = 13.sp
                        )
                        Text(
                            text = "Tap to review pet medical notes, approve or reschedule.",
                            fontSize = 11.sp,
                            color = Color(0xFF856404).copy(alpha = 0.8f)
                        )
                    }
                    Text(
                        text = "Review →",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF856404)
                    )
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // 4 KPI Metrics
        Text(
            text = "Clinic Overview",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatCard(
                title = "Today's Schedule",
                value = todayCount.toString(),
                icon = Icons.Default.Today,
                iconColor = CrimsonRedPrimary,
                iconBgColor = CrimsonRedContainer,
                subtext = "Active today",
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Pending Requests",
                value = pendingCount.toString(),
                icon = Icons.Default.HourglassTop,
                iconColor = RubyAccent,
                iconBgColor = RubyContainer,
                subtext = "Needs action",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatCard(
                title = "Confirmed Bookings",
                value = confirmedCount.toString(),
                icon = Icons.Default.CheckCircle,
                iconColor = Color(0xFF2E7D32),
                iconBgColor = Color(0xFFE8F5E9),
                subtext = "Scheduled",
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Registered Owners",
                value = totalCustomers.toString(),
                icon = Icons.Default.People,
                iconColor = CrimsonRedPrimary,
                iconBgColor = CrimsonRedContainer,
                subtext = "Sikar Region",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Today's Appointments Timeline
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Today's Appointments (${todayAppointments.size})",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "View All (${allAppointments.size})",
                color = CrimsonRedPrimary,
                fontWeight = FontWeight.SemiBold,
                fontSize = 13.sp,
                modifier = Modifier
                    .clickable(onClick = onNavigateToAppointments)
                    .padding(4.dp)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (todayAppointments.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, LightNeutralBorder, RoundedCornerShape(14.dp))
                    .padding(20.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("No appointments scheduled for today.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                todayAppointments.forEach { apt ->
                    AppointmentItemCard(
                        appointment = apt,
                        isAdminView = true,
                        onClick = { viewModel.viewingAppointmentDetails.value = apt },
                        onApprove = { viewModel.adminApproveAppointment(apt.id) },
                        onReject = { viewModel.adminRejectAppointment(apt.id, "Staff declined due to capacity.") },
                        onReschedule = { viewModel.reschedulingAppointment.value = apt },
                        onComplete = { viewModel.adminCompleteAppointment(apt.id) }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}
