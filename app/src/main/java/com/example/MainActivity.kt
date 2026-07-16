package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.sp
import com.example.ui.*
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    private val viewModel: AppViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                val currentRoute by viewModel.currentRoute.collectAsState()
                val appMode by viewModel.appMode.collectAsState()

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        if (appMode == "worker") {
                            if (currentRoute in listOf("worker_home", "worker_wallet", "worker_ratings", "worker_support")) {
                                NavigationBar(
                                    modifier = Modifier
                                        .windowInsetsPadding(WindowInsets.navigationBars)
                                        .testTag("worker_navigation_bar"),
                                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                                ) {
                                    NavigationBarItem(
                                        selected = currentRoute == "worker_home",
                                        onClick = { viewModel.navigateTo("worker_home") },
                                        icon = { Icon(Icons.Default.Dashboard, contentDescription = "Dashboard") },
                                        label = { Text("Dashboard", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_worker_home")
                                    )
                                    NavigationBarItem(
                                        selected = currentRoute == "worker_wallet",
                                        onClick = { viewModel.navigateTo("worker_wallet") },
                                        icon = { Icon(Icons.Default.AccountBalanceWallet, contentDescription = "Wallet") },
                                        label = { Text("Wallet", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_worker_wallet")
                                    )
                                    NavigationBarItem(
                                        selected = currentRoute == "worker_ratings",
                                        onClick = { viewModel.navigateTo("worker_ratings") },
                                        icon = { Icon(Icons.Default.Star, contentDescription = "Reviews") },
                                        label = { Text("Reviews", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_worker_ratings")
                                    )
                                    NavigationBarItem(
                                        selected = currentRoute == "worker_support",
                                        onClick = { viewModel.navigateTo("worker_support") },
                                        icon = { Icon(Icons.Default.SupportAgent, contentDescription = "Support") },
                                        label = { Text("Support", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_worker_support")
                                    )
                                }
                            }
                        } else if (appMode == "admin") {
                            // No bottom bar for admin, as admin has its own professional sidebar
                        } else {
                            // Display bottom bar only on primary structural tabs
                            if (currentRoute in listOf("home", "history", "wallet", "profile", "settings")) {
                                NavigationBar(
                                    modifier = Modifier
                                        .windowInsetsPadding(WindowInsets.navigationBars)
                                        .testTag("app_navigation_bar"),
                                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                                ) {
                                    NavigationBarItem(
                                        selected = currentRoute == "home",
                                        onClick = { viewModel.navigateTo("home") },
                                        icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                                        label = { Text("Home", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_home_tab")
                                    )
                                    NavigationBarItem(
                                        selected = currentRoute == "history",
                                        onClick = { viewModel.navigateTo("history") },
                                        icon = { Icon(Icons.Default.History, contentDescription = "History") },
                                        label = { Text("History", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_history_tab")
                                    )
                                    NavigationBarItem(
                                        selected = currentRoute == "wallet",
                                        onClick = { viewModel.navigateTo("wallet") },
                                        icon = { Icon(Icons.Default.Wallet, contentDescription = "Wallet") },
                                        label = { Text("Wallet", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_wallet_tab")
                                    )
                                    NavigationBarItem(
                                        selected = currentRoute == "profile",
                                        onClick = { viewModel.navigateTo("profile") },
                                        icon = { Icon(Icons.Default.AccountCircle, contentDescription = "Profile") },
                                        label = { Text("Profile", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_profile_tab")
                                    )
                                    NavigationBarItem(
                                        selected = currentRoute == "settings",
                                        onClick = { viewModel.navigateTo("settings") },
                                        icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                                        label = { Text("Settings", fontSize = 11.sp) },
                                        modifier = Modifier.testTag("nav_settings_tab")
                                    )
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (currentRoute) {
                            "home" -> HomeScreen(viewModel)
                            "catalog" -> CategoryCatalogScreen(viewModel)
                            "booking_flow" -> BookingFlowScreen(viewModel)
                            "tracking" -> TrackingScreen(viewModel)
                            "wallet" -> WalletScreen(viewModel)
                            "profile" -> ProfileScreen(viewModel)
                            "notifications" -> NotificationsScreen(viewModel)
                            "amc" -> AmcScreen(viewModel)
                            "wishlist" -> WishlistScreen(viewModel)
                            "invoices" -> InvoicesScreen(viewModel)
                            "history" -> HistoryScreen(viewModel)
                            "emergency" -> EmergencyScreen(viewModel)
                            "settings" -> SettingsScreen(viewModel)
                            "ai_hub" -> AiHubScreen(viewModel)

                            // Worker Screens
                            "worker_home" -> WorkerHomeScreen(viewModel)
                            "worker_kyc" -> WorkerKycScreen(viewModel)
                            "worker_navigation" -> WorkerNavigationScreen(viewModel)
                            "worker_wallet" -> WorkerWalletScreen(viewModel)
                            "worker_ratings" -> WorkerRatingsScreen(viewModel)
                            "worker_support" -> WorkerSupportScreen(viewModel)
                            "worker_history" -> WorkerHistoryScreen(viewModel)

                            // Admin Screens
                            "admin_home" -> AdminHomeScreen(viewModel)

                            else -> when (appMode) {
                                "worker" -> WorkerHomeScreen(viewModel)
                                "admin" -> AdminHomeScreen(viewModel)
                                else -> HomeScreen(viewModel)
                            }
                        }
                    }
                }
            }
        }
    }
}
