package com.example.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = CrimsonRedPrimary,
    onPrimary = Color.White,
    primaryContainer = CrimsonRedContainer,
    onPrimaryContainer = OnCrimsonRedContainer,
    secondary = RubyAccent,
    onSecondary = Color.White,
    secondaryContainer = RubyContainer,
    onSecondaryContainer = OnRubyContainer,
    tertiary = CrimsonRedLight,
    onTertiary = Color.White,
    background = PureWhiteBackground,
    onBackground = CharcoalTextPrimary,
    surface = OffWhiteSurface,
    onSurface = CharcoalTextPrimary,
    surfaceVariant = LightNeutralSurface,
    onSurfaceVariant = CharcoalTextSecondary,
    outline = LightNeutralBorder
)

private val DarkColorScheme = darkColorScheme(
    primary = CrimsonRedLight,
    onPrimary = Color.White,
    primaryContainer = CrimsonRedDark,
    onPrimaryContainer = CrimsonRedContainer,
    secondary = RubyLight,
    onSecondary = Color.White,
    secondaryContainer = CrimsonRedPrimary,
    onSecondaryContainer = Color.White,
    tertiary = CrimsonRedContainer,
    onTertiary = CrimsonRedDark,
    background = Color(0xFF141414),
    onBackground = Color(0xFFFAFAFA),
    surface = Color(0xFF1F1F1F),
    onSurface = Color(0xFFFAFAFA),
    surfaceVariant = Color(0xFF292929),
    onSurfaceVariant = Color(0xFFCCCCCC),
    outline = Color(0xFF404040)
)

@Composable
fun PetsHubTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = Color.Transparent.toArgb()
                window.navigationBarColor = Color.Transparent.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
                WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
