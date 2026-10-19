package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.model.Appointment
import com.example.data.model.AppointmentStatus
import com.example.ui.theme.CrimsonRedContainer
import com.example.ui.theme.CrimsonRedPrimary
import com.example.ui.theme.LightNeutralBorder
import com.example.ui.theme.RubyAccent

@Composable
fun AddPetDialog(
    onDismiss: () -> Unit,
    onSave: (name: String, species: String, breed: String, ageYears: Int, weightKg: Double, medicalNotes: String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var species by remember { mutableStateOf("Dog") }
    var breed by remember { mutableStateOf("") }
    var ageText by remember { mutableStateOf("2") }
    var weightText by remember { mutableStateOf("12.5") }
    var medicalNotes by remember { mutableStateOf("") }

    val speciesOptions = listOf("Dog", "Cat", "Bird", "Rabbit", "Other")

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .clip(RoundedCornerShape(20.dp))
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, LightNeutralBorder, RoundedCornerShape(20.dp))
                .padding(20.dp)
        ) {
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Add Pet Profile 🐾",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Pet Name *") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text("Species", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    speciesOptions.forEach { opt ->
                        val isSelected = species == opt
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) CrimsonRedPrimary else MaterialTheme.colorScheme.surfaceVariant)
                                .clickable { species = opt }
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = opt,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = breed,
                    onValueChange = { breed = it },
                    label = { Text("Breed (Optional)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = ageText,
                        onValueChange = { ageText = it },
                        label = { Text("Age (Years)") },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    )
                    OutlinedTextField(
                        value = weightText,
                        onValueChange = { weightText = it },
                        label = { Text("Weight (kg)") },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = medicalNotes,
                    onValueChange = { medicalNotes = it },
                    label = { Text("Medical / Dietary / Temperament Notes") },
                    placeholder = { Text("Allergies, nervousness, vaccination status...") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    minLines = 2
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = {
                        if (name.isNotBlank()) {
                            val age = ageText.toIntOrNull() ?: 1
                            val weight = weightText.toDoubleOrNull() ?: 5.0
                            onSave(name, species, breed, age, weight, medicalNotes)
                        }
                    },
                    enabled = name.isNotBlank(),
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonRedPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Save Pet Profile")
                }
            }
        }
    }
}

@Composable
fun RescheduleDialog(
    appointment: Appointment,
    onDismiss: () -> Unit,
    onConfirm: (newDate: String, newTime: String, adminNotes: String) -> Unit
) {
    var newDate by remember { mutableStateOf("Tomorrow") }
    var newTime by remember { mutableStateOf("11:00 AM") }
    var adminNotes by remember { mutableStateOf("Rescheduled by clinic staff.") }

    val dateOptions = listOf("Today", "Tomorrow", "In 2 Days", "Next Monday")
    val timeOptions = listOf("09:00 AM", "11:00 AM", "01:30 PM", "03:30 PM", "05:00 PM")

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .clip(RoundedCornerShape(20.dp))
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, LightNeutralBorder, RoundedCornerShape(20.dp))
                .padding(20.dp)
        ) {
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Reschedule Appointment",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "For ${appointment.petName} (${appointment.serviceTitle})",
                    style = MaterialTheme.typography.bodyMedium,
                    color = CrimsonRedPrimary,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(14.dp))

                Text("Select New Date", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    dateOptions.forEach { opt ->
                        val isSelected = newDate == opt
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) CrimsonRedPrimary else MaterialTheme.colorScheme.surfaceVariant)
                                .clickable { newDate = opt }
                                .padding(horizontal = 8.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = opt,
                                fontSize = 11.sp,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text("Select New Time Slot", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    timeOptions.forEach { opt ->
                        val isSelected = newTime == opt
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) RubyAccent else MaterialTheme.colorScheme.surfaceVariant)
                                .clickable { newTime = opt }
                                .padding(horizontal = 8.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = opt,
                                fontSize = 11.sp,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = adminNotes,
                    onValueChange = { adminNotes = it },
                    label = { Text("Note for Customer") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    minLines = 2
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = { onConfirm(newDate, newTime, adminNotes) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonRedPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Confirm Reschedule & Notify")
                }
            }
        }
    }
}

@Composable
fun AppointmentDetailDialog(
    appointment: Appointment,
    isAdminView: Boolean,
    onDismiss: () -> Unit,
    onApprove: (() -> Unit)? = null,
    onReject: ((reason: String) -> Unit)? = null,
    onReschedule: (() -> Unit)? = null,
    onComplete: (() -> Unit)? = null,
    onCancel: ((reason: String) -> Unit)? = null
) {
    var rejectReason by remember { mutableStateOf("") }
    var showRejectPrompt by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .clip(RoundedCornerShape(20.dp))
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, LightNeutralBorder, RoundedCornerShape(20.dp))
                .padding(20.dp)
        ) {
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Appointment Details",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${appointment.petName} (${appointment.petSpecies})",
                        style = MaterialTheme.typography.headlineMedium,
                        color = CrimsonRedPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    StatusBadge(status = appointment.status)
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = appointment.serviceTitle,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )

                Text(
                    text = "Price: ₹${appointment.servicePrice.toInt()}",
                    fontSize = 14.sp,
                    color = CrimsonRedPrimary,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = LightNeutralBorder)
                Spacer(modifier = Modifier.height(14.dp))

                DetailRow("Date", appointment.appointmentDate)
                DetailRow("Time", appointment.appointmentTime)
                DetailRow("Customer", appointment.customerName)
                if (appointment.customerPhone.isNotBlank()) {
                    DetailRow("Phone", appointment.customerPhone)
                }

                if (appointment.notes.isNotBlank()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Customer Instructions:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    Text(appointment.notes, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                if (appointment.adminNotes.isNotBlank()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Staff / Clinic Notes:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = CrimsonRedPrimary)
                    Text(appointment.adminNotes, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                Spacer(modifier = Modifier.height(20.dp))

                if (isAdminView) {
                    if (showRejectPrompt) {
                        OutlinedTextField(
                            value = rejectReason,
                            onValueChange = { rejectReason = it },
                            label = { Text("Reason for Declining") },
                            placeholder = { Text("e.g. Fully booked slot...") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { onReject?.invoke(rejectReason) },
                                colors = ButtonDefaults.buttonColors(containerColor = CrimsonRedPrimary),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Confirm Decline")
                            }
                            OutlinedButton(onClick = { showRejectPrompt = false }, modifier = Modifier.weight(1f)) {
                                Text("Back")
                            }
                        }
                    } else {
                        if (appointment.status == AppointmentStatus.PENDING) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = { onApprove?.invoke() },
                                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonRedPrimary),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Approve")
                                }
                                OutlinedButton(
                                    onClick = { showRejectPrompt = true },
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Decline", color = CrimsonRedPrimary)
                                }
                            }
                        } else if (appointment.status == AppointmentStatus.CONFIRMED) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = { onComplete?.invoke() },
                                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonRedPrimary),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Complete")
                                }
                                OutlinedButton(
                                    onClick = { onReschedule?.invoke() },
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Reschedule")
                                }
                            }
                        }
                    }
                } else {
                    if (appointment.status == AppointmentStatus.PENDING || appointment.status == AppointmentStatus.CONFIRMED) {
                        OutlinedButton(
                            onClick = { onCancel?.invoke("Cancelled by pet owner") },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = CrimsonRedPrimary)
                        ) {
                            Text("Cancel Appointment")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(text = value, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
    }
}
