package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppointmentStatus
import com.example.ui.theme.StatusCancelledBg
import com.example.ui.theme.StatusCancelledDot
import com.example.ui.theme.StatusCancelledText
import com.example.ui.theme.StatusCompletedBg
import com.example.ui.theme.StatusCompletedDot
import com.example.ui.theme.StatusCompletedText
import com.example.ui.theme.StatusConfirmedBg
import com.example.ui.theme.StatusConfirmedDot
import com.example.ui.theme.StatusConfirmedText
import com.example.ui.theme.StatusPendingBg
import com.example.ui.theme.StatusPendingDot
import com.example.ui.theme.StatusPendingText

@Composable
fun StatusBadge(
    status: AppointmentStatus,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor, dotColor) = when (status) {
        AppointmentStatus.PENDING -> Triple(StatusPendingBg, StatusPendingText, StatusPendingDot)
        AppointmentStatus.CONFIRMED -> Triple(StatusConfirmedBg, StatusConfirmedText, StatusConfirmedDot)
        AppointmentStatus.COMPLETED -> Triple(StatusCompletedBg, StatusCompletedText, StatusCompletedDot)
        AppointmentStatus.CANCELLED -> Triple(StatusCancelledBg, StatusCancelledText, StatusCancelledDot)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .clip(CircleShape)
                    .background(dotColor)
            )
            Text(
                text = status.label,
                color = textColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(start = 5.dp)
            )
        }
    }
}
