package com.example.ui.screens.customer

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
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
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
import com.example.data.model.Pet
import com.example.data.model.PetService
import com.example.ui.theme.CrimsonRedContainer
import com.example.ui.theme.CrimsonRedPrimary
import com.example.ui.theme.LightNeutralBorder
import com.example.ui.theme.RubyAccent
import com.example.ui.viewmodel.PetsHubViewModel

@Composable
fun BookAppointmentScreen(
    viewModel: PetsHubViewModel,
    onBookingComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    val pets by viewModel.customerPets.collectAsState()
    val services by viewModel.services.collectAsState()

    var selectedPetId by remember(pets) { mutableStateOf(pets.firstOrNull()?.id ?: "") }
    var selectedServiceId by remember(services) { mutableStateOf(services.firstOrNull()?.id ?: "") }
    var selectedDate by remember { mutableStateOf("Tomorrow") }
    var selectedTime by remember { mutableStateOf("10:30 AM") }
    var notes by remember { mutableStateOf("") }

    val dateOptions = listOf("Today", "Tomorrow", "In 2 Days", "Saturday", "Sunday")
    val timeOptions = listOf("09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM", "04:30 PM", "06:00 PM")

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "Book Care Appointment",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Pet's Hub Sikar • Silver Jubilee Road, Near Rani Palace",
            style = MaterialTheme.typography.bodyMedium,
            color = CrimsonRedPrimary,
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Step 1: Select Pet
        Text(
            text = "1. Choose Your Pet *",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = CrimsonRedPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (pets.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, LightNeutralBorder, RoundedCornerShape(12.dp))
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("No pets added yet.", fontSize = 13.sp)
                    Button(
                        onClick = { viewModel.showAddPetDialog.value = true },
                        colors = ButtonDefaults.buttonColors(containerColor = CrimsonRedPrimary)
                    ) {
                        Text("+ Add Pet")
                    }
                }
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                pets.forEach { pet ->
                    val isSelected = pet.id == selectedPetId
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(if (isSelected) CrimsonRedContainer.copy(alpha = 0.5f) else MaterialTheme.colorScheme.surface)
                            .border(
                                width = if (isSelected) 2.dp else 1.dp,
                                color = if (isSelected) CrimsonRedPrimary else LightNeutralBorder,
                                shape = RoundedCornerShape(14.dp)
                            )
                            .clickable { selectedPetId = pet.id }
                            .padding(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(CrimsonRedContainer),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Pets, contentDescription = null, tint = CrimsonRedPrimary, modifier = Modifier.size(20.dp))
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(text = pet.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(text = "${pet.species} • ${pet.breed}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                            if (isSelected) {
                                Icon(Icons.Default.Check, contentDescription = "Selected", tint = CrimsonRedPrimary)
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Step 2: Select Service
        Text(
            text = "2. Select Service *",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = CrimsonRedPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            services.forEach { srv ->
                val isSelected = srv.id == selectedServiceId
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(if (isSelected) CrimsonRedContainer.copy(alpha = 0.5f) else MaterialTheme.colorScheme.surface)
                        .border(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = if (isSelected) CrimsonRedPrimary else LightNeutralBorder,
                            shape = RoundedCornerShape(14.dp)
                        )
                        .clickable { selectedServiceId = srv.id }
                        .padding(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = srv.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(text = srv.description, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${srv.durationMinutes} min • ₹${srv.price.toInt()}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = CrimsonRedPrimary
                            )
                        }
                        if (isSelected) {
                            Icon(Icons.Default.Check, contentDescription = "Selected", tint = CrimsonRedPrimary)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Step 3: Date & Time
        Text(
            text = "3. Date & Available Time Slot *",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = CrimsonRedPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text("Select Day", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        Spacer(modifier = Modifier.height(4.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            dateOptions.forEach { opt ->
                val isSelected = selectedDate == opt
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) CrimsonRedPrimary else MaterialTheme.colorScheme.surface)
                        .border(1.dp, if (isSelected) CrimsonRedPrimary else LightNeutralBorder, RoundedCornerShape(8.dp))
                        .clickable { selectedDate = opt }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = opt,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        Text("Select Time", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        Spacer(modifier = Modifier.height(4.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            timeOptions.take(3).forEach { opt ->
                val isSelected = selectedTime == opt
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) CrimsonRedPrimary else MaterialTheme.colorScheme.surface)
                        .border(1.dp, if (isSelected) CrimsonRedPrimary else LightNeutralBorder, RoundedCornerShape(8.dp))
                        .clickable { selectedTime = opt }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = opt,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            timeOptions.drop(3).forEach { opt ->
                val isSelected = selectedTime == opt
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) CrimsonRedPrimary else MaterialTheme.colorScheme.surface)
                        .border(1.dp, if (isSelected) CrimsonRedPrimary else LightNeutralBorder, RoundedCornerShape(8.dp))
                        .clickable { selectedTime = opt }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = opt,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Step 4: Notes
        Text(
            text = "4. Special Notes & Instructions",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = CrimsonRedPrimary
        )

        Spacer(modifier = Modifier.height(6.dp))

        OutlinedTextField(
            value = notes,
            onValueChange = { notes = it },
            placeholder = { Text("E.g. Herbal shampoo, sensitive paws, medication routine...") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            minLines = 3
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (selectedPetId.isNotBlank() && selectedServiceId.isNotBlank()) {
                    viewModel.bookAppointment(
                        petId = selectedPetId,
                        serviceId = selectedServiceId,
                        date = selectedDate,
                        time = selectedTime,
                        notes = notes
                    )
                    onBookingComplete()
                }
            },
            enabled = selectedPetId.isNotBlank() && selectedServiceId.isNotBlank(),
            modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = CrimsonRedPrimary),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text("Request Appointment", fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}
