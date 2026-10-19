package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.UserRole
import com.example.ui.theme.CrimsonRedContainer
import com.example.ui.theme.CrimsonRedPrimary
import com.example.ui.theme.RubyAccent

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PetsHubTopAppBar(
    userRole: UserRole?,
    userName: String?,
    unreadNotificationCount: Int,
    isSupabaseLive: Boolean,
    onOpenSupabaseConfig: () -> Unit,
    onOpenNotifications: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    TopAppBar(
        modifier = modifier,
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface,
            titleContentColor = MaterialTheme.colorScheme.onSurface
        ),
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(CrimsonRedPrimary)
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    androidx.compose.foundation.Image(
                        painter = androidx.compose.ui.res.painterResource(id = com.example.R.drawable.petshub_logo),
                        contentDescription = "Pet's Hub Official Logo",
                        modifier = Modifier.height(26.dp),
                        contentScale = androidx.compose.ui.layout.ContentScale.Fit
                    )
                }

                if (userRole != null) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (userRole == UserRole.ADMIN) CrimsonRedPrimary else CrimsonRedContainer)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = if (userRole == UserRole.ADMIN) "ADMIN" else "SIKAR",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (userRole == UserRole.ADMIN) Color.White else CrimsonRedPrimary
                        )
                    }
                }
            }
        },
        actions = {
            IconButton(onClick = onOpenSupabaseConfig) {
                Box(contentAlignment = Alignment.TopEnd) {
                    Icon(
                        imageVector = if (isSupabaseLive) Icons.Default.CloudDone else Icons.Default.Cloud,
                        contentDescription = "Supabase Status",
                        tint = if (isSupabaseLive) CrimsonRedPrimary else Color.Gray,
                        modifier = Modifier.size(22.dp)
                    )
                    Box(
                        modifier = Modifier
                            .size(7.dp)
                            .clip(CircleShape)
                            .background(if (isSupabaseLive) Color(0xFF10B981) else Color(0xFFF59E0B))
                    )
                }
            }

            IconButton(onClick = onOpenNotifications) {
                BadgedBox(
                    badge = {
                        if (unreadNotificationCount > 0) {
                            Badge(
                                containerColor = CrimsonRedPrimary,
                                contentColor = Color.White
                            ) {
                                Text(unreadNotificationCount.toString())
                            }
                        }
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notifications",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            IconButton(onClick = onLogout) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Logout,
                    contentDescription = "Logout",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    )
}
