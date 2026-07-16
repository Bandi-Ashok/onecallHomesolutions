package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryNavyDark,
    secondary = SecondaryRedDark,
    tertiary = TertiaryTealDark,
    background = BgDark,
    surface = SurfaceDark,
    onPrimary = Color(0xFF001B3C),
    onSecondary = Color(0xFF410006),
    onTertiary = Color(0xFF00201F),
    onBackground = OnBgDark,
    onSurface = OnSurfaceDark,
    surfaceVariant = Color(0xFF1F2F43),
    onSurfaceVariant = Color(0xFFC4C6CF),
    outline = Color(0xFF8E9099)
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryNavy,
    secondary = SecondaryRed,
    tertiary = TertiaryTeal,
    background = BgLight,
    surface = SurfaceLight,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = OnBgLight,
    onSurface = OnSurfaceLight,
    surfaceVariant = Color(0xFFEBEFF2),
    onSurfaceVariant = Color(0xFF43474E),
    outline = Color(0xFF74777F)
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
