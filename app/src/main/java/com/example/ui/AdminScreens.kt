package com.example.ui

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import java.text.SimpleDateFormat
import java.util.*
import kotlin.math.sin

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminHomeScreen(viewModel: AppViewModel) {
    val activeTab by viewModel.adminActiveTab.collectAsState()
    val appMode by viewModel.appMode.collectAsState()

    val adminTabs = listOf(
        "Dashboard" to Icons.Default.Dashboard,
        "Analytics" to Icons.Default.TrendingUp,
        "Bookings" to Icons.Default.EventNote,
        "Customers" to Icons.Default.People,
        "Workers" to Icons.Default.Engineering,
        "Vendors" to Icons.Default.Store,
        "Services" to Icons.Default.Handyman,
        "Pricing" to Icons.Default.MonetizationOn,
        "Payments" to Icons.Default.CreditCard,
        "Coupons" to Icons.Default.ConfirmationNumber,
        "Reports" to Icons.Default.Description,
        "Live Tracking" to Icons.Default.Navigation,
        "SOS Dashboard" to Icons.Default.Warning
    )

    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Sidebar for Wide/Medium layouts or general view
        Column(
            modifier = Modifier
                .width(260.dp)
                .fillMaxHeight()
                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                .padding(16.dp)
                .testTag("admin_sidebar")
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primary),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = "Admin Admin Portal",
                        tint = MaterialTheme.colorScheme.onPrimary
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = "Admin Panel",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Core Portal v1.2",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                    )
                }
            }

            // Quick App Switcher
            Button(
                onClick = { viewModel.setAppMode("customer") },
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.outline),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
                    .testTag("admin_switch_to_customer_btn")
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Exit Admin", modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Exit Admin Mode", fontSize = 12.sp)
            }

            HorizontalDivider(modifier = Modifier.padding(bottom = 16.dp))

            // Scrollable menu items
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(adminTabs) { (tabName, icon) ->
                    val isSelected = activeTab == tabName
                    NavigationDrawerItem(
                        icon = { Icon(icon, contentDescription = tabName, modifier = Modifier.size(20.dp)) },
                        label = { Text(tabName, fontSize = 13.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                        selected = isSelected,
                        onClick = { viewModel.setAdminActiveTab(tabName) },
                        colors = NavigationDrawerItemDefaults.colors(
                            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                            unselectedContainerColor = Color.Transparent,
                            selectedTextColor = MaterialTheme.colorScheme.onPrimaryContainer,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                        ),
                        modifier = Modifier
                            .height(44.dp)
                            .testTag("admin_nav_item_${tabName.lowercase().replace(" ", "_")}")
                    )
                }
            }
        }

        // Divider
        VerticalDivider(thickness = 1.dp, color = MaterialTheme.colorScheme.outlineVariant)

        // Main Content View Area
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .padding(24.dp)
        ) {
            // Header bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = activeTab,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 26.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Real-time system health & operational controls.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                    )
                }

                // Header Badges
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val alerts by viewModel.sosAlerts.collectAsState()
                    val activeSosCount = alerts.count { it.status == "ACTIVE" }

                    if (activeSosCount > 0) {
                        Surface(
                            color = MaterialTheme.colorScheme.error,
                            shape = RoundedCornerShape(16.dp),
                            onClick = { viewModel.setAdminActiveTab("SOS Dashboard") }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Warning, contentDescription = "SOS Alert Badge", tint = Color.White, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("$activeSosCount SOS ALERTS ACTIVE", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Surface(
                        color = MaterialTheme.colorScheme.primaryContainer,
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Text(
                            text = "Admin Role: Principal",
                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                }
            }

            // Body rendering selected screen
            Box(modifier = Modifier.weight(1f)) {
                when (activeTab) {
                    "Dashboard" -> AdminDashboardTab(viewModel)
                    "Analytics" -> AdminAnalyticsTab(viewModel)
                    "Bookings" -> AdminBookingsTab(viewModel)
                    "Customers" -> AdminCustomersTab(viewModel)
                    "Workers" -> AdminWorkersTab(viewModel)
                    "Vendors" -> AdminVendorsTab(viewModel)
                    "Services" -> AdminServicesTab(viewModel)
                    "Pricing" -> AdminPricingTab(viewModel)
                    "Payments" -> AdminPaymentsTab(viewModel)
                    "Coupons" -> AdminCouponsTab(viewModel)
                    "Reports" -> AdminReportsTab(viewModel)
                    "Live Tracking" -> AdminLiveTrackingTab(viewModel)
                    "SOS Dashboard" -> AdminSosDashboardTab(viewModel)
                    else -> AdminDashboardTab(viewModel)
                }
            }
        }
    }
}

// 1. ADMIN DASHBOARD TAB
@Composable
fun AdminDashboardTab(viewModel: AppViewModel) {
    val bookings by viewModel.bookings.collectAsState()
    val coupons by viewModel.coupons.collectAsState()
    val currentWorkerProfile by viewModel.workerProfile.collectAsState()
    val sosAlerts by viewModel.sosAlerts.collectAsState()

    val totalEarnings = bookings.sumOf { it.price }
    val pendingJobs = bookings.count { it.status == "Pending" || it.status == "In Progress" }
    val completedJobs = bookings.count { it.status == "Completed" }

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_dashboard_tab")
    ) {
        item {
            // Metrics Banner Grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                MetricCard(
                    modifier = Modifier.weight(1f),
                    title = "Cumulative Revenue",
                    value = "$${String.format("%.2f", totalEarnings)}",
                    icon = Icons.Default.MonetizationOn,
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    subtitle = "Platform Share: $${String.format("%.2f", totalEarnings * 0.20)}"
                )
                MetricCard(
                    modifier = Modifier.weight(1f),
                    title = "Pending Bookings",
                    value = "$pendingJobs Jobs",
                    icon = Icons.Default.HourglassEmpty,
                    containerColor = MaterialTheme.colorScheme.secondaryContainer,
                    subtitle = "Completed: $completedJobs items"
                )
                MetricCard(
                    modifier = Modifier.weight(1f),
                    title = "System Safety",
                    value = "${sosAlerts.count { it.status == "ACTIVE" }} Active",
                    icon = Icons.Default.Shield,
                    containerColor = if (sosAlerts.any { it.status == "ACTIVE" }) MaterialTheme.colorScheme.errorContainer else MaterialTheme.colorScheme.tertiaryContainer,
                    subtitle = "Resolved: ${sosAlerts.count { it.status == "RESOLVED" }} cases"
                )
            }
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Emergency Escalation Quick-Launch", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(
                        "Inject a high-importance SOS trigger into the database to demonstrate safety alerts resolution systems.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                        modifier = Modifier.padding(bottom = 12.dp)
                    )
                    Button(
                        onClick = { viewModel.triggerSimulatedSos() },
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                        modifier = Modifier.testTag("admin_trigger_sos_btn")
                    ) {
                        Icon(Icons.Default.Warning, contentDescription = "SOS")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Trigger Simulated Tech Panic Alarm")
                    }
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Bookings feed
                Card(
                    modifier = Modifier.weight(1.5f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Recent Operational Dispatches", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            TextButton(onClick = { viewModel.setAdminActiveTab("Bookings") }) {
                                Text("View All", fontSize = 12.sp)
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        if (bookings.isEmpty()) {
                            Text("No dispatches on record.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            bookings.take(4).forEach { booking ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 8.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(booking.serviceName, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        Text("${booking.category} • ${booking.date}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    StatusBadge(status = booking.status)
                                }
                                HorizontalDivider()
                            }
                        }
                    }
                }

                // Active technician quick status
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Partner & Field Health", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Registered Field Techs", fontSize = 13.sp)
                            Text("5 Active", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("KYC Verifications Pending", fontSize = 13.sp)
                            Text("1 Urgent", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Active Surge Index", fontSize = 13.sp)
                            val surge by viewModel.surgeMultiplier.collectAsState()
                            Text("${surge}x", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MetricCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    containerColor: Color,
    subtitle: String
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = containerColor),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Icon(icon, contentDescription = title, modifier = Modifier.size(24.dp), tint = MaterialTheme.colorScheme.primary)
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Black, color = MaterialTheme.colorScheme.onSurface)
            Spacer(modifier = Modifier.height(4.dp))
            Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f))
        }
    }
}

// 2. ADMIN ANALYTICS TAB
@Composable
fun AdminAnalyticsTab(viewModel: AppViewModel) {
    val bookings by viewModel.bookings.collectAsState()
    val categories = listOf("Electrical", "Cleaning", "Plumbing", "HVAC", "Carpentry", "Painting")

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_analytics_tab")
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Monthly System Volume Trend", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("Plotting active dispatches on our virtual time-series index", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(24.dp))

                    // Draw custom Compose Canvas Graph
                    Canvas(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp)
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                    ) {
                        val width = size.width
                        val height = size.height

                        // Draw Grid Lines
                        val gridSteps = 4
                        for (i in 0..gridSteps) {
                            val y = (height / gridSteps) * i
                            drawLine(
                                color = Color.LightGray.copy(alpha = 0.3f),
                                start = Offset(0f, y),
                                end = Offset(width, y),
                                strokeWidth = 1f
                            )
                        }

                        // Plotting points
                        val points = listOf(
                            Offset(0.1f * width, 0.8f * height),
                            Offset(0.25f * width, 0.7f * height),
                            Offset(0.4f * width, 0.5f * height),
                            Offset(0.55f * width, 0.65f * height),
                            Offset(0.7f * width, 0.3f * height),
                            Offset(0.85f * width, 0.2f * height),
                            Offset(width, 0.15f * height)
                        )

                        val path = Path().apply {
                            moveTo(points[0].x, points[0].y)
                            for (index in 1 until points.size) {
                                lineTo(points[index].x, points[index].y)
                            }
                        }

                        drawPath(
                            path = path,
                            color = Color(0xFF4CADAB),
                            style = Stroke(width = 6f, cap = StrokeCap.Round)
                        )

                        // Draw Point dots
                        points.forEach { point ->
                            drawCircle(
                                color = Color(0xFF002045),
                                radius = 8f,
                                center = point
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Jan", fontSize = 10.sp, color = Color.Gray)
                        Text("Mar", fontSize = 10.sp, color = Color.Gray)
                        Text("May", fontSize = 10.sp, color = Color.Gray)
                        Text("Jul", fontSize = 10.sp, color = Color.Gray)
                        Text("Sep", fontSize = 10.sp, color = Color.Gray)
                        Text("Nov", fontSize = 10.sp, color = Color.Gray)
                        Text("Dec", fontSize = 10.sp, color = Color.Gray)
                    }
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Category breakdown bar counts
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Distribution by Domain", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        categories.forEach { cat ->
                            val count = bookings.count { it.category == cat }
                            val progress = if (bookings.isEmpty()) 0f else count.toFloat() / bookings.size
                            Column(modifier = Modifier.padding(vertical = 4.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(cat, fontSize = 12.sp)
                                    Text("$count", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                }
                                LinearProgressIndicator(
                                    progress = { progress },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(6.dp)
                                        .clip(RoundedCornerShape(3.dp)),
                                    color = MaterialTheme.colorScheme.primary,
                                    trackColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                                )
                            }
                        }
                    }
                }

                // Earnings ratios
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Efficacy Indexes", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(16.dp))

                        AnalyticsProgressTile(label = "Customer Rating Average", score = "4.82/5.0", ratio = 0.96f)
                        AnalyticsProgressTile(label = "Dispatch Attendance Rate", score = "98.4%", ratio = 0.984f)
                        AnalyticsProgressTile(label = "SLA Breach Incidents", score = "1.2%", ratio = 0.012f)
                    }
                }
            }
        }
    }
}

@Composable
fun AnalyticsProgressTile(label: String, score: String, ratio: Float) {
    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(score, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { ratio },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = MaterialTheme.colorScheme.secondary,
            trackColor = MaterialTheme.colorScheme.secondary.copy(alpha = 0.1f)
        )
    }
}

// 3. ADMIN BOOKINGS TAB
@Composable
fun AdminBookingsTab(viewModel: AppViewModel) {
    val bookings by viewModel.bookings.collectAsState()

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_bookings_tab")
    ) {
        if (bookings.isEmpty()) {
            item {
                Box(
                    modifier = Modifier.fillMaxWidth().height(200.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No customer bookings registered yet in system database.")
                }
            }
        } else {
            items(bookings) { booking ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("#B-${booking.id}", fontWeight = FontWeight.Black, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.width(8.dp))
                                StatusBadge(status = booking.status)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(booking.serviceName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text("Address: ${booking.address}", fontSize = 12.sp, color = Color.Gray)
                            Text("Time: ${booking.date} • ${booking.timeSlot}", fontSize = 11.sp, color = Color.DarkGray)
                            Text("Price: $${booking.price}", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary)
                        }

                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (booking.status == "Pending") {
                                Button(
                                    onClick = {
                                        viewModel.completeJob(booking.id)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CADAB)),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Text("Dispatch", fontSize = 11.sp, color = Color.White)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// 4. ADMIN CUSTOMERS TAB
@Composable
fun AdminCustomersTab(viewModel: AppViewModel) {
    val profile by viewModel.profile.collectAsState()

    val dummyCustomers = listOf(
        UserProfile(id = 1, name = profile?.name ?: "Evelyn Sterling", email = profile?.email ?: "evelyn@sterling.com", phone = profile?.phone ?: "+1 555-0199", address = profile?.address ?: "742 Evergreen Terrace", walletBalance = profile?.walletBalance ?: 450.0),
        UserProfile(id = 2, name = "Reginald Vance", email = "reginald@vance.com", phone = "+1 (555) 304-2041", address = "104 Baker St, Apt 4B", walletBalance = 120.0),
        UserProfile(id = 3, name = "Clarissa Bones", email = "clarissa@bones.net", phone = "+1 (555) 774-1299", address = "890 Shady Lane Drive", walletBalance = 800.50)
    )

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_customers_tab")
    ) {
        items(dummyCustomers) { customer ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(customer.name.take(2).uppercase(), fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(customer.name, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Email: ${customer.email} • Phone: ${customer.phone}", fontSize = 11.sp, color = Color.Gray)
                        Text("Default Address: ${customer.address}", fontSize = 11.sp, color = Color.DarkGray)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("Balance", fontSize = 11.sp, color = Color.Gray)
                        Text("$${String.format("%.2f", customer.walletBalance)}", fontWeight = FontWeight.Black, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }
    }
}

// 5. ADMIN WORKERS TAB
@Composable
fun AdminWorkersTab(viewModel: AppViewModel) {
    val workerProfile by viewModel.workerProfile.collectAsState()
    val attendanceLogs by viewModel.attendanceLogs.collectAsState()

    // Add another mock worker to show complete list of system resources
    val systemWorkers = listOf(
        workerProfile ?: WorkerProfile(id = 1),
        WorkerProfile(id = 2, name = "Samantha Reed", email = "samantha@onecall.com", tradeCategory = "Plumbing", rating = 4.7f, totalJobsCompleted = 95, walletBalance = 540.0, todayEarnings = 0.0, isOnline = false, kycStatus = "PENDING_VERIFICATION")
    )

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_workers_tab")
    ) {
        item {
            Text("KYC Verification Queue", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
        }

        // Show pending KYC
        val pendingKycList = systemWorkers.filter { it.kycStatus == "PENDING_VERIFICATION" || it.kycStatus == "NOT_STARTED" }
        if (pendingKycList.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                ) {
                    Box(modifier = Modifier.padding(16.dp)) {
                        Text("All worker verifications are up to date. Zero pending in queue.", fontSize = 12.sp)
                    }
                }
            }
        } else {
            items(pendingKycList) { worker ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.1f)),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.error.copy(alpha = 0.3f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Column {
                                Text(worker.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text("Applied for: ${worker.tradeCategory}", fontSize = 11.sp, color = Color.Gray)
                            }
                            Surface(color = MaterialTheme.colorScheme.error, shape = RoundedCornerShape(4.dp)) {
                                Text("Pending KYC", color = Color.White, fontSize = 9.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), fontWeight = FontWeight.Bold)
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Certifications: ${worker.kycCertificateType}", fontSize = 11.sp, color = Color.DarkGray)
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = {
                                    viewModel.updateWorkerKycStatus(worker.id, "VERIFIED")
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CADAB)),
                                modifier = Modifier.height(32.dp).testTag("approve_worker_btn_${worker.id}")
                            ) {
                                Text("Approve License", fontSize = 10.sp, color = Color.White)
                            }
                        }
                    }
                }
            }
        }

        item {
            Text("Active Duty Roster", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
        }

        items(systemWorkers) { worker ->
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(if (worker.isOnline) Color.Green else Color.Gray)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(worker.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Trade: ${worker.tradeCategory} • Checked-in: ${if (worker.isCheckedIn) worker.checkInTime else "OFF DUTY"}", fontSize = 11.sp, color = Color.Gray)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("Rating: ${worker.rating}★", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text("${worker.totalJobsCompleted} Jobs", fontSize = 11.sp, color = Color.DarkGray)
                    }
                }
            }
        }
    }
}

// 6. ADMIN VENDORS TAB
@Composable
fun AdminVendorsTab(viewModel: AppViewModel) {
    val inventory by viewModel.vendorInventory.collectAsState()

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_vendors_tab")
    ) {
        item {
            Text("Wholesale Supplier Integrations & Stock levels", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
        }

        items(inventory) { item ->
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(item.partName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Partner Supplier: ${item.vendorName}", fontSize = 11.sp, color = Color.Gray)
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 4.dp)) {
                            Text("Stock Level: ${item.stockLevel} units", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                            Spacer(modifier = Modifier.width(8.dp))
                            val color = when (item.status) {
                                "IN_STOCK" -> Color.Green
                                "LOW_STOCK" -> Color.Yellow
                                else -> Color.Red
                            }
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(color))
                        }
                    }

                    Button(
                        onClick = { viewModel.orderVendorStock(item.id, 50) },
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                        modifier = Modifier.testTag("reorder_vendor_stock_btn_${item.id}")
                    ) {
                        Text("Refill +50", fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

// 7. ADMIN SERVICES TAB
@Composable
fun AdminServicesTab(viewModel: AppViewModel) {
    val services by viewModel.adminServices.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }
    var serviceName by remember { mutableStateOf("") }
    var servicePrice by remember { mutableStateOf("") }
    var serviceCategory by remember { mutableStateOf("Electrical") }

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_services_tab")
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Operational Catalog", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                Button(
                    onClick = { showAddDialog = true },
                    modifier = Modifier.testTag("admin_add_service_trigger")
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add")
                    Text("New Service", fontSize = 11.sp)
                }
            }
        }

        if (showAddDialog) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.15f)),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Add New Home Service", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = serviceName,
                            onValueChange = { serviceName = it },
                            label = { Text("Service Title") },
                            modifier = Modifier.fillMaxWidth().testTag("add_service_title_input")
                        )
                        OutlinedTextField(
                            value = servicePrice,
                            onValueChange = { servicePrice = it },
                            label = { Text("Base Price ($)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth().testTag("add_service_price_input")
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = {
                                    val price = servicePrice.toDoubleOrNull() ?: 50.0
                                    viewModel.addNewService(serviceName, serviceCategory, price)
                                    serviceName = ""
                                    servicePrice = ""
                                    showAddDialog = false
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CADAB)),
                                modifier = Modifier.testTag("submit_add_service_btn")
                            ) {
                                Text("Save to Catalog", fontSize = 11.sp, color = Color.White)
                            }
                            TextButton(onClick = { showAddDialog = false }) {
                                Text("Cancel")
                            }
                        }
                    }
                }
            }
        }

        items(services) { service ->
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(service.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Category: ${service.category} • Base Price: $${service.price}", fontSize = 11.sp, color = Color.Gray)
                    }

                    Switch(
                        checked = service.isAvailable,
                        onCheckedChange = { viewModel.toggleServiceAvailability(service.id) },
                        modifier = Modifier.testTag("toggle_service_active_${service.id}")
                    )
                }
            }
        }
    }
}

// 8. ADMIN PRICING TAB
@Composable
fun AdminPricingTab(viewModel: AppViewModel) {
    val surge by viewModel.surgeMultiplier.collectAsState()
    val baseFee by viewModel.baseFee.collectAsState()
    val hourlyRate by viewModel.hourlyRate.collectAsState()

    var tempSurge by remember(surge) { mutableStateOf(surge.toFloat()) }
    var tempBase by remember(baseFee) { mutableStateOf(baseFee.toString()) }
    var tempHourly by remember(hourlyRate) { mutableStateOf(hourlyRate.toString()) }

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_pricing_tab")
    ) {
        item {
            Text("Surge Pricing & Dynamic Rates Engine", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
        }

        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Dynamic Peak Surge Multiplier", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Increase or decrease surge levels globally in response to local demand metrics.", fontSize = 11.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Surge: ${String.format("%.1f", tempSurge)}x", fontWeight = FontWeight.Black, fontSize = 20.sp, color = MaterialTheme.colorScheme.primary)
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(if (tempSurge > 1.2f) Color(0xFFFFECEE) else Color(0xFFE2F3E7))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(if (tempSurge > 1.2f) "SURGE ACTIVE" else "STABLE BASE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = if (tempSurge > 1.2f) Color.Red else Color.Green)
                        }
                    }

                    Slider(
                        value = tempSurge,
                        onValueChange = { tempSurge = it },
                        valueRange = 1.0f..3.5f,
                        steps = 5,
                        modifier = Modifier.testTag("admin_surge_slider")
                    )
                }
            }
        }

        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Flat-Rate Baseline Charges", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = tempBase,
                        onValueChange = { tempBase = it },
                        label = { Text("Base Safety & Dispatch Fee ($)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().testTag("admin_base_fee_input")
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = tempHourly,
                        onValueChange = { tempHourly = it },
                        label = { Text("Baseline Technician Hourly Rate ($)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().testTag("admin_hourly_rate_input")
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            viewModel.updatePricingSettings(
                                tempSurge.toDouble(),
                                tempBase.toDoubleOrNull() ?: 45.0,
                                tempHourly.toDoubleOrNull() ?: 65.0
                            )
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CADAB)),
                        modifier = Modifier.fillMaxWidth().testTag("save_pricing_btn")
                    ) {
                        Text("Apply Pricing Adjustments", color = Color.White)
                    }
                }
            }
        }
    }
}

// 9. ADMIN PAYMENTS TAB
@Composable
fun AdminPaymentsTab(viewModel: AppViewModel) {
    val isPayoutRunning by viewModel.isPayoutBatchRunning.collectAsState()
    val transactions by viewModel.transactions.collectAsState()

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_payments_tab")
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Partner Settlement Direct Deposits", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("Trigger immediate direct transfer payouts clearing to registered workers wallet accounts.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f))
                    Spacer(modifier = Modifier.height(16.dp))

                    if (isPayoutRunning) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            CircularProgressIndicator(modifier = Modifier.size(24.dp), color = MaterialTheme.colorScheme.onPrimaryContainer)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Executing bank clearance settlement sequence...", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    } else {
                        Button(
                            onClick = { viewModel.runPayoutBatch() },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.onPrimaryContainer),
                            modifier = Modifier.testTag("admin_run_payout_btn")
                        ) {
                            Text("Clear Settlements & Payouts ($540.50)", color = MaterialTheme.colorScheme.primaryContainer)
                        }
                    }
                }
            }
        }

        item {
            Text("Ledger Incoming Audits", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
        }

        if (transactions.isEmpty()) {
            item {
                Text("No ledger activities currently indexed.", fontSize = 12.sp)
            }
        } else {
            items(transactions) { transaction ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(transaction.description, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text(transaction.date, fontSize = 11.sp, color = Color.Gray)
                        }
                        Text(
                            text = "${if (transaction.type == "CREDIT") "+" else "-"}$${String.format("%.2f", transaction.amount)}",
                            fontWeight = FontWeight.Black,
                            color = if (transaction.type == "CREDIT") Color.Green else Color.Red,
                            fontSize = 14.sp
                        )
                    }
                }
            }
        }
    }
}

// 10. ADMIN COUPONS TAB
@Composable
fun AdminCouponsTab(viewModel: AppViewModel) {
    val coupons by viewModel.coupons.collectAsState()
    var couponCode by remember { mutableStateOf("") }
    var couponDiscount by remember { mutableStateOf("") }
    var couponDesc by remember { mutableStateOf("") }

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_coupons_tab")
    ) {
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Issue Promo Campaign Discount", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = couponCode,
                        onValueChange = { couponCode = it },
                        label = { Text("Coupon Code (e.g. SAVINGS50)") },
                        modifier = Modifier.fillMaxWidth().testTag("coupon_code_input")
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = couponDiscount,
                        onValueChange = { couponDiscount = it },
                        label = { Text("Discount Deductibles ($)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().testTag("coupon_discount_input")
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = couponDesc,
                        onValueChange = { couponDesc = it },
                        label = { Text("Campaign Description") },
                        modifier = Modifier.fillMaxWidth().testTag("coupon_desc_input")
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            if (couponCode.isNotEmpty() && couponDiscount.isNotEmpty()) {
                                viewModel.createAdminCoupon(
                                    couponCode.uppercase(),
                                    couponDiscount.toDoubleOrNull() ?: 10.0,
                                    couponDesc
                                )
                                couponCode = ""
                                couponDiscount = ""
                                couponDesc = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CADAB)),
                        modifier = Modifier.fillMaxWidth().testTag("submit_coupon_btn")
                    ) {
                        Text("Deploy Campaign Coupon", color = Color.White)
                    }
                }
            }
        }

        item {
            Text("Active Promotional Codes", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
        }

        if (coupons.isEmpty()) {
            item {
                Text("Zero active promo campaigns configured.", fontSize = 12.sp, color = Color.Gray)
            }
        } else {
            items(coupons) { coupon ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(coupon.code, fontWeight = FontWeight.Black, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                            Text(coupon.description, fontSize = 12.sp, color = Color.Gray)
                        }
                        Text("-$${String.format("%.2f", coupon.discount)}", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.Red)
                    }
                }
            }
        }
    }
}

// 11. ADMIN REPORTS TAB
@Composable
fun AdminReportsTab(viewModel: AppViewModel) {
    val bookings by viewModel.bookings.collectAsState()
    var generatedReportText by remember { mutableStateOf<String?>(null) }
    var isGenerating by remember { mutableStateOf(false) }

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_reports_tab")
    ) {
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Operational Audit Report Generator", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("Filters performance indicators, cumulative billing, and tax metrics.", fontSize = 11.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            isGenerating = true
                            // Simulate compiling operational audit
                            val totalRev = bookings.sumOf { it.price }
                            val completed = bookings.count { it.status == "Completed" }
                            val pending = bookings.count { it.status == "Pending" || it.status == "In Progress" }
                            val cancel = bookings.count { it.status == "Cancelled" }

                            generatedReportText = """
                                ===================================================
                                    SYSTEM OPERATIONS REPORT - AUDIT SEALED
                                ===================================================
                                REPORT TIMESTAMP : ${SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())}
                                AUDIT STAGE      : PRODUCTION ARCHIVE
                                
                                BUSINESS PERFORMANCE SUMMARY:
                                ---------------------------------------------------
                                Gross Processing Volume (GPV): $${String.format("%.2f", totalRev)}
                                Net Platform Fee Share (20%): $${String.format("%.2f", totalRev * 0.2)}
                                Net Partner Cleared Share   : $${String.format("%.2f", totalRev * 0.8)}
                                
                                SERVICE VOLUMETRICS:
                                ---------------------------------------------------
                                Total Scheduled Bookings    : ${bookings.size}
                                Success SLA Completed       : $completed
                                Dispatch In-flight Active   : $pending
                                Cancelled / Aborted         : $cancel
                                
                                SECURITY / COMPLIANCE STATUS:
                                ---------------------------------------------------
                                SOS Safety Escalations Logged: 0 Active, 2 Resolved
                                KYC Compliance Level        : 100% Verified Roster
                                ===================================================
                            """.trimIndent()
                            isGenerating = false
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CADAB)),
                        modifier = Modifier.fillMaxWidth().testTag("generate_report_btn")
                    ) {
                        Text("Generate Live Operational Statement", color = Color.White)
                    }
                }
            }
        }

        if (generatedReportText != null) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Audit Console Output", color = Color.Green, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            IconButton(onClick = { generatedReportText = null }) {
                                Icon(Icons.Default.Close, contentDescription = "Clear", tint = Color.White)
                            }
                        }

                        Text(
                            text = generatedReportText ?: "",
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                            fontSize = 12.sp,
                            color = Color(0xFF38BDF8),
                            modifier = Modifier
                                .horizontalScroll(rememberScrollState())
                                .padding(top = 8.dp)
                        )
                    }
                }
            }
        }
    }
}

// 12. ADMIN LIVE TRACKING TAB
@Composable
fun AdminLiveTrackingTab(viewModel: AppViewModel) {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_live_tracking_tab")
    ) {
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Interactive Radar & GPS Location Map", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("Displays real-time positioning updates of dispatcher service vehicles.", fontSize = 11.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(16.dp))

                    // Draw static radar map grid
                    Canvas(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(Color(0xFF0F172A))
                    ) {
                        val width = size.width
                        val height = size.height
                        val cx = width / 2
                        val cy = height / 2

                        // Draw concentric radar circles
                        drawCircle(color = Color.Green.copy(alpha = 0.1f), radius = 40f, center = Offset(cx, cy))
                        drawCircle(color = Color.Green.copy(alpha = 0.1f), radius = 100f, center = Offset(cx, cy))
                        drawCircle(color = Color.Green.copy(alpha = 0.1f), radius = 180f, center = Offset(cx, cy))

                        // Radar cross lines
                        drawLine(color = Color.Green.copy(alpha = 0.2f), start = Offset(0f, cy), end = Offset(width, cy), strokeWidth = 1f)
                        drawLine(color = Color.Green.copy(alpha = 0.2f), start = Offset(cx, 0f), end = Offset(cx, height), strokeWidth = 1f)

                        // Plot dispatch trucks
                        drawCircle(color = Color(0xFF38BDF8), radius = 10f, center = Offset(cx - 80f, cy + 40f)) // Truck 1
                        drawCircle(color = Color(0xFFF43F5E), radius = 10f, center = Offset(cx + 110f, cy - 30f)) // Truck 2 (SOS tech!)
                        drawCircle(color = Color(0xFF34D399), radius = 10f, center = Offset(cx + 20f, cy + 60f)) // Truck 3
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text("GPS Transceiver Feeds", fontWeight = FontWeight.Bold, fontSize = 13.sp)

                    Spacer(modifier = Modifier.height(8.dp))
                    LiveTrackerRow(truckId = "TX-9901 (Plumbing Unit)", status = "EN-ROUTE", signal = "EXCELLENT", color = Color(0xFF38BDF8))
                    LiveTrackerRow(truckId = "TX-4015 (Emergency Electrical)", status = "ARRIVED / ON SITE", signal = "CRITICAL", color = Color(0xFFF43F5E))
                    LiveTrackerRow(truckId = "TX-8841 (HVAC Unit)", status = "COMPLETED ROUTE", signal = "STABLE", color = Color(0xFF34D399))
                }
            }
        }
    }
}

@Composable
fun LiveTrackerRow(truckId: String, status: String, signal: String, color: Color) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(10.dp).clip(CircleShape).background(color))
            Spacer(modifier = Modifier.width(8.dp))
            Text(truckId, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
        Text("Status: $status | Signal: $signal", fontSize = 11.sp, color = Color.Gray)
    }
}

// 13. ADMIN SOS DASHBOARD TAB
@Composable
fun AdminSosDashboardTab(viewModel: AppViewModel) {
    val alerts by viewModel.sosAlerts.collectAsState()

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize().testTag("admin_sos_dashboard_tab")
    ) {
        item {
            Text("High-Priority Safety Response Command Center", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.error)
        }

        val activeAlerts = alerts.filter { it.status != "RESOLVED" }
        if (activeAlerts.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE2F3E7))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = "Safe", tint = Color.Green)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("All Field Personnel Safe", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF0F5132))
                            Text("Zero outstanding emergency distress notifications on platform channels.", fontSize = 11.sp, color = Color(0xFF0F5132).copy(alpha = 0.8f))
                        }
                    }
                }
            }
        } else {
            items(activeAlerts) { alert ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                    border = BorderStroke(2.dp, Color.Red)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(12.dp)
                                        .clip(CircleShape)
                                        .background(Color.Red)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("CRITICAL DISPATCH ALARM #${alert.id}", fontWeight = FontWeight.Black, color = Color.Red, fontSize = 13.sp)
                            }

                            Text(alert.timestamp, fontSize = 11.sp, color = Color.Gray)
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Technician: ${alert.workerName} (${alert.trade})", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Client Site: ${alert.clientName}", fontSize = 12.sp, color = Color.DarkGray)
                        Text("Trigger Event: ${alert.issueDescription}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color.Black)

                        Spacer(modifier = Modifier.height(16.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { viewModel.updateSosStatus(alert.id, "DISPATCHED") },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
                                modifier = Modifier.testTag("sos_dispatch_help_btn_${alert.id}")
                            ) {
                                Text("Dispatch Backup Patrol", fontSize = 11.sp, color = Color.White)
                            }

                            Button(
                                onClick = { viewModel.resolveSosAlert(alert.id) },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669)),
                                modifier = Modifier.testTag("sos_resolve_btn_${alert.id}")
                            ) {
                                Text("Mark Resolved & Safe", fontSize = 11.sp, color = Color.White)
                            }
                        }
                    }
                }
            }
        }

        // Show historical resolved cases
        val resolvedAlerts = alerts.filter { it.status == "RESOLVED" }
        if (resolvedAlerts.isNotEmpty()) {
            item {
                Text("Safety Log History", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.Gray)
            }

            items(resolvedAlerts) { alert ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Resolved Alert #${alert.id} - ${alert.workerName}", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            Text("Event: ${alert.issueDescription}", fontSize = 11.sp, color = Color.Gray)
                        }
                        Text("SECURED", fontWeight = FontWeight.Bold, color = Color.Green, fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

// Global reusable status indicator
@Composable
fun StatusBadge(status: String) {
    val (color, text) = when (status) {
        "Pending" -> Color(0xFFFFC107) to "PENDING"
        "Completed" -> Color(0xFF4CADAB) to "COMPLETED"
        "In Progress" -> Color(0xFF17A2B8) to "IN PROGRESS"
        "Cancelled" -> Color(0xFFDC3545) to "CANCELLED"
        else -> Color(0xFF6C757D) to status.uppercase()
    }
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(color.copy(alpha = 0.15f))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(text = text, color = color, fontSize = 10.sp, fontWeight = FontWeight.Bold)
    }
}
