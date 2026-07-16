package com.example.ui

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.data.*
import com.example.ui.theme.*

// Mock Service catalogs
data class ServiceItem(val name: String, val price: Double, val duration: String, val rating: String, val desc: String)

val ServiceCatalogData = mapOf(
    "Electrical" to listOf(
        ServiceItem("AC Installation & Gas Charge", 150.00, "2 hours", "4.8", "Full installation with vacuum check, 100% copper piping fitment, and gas pressure balance."),
        ServiceItem("Ceiling Fan Complete Wiring", 45.00, "45 mins", "4.9", "Installation or repair of fan motor, regulatory speed control switch, and ceiling rod hook fitment."),
        ServiceItem("Emergency Circuit Breaker Fault", 80.00, "1 hour", "4.7", "Troubleshooting short circuits, burning smell checks, and replacement of outdated MCB switchboards.")
    ),
    "Cleaning" to listOf(
        ServiceItem("Whole Home Deep Cleaning", 180.00, "5 hours", "5.0", "Complete sanitize of kitchen, bathroom, upholstery vacuuming, balcony dusting, and floor machine scrubbing."),
        ServiceItem("Eco-Friendly Bathroom Scrub", 39.00, "1 hour", "4.6", "Hard water scale removal, ceramic tile polishing, grout cleaning, and disinfection using eco-active compounds."),
        ServiceItem("Premium Sofa & Fabric Shampooing", 55.00, "2 hours", "4.8", "Extraction cleaning of sofa fabric layers, dust-mite sanitation, and premium anti-odor spray coating.")
    ),
    "Plumbing" to listOf(
        ServiceItem("Emergency Leak Patch & Seal", 60.00, "1 hour", "4.7", "Instant metallic/PVC pipe leak plugging under pressure, and faulty copper valve replacement."),
        ServiceItem("Kitchen Drain Unclogging", 49.00, "1.5 hours", "4.5", "High-pressure chemical wash and heavy clog removal from kitchen sink or drain piping lines."),
        ServiceItem("Premium Water Heater Service", 95.00, "2 hours", "4.8", "Anode rod checkup, thermal element scale removal, and tank flushing for high performance.")
    ),
    "HVAC" to listOf(
        ServiceItem("AC High-Pressure Jet Wash", 70.00, "1.5 hours", "4.9", "Indoor & outdoor coil deep cleaning using pressure pumps, and refrigerant leak detection check."),
        ServiceItem("Smart Thermostat Setup", 110.00, "2 hours", "4.8", "Mounting, complete HVAC unit line wiring, WiFi synchronization, and mobile application control setup.")
    ),
    "Painting" to listOf(
        ServiceItem("Premium Wall Painting & Detailing", 320.00, "2 days", "4.9", "Sanding, crack puttying, anti-fungal primary coat, and 2 coats of premium luxury emulsion paints.")
    ),
    "Carpentry" to listOf(
        ServiceItem("Cabinet Door Hinge Repair", 35.00, "30 mins", "4.6", "Realignment of cabinet doors, replacement of hydraulic hinges, and wooden screw hole filling.")
    )
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppHeader(
    title: String,
    onBackClick: (() -> Unit)? = null,
    onActionClick: (() -> Unit)? = null,
    actionIcon: ImageVector? = null,
    actionBadgeCount: Int = 0
) {
    TopAppBar(
        title = {
            Text(
                text = title,
                fontFamily = androidx.compose.ui.text.font.FontFamily.SansSerif,
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
        },
        navigationIcon = {
            if (onBackClick != null) {
                IconButton(onClick = onBackClick, modifier = Modifier.testTag("back_button")) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            } else {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = "One Call Guardian",
                    modifier = Modifier.padding(start = 16.dp, end = 8.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        },
        actions = {
            if (onActionClick != null && actionIcon != null) {
                IconButton(onClick = onActionClick, modifier = Modifier.testTag("header_action_btn")) {
                    BadgedBox(
                        badge = {
                            if (actionBadgeCount > 0) {
                                Badge(containerColor = MaterialTheme.colorScheme.secondary) {
                                    Text(text = actionBadgeCount.toString(), color = Color.White)
                                }
                            }
                        }
                    ) {
                        Icon(
                            imageVector = actionIcon,
                            contentDescription = "Header Action",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    )
}

@Composable
fun HomeScreen(viewModel: AppViewModel) {
    val search by viewModel.searchQuery.collectAsState()
    val activeCat by viewModel.activeCategory.collectAsState()
    val notifications by viewModel.notifications.collectAsState()
    val unreadNotifications = notifications.count { !it.isRead }

    val categories = listOf("Electrical", "Cleaning", "Plumbing", "HVAC", "Painting", "Carpentry")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(
            title = "One Call",
            onActionClick = { viewModel.navigateTo("notifications") },
            actionIcon = Icons.Default.Notifications,
            actionBadgeCount = unreadNotifications
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp)
        ) {
            // 1. Location Bar & Tagline
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = "Location",
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Metro City (Active Area)",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Text(
                            text = "\"Your Safety Home Our Priority.\"",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // 2. Emergency SOS Panel
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondary
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("sos_panel_card")
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Emergency Dispatch",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Get rapid professional technician team dispatched immediately within 30-min window. Safety certified.",
                                fontSize = 12.sp,
                                color = Color.White.copy(alpha = 0.9f)
                            )
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Button(
                            onClick = {
                                viewModel.triggerEmergencySOS { bookingId ->
                                    viewModel.selectBooking(bookingId)
                                    viewModel.navigateTo("emergency")
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .testTag("sos_button")
                                .height(50.dp)
                        ) {
                            Text(
                                text = "ONE CALL SOS",
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.secondary,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }

            // One Call Gen-AI Assistant Promo Card
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("ai_hub_promo_card")
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = "AI",
                                tint = MaterialTheme.colorScheme.tertiary,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "One Call Gen-AI Assistant",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = MaterialTheme.colorScheme.onTertiaryContainer
                            )
                            Spacer(modifier = Modifier.weight(1f))
                            Surface(
                                color = MaterialTheme.colorScheme.tertiary,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "PREVIEW",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Itemize cost estimates, run predictive risk diagnostics, analyze damaged appliances with computer vision, and schedule dispatch optimization in real-time.",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.85f)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = { viewModel.navigateTo("ai_hub") },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.tertiary,
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(44.dp)
                                .testTag("launch_ai_hub_button")
                        ) {
                            Icon(Icons.Default.Launch, contentDescription = "Launch")
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Launch AI Assistant Desk", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }

            // 3. Search Bar
            item {
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = search,
                    onValueChange = { viewModel.setSearchQuery(it) },
                    placeholder = { Text("Search over 300+ professional services...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("search_field"),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )
            }

            // 4. Category Grid Header
            item {
                Spacer(modifier = Modifier.height(20.dp))
                Text(
                    text = "Professional Service Categories",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(12.dp))
            }

            // Category Icons Row or Grid (Since lazy lists cannot nest same-direction lazy grids, we chunk/grid-ify in column items)
            val chunkedCategories = categories.chunked(3)
            items(chunkedCategories) { rowItems ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    for (cat in rowItems) {
                        val isSelected = activeCat == cat
                        val icon = when (cat) {
                            "Electrical" -> Icons.Default.ElectricalServices
                            "Cleaning" -> Icons.Default.CleaningServices
                            "Plumbing" -> Icons.Default.Plumbing
                            "HVAC" -> Icons.Default.AcUnit
                            "Painting" -> Icons.Default.FormatPaint
                            else -> Icons.Default.Handyman
                        }

                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface
                            ),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                            modifier = Modifier
                                .weight(1f)
                                .height(100.dp)
                                .clickable {
                                    viewModel.setActiveCategory(cat)
                                    viewModel.navigateTo("catalog")
                                }
                                .testTag("cat_card_$cat"),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(8.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = cat,
                                    tint = if (isSelected) Color.White else MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(28.dp)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = cat,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
            }

            // 5. Promotional Banners for AMC / Seasonal
            item {
                Spacer(modifier = Modifier.height(12.dp))
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { viewModel.navigateTo("amc") }
                        .testTag("banner_amc_card")
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Shield,
                                contentDescription = "Shield",
                                tint = MaterialTheme.colorScheme.tertiary,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Become a Priority Guardian",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Save up to $150/year. Get free quarterly home electrical audits, priority service dispatch queues, and zero service visitation fees.",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "View AMC Annual Contracts →",
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }

            // 6. Trust Signals / Business Metrics
            item {
                Spacer(modifier = Modifier.height(24.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    TrustSignal(Icons.Default.VerifiedUser, "100% Certified", "Professionals")
                    TrustSignal(Icons.Default.SupportAgent, "24/7 Priority", "Dispatch")
                    TrustSignal(Icons.Default.MoneyOff, "7-Day Warranty", "Full Coverage")
                }
                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }
}

@Composable
fun TrustSignal(icon: ImageVector, title: String, subtitle: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(100.dp)
    ) {
        Box(
            modifier = Modifier
                .size(45.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.tertiary.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = MaterialTheme.colorScheme.tertiary,
                modifier = Modifier.size(22.dp)
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        Text(text = subtitle, fontSize = 9.sp, color = Color.Gray, textAlign = TextAlign.Center)
    }
}

@Composable
fun CategoryCatalogScreen(viewModel: AppViewModel) {
    val category by viewModel.activeCategory.collectAsState()
    val wishlist by viewModel.wishlist.collectAsState()
    val services = ServiceCatalogData[category] ?: emptyList()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(
            title = "$category Catalog",
            onBackClick = { viewModel.navigateBack() }
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            item {
                Text(
                    text = "Certified $category Services",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Standard fixed rates. No surprise visiting fee. Includes 7-day warranty.",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            items(services) { service ->
                val isWishlisted = wishlist.any { it.serviceName == service.name }

                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .testTag("service_card_${service.name}"),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = service.name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.Star,
                                        contentDescription = "Rating",
                                        tint = RatingGold,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = service.rating, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Icon(
                                        imageVector = Icons.Default.Timer,
                                        contentDescription = "Duration",
                                        tint = Color.Gray,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = service.duration, fontSize = 12.sp, color = Color.Gray)
                                }
                            }

                            IconButton(
                                onClick = { viewModel.toggleWishlist(service.name, category, service.price) },
                                modifier = Modifier.testTag("wish_btn_${service.name}")
                            ) {
                                Icon(
                                    imageVector = if (isWishlisted) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                    contentDescription = "Wishlist",
                                    tint = if (isWishlisted) Color.Red else Color.Gray
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = service.desc,
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 3,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(12.dp))
                        Divider(color = MaterialTheme.colorScheme.outlineVariant)
                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(text = "Estimate Price", fontSize = 10.sp, color = Color.Gray)
                                Text(
                                    text = "$${String.format("%.2f", service.price)}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 18.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }

                            Button(
                                onClick = { viewModel.startBookingFlow(service.name, service.price) },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.testTag("book_now_btn_${service.name}")
                            ) {
                                Text("Book Service")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BookingFlowScreen(viewModel: AppViewModel) {
    val serviceName by viewModel.tempBookingService.collectAsState()
    val basePrice by viewModel.tempBookingPrice.collectAsState()
    val selectedProperty by viewModel.selectedProperty.collectAsState()
    val selectedDate by viewModel.selectedDate.collectAsState()
    val selectedTimeSlot by viewModel.selectedTimeSlot.collectAsState()
    val appliedCoupon by viewModel.appliedCoupon.collectAsState()
    val selectedPayment by viewModel.selectedPaymentMethod.collectAsState()
    val profile by viewModel.profile.collectAsState()

    var couponInput by remember { mutableStateOf("") }
    var couponStatusMsg by remember { mutableStateOf("") }

    val properties = listOf("Home Address", "Office Office", "Parents' Villa")
    val dates = listOf("Jul 15, 2026", "Jul 16, 2026", "Jul 17, 2026")
    val slots = listOf("10:00 AM - 12:00 PM", "01:00 PM - 03:00 PM", "04:00 PM - 06:00 PM")
    val payments = listOf("Digital Wallet", "Credit/Debit Card", "Cash on Delivery")

    val finalPrice = maxOf(0.0, basePrice - (appliedCoupon?.discount ?: 0.0))

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Booking Setup", onBackClick = { viewModel.navigateBack() })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Service Summary Card
            item {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "Active Booking", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                        Text(text = serviceName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "Base Fare: $${String.format("%.2f", basePrice)}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // 1. Property Picker
            item {
                Text(text = "Select Delivery Property", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Row(modifier = Modifier.horizontalScroll(rememberScrollState())) {
                    for (prop in properties) {
                        val isSelected = selectedProperty == prop
                        Card(
                            shape = RoundedCornerShape(10.dp),
                            border = BorderStroke(1.dp, if (isSelected) MaterialTheme.colorScheme.primary else Color.LightGray),
                            colors = CardDefaults.cardColors(containerColor = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else Color.White),
                            modifier = Modifier
                                .padding(end = 8.dp)
                                .clickable { viewModel.setProperty(prop) }
                                .testTag("property_$prop")
                        ) {
                            Text(text = prop, modifier = Modifier.padding(12.dp), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // 2. Date Picker
            item {
                Text(text = "Select Schedule Date", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Row(modifier = Modifier.horizontalScroll(rememberScrollState())) {
                    for (date in dates) {
                        val isSelected = selectedDate == date
                        Card(
                            shape = RoundedCornerShape(10.dp),
                            border = BorderStroke(1.dp, if (isSelected) MaterialTheme.colorScheme.primary else Color.LightGray),
                            colors = CardDefaults.cardColors(containerColor = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else Color.White),
                            modifier = Modifier
                                .padding(end = 8.dp)
                                .clickable { viewModel.setDate(date) }
                                .testTag("date_$date")
                        ) {
                            Text(text = date, modifier = Modifier.padding(12.dp), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // 3. Time Slot Picker
            item {
                Text(text = "Select Time Slot", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Column {
                    for (slot in slots) {
                        val isSelected = selectedTimeSlot == slot
                        Card(
                            shape = RoundedCornerShape(10.dp),
                            border = BorderStroke(1.dp, if (isSelected) MaterialTheme.colorScheme.primary else Color.LightGray),
                            colors = CardDefaults.cardColors(containerColor = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else Color.White),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clickable { viewModel.setTimeSlot(slot) }
                                .testTag("slot_$slot")
                        ) {
                            Text(
                                text = slot,
                                modifier = Modifier.padding(12.dp),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // 4. Coupons Apply Box
            item {
                Text(text = "Promo Coupons", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedTextField(
                                value = couponInput,
                                onValueChange = { couponInput = it },
                                placeholder = { Text("Enter coupon e.g. WELCOME50") },
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("coupon_input"),
                                shape = RoundedCornerShape(8.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Button(
                                onClick = {
                                    if (viewModel.applyCouponCode(couponInput)) {
                                        couponStatusMsg = "Coupon applied successfully!"
                                    } else {
                                        couponStatusMsg = "Invalid or expired coupon."
                                    }
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.testTag("apply_coupon_btn")
                            ) {
                                Text("Apply")
                            }
                        }
                        if (couponStatusMsg.isNotEmpty()) {
                            Text(
                                text = couponStatusMsg,
                                fontSize = 11.sp,
                                color = if (appliedCoupon != null) SuccessGreen else MaterialTheme.colorScheme.error,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                        appliedCoupon?.let { coupon ->
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(SuccessGreen.copy(alpha = 0.1f))
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(text = "Code: ${coupon.code}", fontWeight = FontWeight.Bold, color = SuccessGreen, fontSize = 12.sp)
                                    Text(text = "Discount: $${coupon.discount} Off", fontSize = 11.sp, color = SuccessGreen)
                                }
                                IconButton(onClick = {
                                    viewModel.removeCoupon()
                                    couponStatusMsg = ""
                                }) {
                                    Icon(Icons.Default.Close, contentDescription = "Remove coupon", tint = SuccessGreen)
                                }
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // 5. Payment Methods
            item {
                Text(text = "Select Payment Method", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(6.dp))
                for (pay in payments) {
                    val isSelected = selectedPayment == pay
                    val walletBalInfo = if (pay == "Digital Wallet") " (Bal: $${String.format("%.2f", profile?.walletBalance ?: 0.0)})" else ""
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else Color.Transparent)
                            .clickable { viewModel.setPaymentMethod(pay) }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = isSelected,
                            onClick = { viewModel.setPaymentMethod(pay) },
                            modifier = Modifier.testTag("radio_payment_$pay")
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = pay + walletBalInfo, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // 6. Estimator summary and checkout
            item {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "Order Breakdown", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = "Base service charge", fontSize = 12.sp)
                            Text(text = "$${String.format("%.2f", basePrice)}", fontSize = 12.sp)
                        }
                        if (appliedCoupon != null) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text(text = "Coupon discount", fontSize = 12.sp, color = SuccessGreen)
                                Text(text = "-$${String.format("%.2f", appliedCoupon!!.discount)}", fontSize = 12.sp, color = SuccessGreen)
                            }
                        }
                        Divider(color = MaterialTheme.colorScheme.outlineVariant, modifier = Modifier.padding(vertical = 8.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = "Total checkout fare", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(text = "$${String.format("%.2f", finalPrice)}", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))
                Button(
                    onClick = {
                        viewModel.createBookingFromFlow { bookingId ->
                            viewModel.selectBooking(bookingId)
                            viewModel.navigateTo("tracking")
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("confirm_booking_btn"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(text = "Confirm & Dispatch", fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }
}

// Geodesic GPS distance calculator helper
private fun calculateDistanceMiles(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val theta = lon1 - lon2
    var dist = Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) +
            Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(Math.toRadians(theta))
    dist = Math.acos(dist)
    dist = Math.toDegrees(dist)
    dist = dist * 60 * 1.1515
    return if (dist.isNaN()) 0.0 else dist
}

@Composable
fun TrackingScreen(viewModel: AppViewModel) {
    val bookingId by viewModel.selectedBookingId.collectAsState()
    val bookings by viewModel.bookings.collectAsState()
    val activeBooking = bookings.firstOrNull { it.id == bookingId }
    val workerLoc by viewModel.currentWorkerLocation.collectAsState()
    val chatMsgs by (if (activeBooking != null) viewModel.getChatMessages(activeBooking.id) else kotlinx.coroutines.flow.flowOf(emptyList())).collectAsState(initial = emptyList())

    var chatTextInput by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Technician Dispatch Tracking", onBackClick = { viewModel.navigateTo("home") })

        if (activeBooking == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No active tracker session found.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Live tracking banner
                item {
                    Text(
                        text = activeBooking.serviceName,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.primary,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = "Status: ${activeBooking.status}",
                        fontWeight = FontWeight.Bold,
                        color = when (activeBooking.status) {
                            "Completed" -> SuccessGreen
                            "Pending" -> WarningOrange
                            else -> MaterialTheme.colorScheme.secondary
                        },
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                }

                // SOS Warning Header if Category is Emergency
                if (activeBooking.category == "Emergency") {
                    item {
                        Card(
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 12.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Warning, contentDescription = "SOS Warning", tint = MaterialTheme.colorScheme.error)
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = "🚨 ACTIVE EMERGENCY SOS DISPATCH",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = MaterialTheme.colorScheme.onErrorContainer
                                    )
                                    Text(
                                        text = "GPS beacons are active. Local rescue backup holds continuous monitoring.",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onErrorContainer
                                    )
                                }
                            }
                        }
                    }
                }

                // Map Simulator box (High fidelity Google Maps Canvas)
                item {
                    val customerLat = 40.7128
                    val customerLng = -74.0060
                    val currentLat = workerLoc?.latitude ?: 40.7250
                    val currentLng = workerLoc?.longitude ?: -74.0150
                    val currentSpeed = workerLoc?.speed ?: 0.0
                    val currentBearing = workerLoc?.bearing ?: 0.0f

                    val dist = calculateDistanceMiles(currentLat, currentLng, customerLat, customerLng)
                    val etaMin = if (currentSpeed > 0) ((dist / currentSpeed) * 60).toInt() else 12
                    val etaSec = if (currentSpeed > 0) (((dist / currentSpeed) * 3600) % 60).toInt() else 0

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(220.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFFE8F5E9))
                            .border(2.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val w = size.width
                            val h = size.height

                            val latMin = 40.7100
                            val latMax = 40.7300
                            val lngMin = -74.0200
                            val lngMax = -74.0000

                            fun getCanvasX(lng: Double): Float {
                                val frac = (lng - lngMin) / (lngMax - lngMin)
                                return (frac * w).toFloat()
                            }

                            fun getCanvasY(lat: Double): Float {
                                val frac = (latMax - lat) / (latMax - latMin)
                                return (frac * h).toFloat()
                            }

                            // 1. Draw Grid Roads
                            val roadColor = Color.White
                            for (latVal in listOf(40.7120, 40.7150, 40.7180, 40.7210, 40.7240, 40.7270)) {
                                val y = getCanvasY(latVal)
                                drawLine(roadColor, start = androidx.compose.ui.geometry.Offset(0f, y), end = androidx.compose.ui.geometry.Offset(w, y), strokeWidth = 14f)
                            }
                            for (lngVal in listOf(-74.0180, -74.0140, -74.0100, -74.0060, -74.0020)) {
                                val x = getCanvasX(lngVal)
                                drawLine(roadColor, start = androidx.compose.ui.geometry.Offset(x, 0f), end = androidx.compose.ui.geometry.Offset(x, h), strokeWidth = 14f)
                            }

                            // 2. Draw Dotted Connecting Route (Technician -> Customer)
                            val techX = getCanvasX(currentLng)
                            val techY = getCanvasY(currentLat)
                            val custX = getCanvasX(customerLng)
                            val custY = getCanvasY(customerLat)

                            drawLine(
                                color = Color(0xFF1976D2),
                                start = androidx.compose.ui.geometry.Offset(techX, techY),
                                end = androidx.compose.ui.geometry.Offset(custX, custY),
                                strokeWidth = 5f,
                                pathEffect = androidx.compose.ui.graphics.PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
                            )

                            // 3. Draw Customer Property Pin
                            drawCircle(
                                color = Color(0x402E7D32),
                                radius = 24f,
                                center = androidx.compose.ui.geometry.Offset(custX, custY)
                            )
                            drawCircle(
                                color = Color(0xFF2E7D32),
                                radius = 10f,
                                center = androidx.compose.ui.geometry.Offset(custX, custY)
                            )

                            // 4. Draw Technician Vehicle Marker
                            drawCircle(
                                color = Color(0x401976D2),
                                radius = 30f,
                                center = androidx.compose.ui.geometry.Offset(techX, techY)
                            )
                            drawCircle(
                                color = Color(0xFF1976D2),
                                radius = 12f,
                                center = androidx.compose.ui.geometry.Offset(techX, techY)
                            )
                        }

                        // HUD display overlays
                        Column(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(8.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.Black.copy(alpha = 0.7f))
                                .padding(6.dp)
                        ) {
                            Text(text = "SPEED: ${String.format("%.1f", currentSpeed)} mph", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text(text = "DIST: ${String.format("%.2f", dist)} mi", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text(text = "ETA: ${etaMin}m ${etaSec}s", color = Color.Green, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }

                        Row(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(8.dp)
                                .clip(RoundedCornerShape(4.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer)
                                .padding(horizontal = 6.dp, vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.GpsFixed, contentDescription = "GPS Link Status", tint = MaterialTheme.colorScheme.onPrimaryContainer, modifier = Modifier.size(10.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "Live GPS Link Active", color = MaterialTheme.colorScheme.onPrimaryContainer, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                }

                // Live HUD Telemetry Details
                item {
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("LATITUDE", fontSize = 9.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                                Text(String.format("%.5f", workerLoc?.latitude ?: 40.7250), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("LONGITUDE", fontSize = 9.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                                Text(String.format("%.5f", workerLoc?.longitude ?: -74.0150), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("BEARING", fontSize = 9.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                                Text("${workerLoc?.bearing?.toInt() ?: 120}°", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                }

                // Technician Profile Details Card
                item {
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(50.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Person, contentDescription = "Professional avatar", tint = MaterialTheme.colorScheme.primary)
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = activeBooking.technicianName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(MaterialTheme.colorScheme.tertiary.copy(alpha = 0.15f))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(text = "Verified Shield", color = MaterialTheme.colorScheme.tertiary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                                Text(text = "Safety Checked ID: GC-9941", fontSize = 11.sp, color = Color.Gray)
                                Text(text = activeBooking.technicianPhone, fontSize = 11.sp, color = Color.Gray)
                            }
                            IconButton(
                                onClick = { /* Call Phone action */ },
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f))
                                    .testTag("call_tech_btn")
                            ) {
                                Icon(Icons.Default.Phone, contentDescription = "Call Tech", tint = MaterialTheme.colorScheme.primary)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }

                // Real-Time Chat System Section
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Chat, contentDescription = "Realtime Chat", tint = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Secure Realtime Chat",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.weight(1f))
                                Box(
                                    modifier = Modifier
                                        .clip(CircleShape)
                                        .background(SuccessGreen)
                                        .size(8.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Online", fontSize = 10.sp, color = Color.Gray)
                            }
                            Spacer(modifier = Modifier.height(12.dp))

                            // Chat message lists
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(150.dp)
                                    .background(MaterialTheme.colorScheme.background)
                                    .clip(RoundedCornerShape(8.dp))
                                    .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(8.dp))
                                    .padding(8.dp)
                            ) {
                                if (chatMsgs.isEmpty()) {
                                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                        Text(text = "No messages yet. Send a message to start chat.", color = Color.Gray, fontSize = 11.sp)
                                    }
                                } else {
                                    LazyColumn(
                                        modifier = Modifier.fillMaxSize()
                                    ) {
                                        items(chatMsgs) { msg ->
                                            val isCustomer = msg.senderRole == "CUSTOMER"
                                            Row(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .padding(vertical = 4.dp),
                                                horizontalArrangement = if (isCustomer) Arrangement.End else Arrangement.Start
                                            ) {
                                                Box(
                                                    modifier = Modifier
                                                        .clip(
                                                            RoundedCornerShape(
                                                                topStart = 12.dp,
                                                                topEnd = 12.dp,
                                                                bottomStart = if (isCustomer) 12.dp else 0.dp,
                                                                bottomEnd = if (isCustomer) 0.dp else 12.dp
                                                            )
                                                        )
                                                        .background(if (isCustomer) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)
                                                        .padding(horizontal = 10.dp, vertical = 6.dp)
                                                        .widthIn(max = 200.dp)
                                                ) {
                                                    Text(
                                                        text = msg.messageText,
                                                        color = if (isCustomer) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                                        fontSize = 12.sp
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(8.dp))

                            // Quick fast templates
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .horizontalScroll(rememberScrollState()),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                val templates = listOf("Are you nearby?", "I'm at the door", "Yes, there is free parking", "Perfect, see you soon!")
                                templates.forEach { phrase ->
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(20.dp))
                                            .background(MaterialTheme.colorScheme.surfaceVariant)
                                            .clickable {
                                                viewModel.sendChatMessage(activeBooking.id, "CUSTOMER", phrase)
                                            }
                                            .padding(horizontal = 10.dp, vertical = 4.dp)
                                    ) {
                                        Text(text = phrase, fontSize = 10.sp, fontWeight = FontWeight.Medium)
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(8.dp))

                            // Chat input action bar
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                OutlinedTextField(
                                    value = chatTextInput,
                                    onValueChange = { chatTextInput = it },
                                    placeholder = { Text("Type secure message...", fontSize = 11.sp) },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                        .testTag("chat_input_field"),
                                    shape = RoundedCornerShape(24.dp),
                                    singleLine = true
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                IconButton(
                                    onClick = {
                                        if (chatTextInput.isNotBlank()) {
                                            viewModel.sendChatMessage(activeBooking.id, "CUSTOMER", chatTextInput)
                                            chatTextInput = ""
                                        }
                                    },
                                    modifier = Modifier
                                        .size(44.dp)
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.primary)
                                        .testTag("chat_send_button")
                                ) {
                                    Icon(Icons.Default.Send, contentDescription = "Send Message", tint = Color.White, modifier = Modifier.size(18.dp))
                                }
                            }
                        }
                    }
                }

                // Timeline stages
                val stages = listOf("Pending Request", "Technician Dispatched", "Technician Arrived", "Work In Progress", "Service Completed")
                val activeStageIndex = when (activeBooking.status) {
                    "Pending" -> 0
                    "Dispatched" -> 1
                    "Arrived" -> 2
                    "In Progress" -> 3
                    "Completed" -> 4
                    else -> 1
                }

                itemsIndexed(stages) { index, stage ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val isDone = index <= activeStageIndex
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(if (isDone) SuccessGreen else Color.LightGray),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isDone) {
                                Icon(Icons.Default.Check, contentDescription = "Completed", tint = Color.White, modifier = Modifier.size(14.dp))
                            } else {
                                Text(text = (index + 1).toString(), color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            text = stage,
                            fontWeight = if (index == activeStageIndex) FontWeight.Bold else FontWeight.Normal,
                            color = if (index == activeStageIndex) MaterialTheme.colorScheme.primary else Color.Gray,
                            fontSize = 12.sp
                        )
                    }
                }

                // Simulations controls for testing & demonstration
                item {
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(text = "Developer Control Simulation Panel", fontSize = 10.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = { viewModel.simulateTechnicianStatusUpdate(activeBooking.id, "Dispatched") },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Dispatch (Simulate Movement)", fontSize = 11.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        }
                        Button(
                            onClick = { viewModel.simulateTechnicianStatusUpdate(activeBooking.id, "Arrived") },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Arrive", fontSize = 11.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        }
                        Button(
                            onClick = { viewModel.simulateTechnicianStatusUpdate(activeBooking.id, "In Progress") },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Work", fontSize = 11.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        }
                        Button(
                            onClick = { viewModel.simulateTechnicianStatusUpdate(activeBooking.id, "Completed") },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Complete", fontSize = 11.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WalletScreen(viewModel: AppViewModel) {
    val transactions by viewModel.transactions.collectAsState()
    val profile by viewModel.profile.collectAsState()

    var amountInput by remember { mutableStateOf("") }
    var walletStatusMsg by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "One Call Digital Wallet", onBackClick = { viewModel.navigateTo("home") })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Balance card with deep Navy gradient
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(MaterialTheme.colorScheme.primary, Color(0xFF1E3C72))
                            )
                        )
                        .padding(24.dp)
                ) {
                    Column {
                        Text(text = "Available Balance", color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "$${String.format("%.2f", profile?.walletBalance ?: 0.0)}",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 32.sp
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Security, contentDescription = "Secure", tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Bank-Grade Encryption Secured", color = Color.White.copy(alpha = 0.9f), fontSize = 11.sp)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(20.dp))
            }

            // Quick deposit block
            item {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "Add Secure Funds", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            OutlinedTextField(
                                value = amountInput,
                                onValueChange = { amountInput = it },
                                placeholder = { Text("Deposit Amount e.g. 100") },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("wallet_deposit_input"),
                                shape = RoundedCornerShape(8.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Button(
                                onClick = {
                                    val d = amountInput.toDoubleOrNull()
                                    if (d != null && d > 0) {
                                        viewModel.addMoneyToWallet(d)
                                        amountInput = ""
                                        walletStatusMsg = "Successfully deposited funds!"
                                    } else {
                                        walletStatusMsg = "Please enter a valid amount."
                                    }
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.testTag("wallet_add_button")
                            ) {
                                Text("Add")
                            }
                        }
                        if (walletStatusMsg.isNotEmpty()) {
                            Text(
                                text = walletStatusMsg,
                                fontSize = 11.sp,
                                color = if (walletStatusMsg.contains("Successfully")) SuccessGreen else MaterialTheme.colorScheme.error,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }

                        // Presets
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf(50.0, 100.0, 250.0).forEach { preset ->
                                Card(
                                    shape = RoundedCornerShape(8.dp),
                                    border = BorderStroke(1.dp, Color.LightGray),
                                    colors = CardDefaults.cardColors(containerColor = Color.White),
                                    modifier = Modifier
                                        .clickable { amountInput = preset.toInt().toString() }
                                        .testTag("wallet_preset_$preset")
                                ) {
                                    Text(
                                        text = "+$${preset.toInt()}",
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(20.dp))
            }

            // Transaction History list
            item {
                Text(text = "Recent Transactions", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
            }

            if (transactions.isEmpty()) {
                item {
                    Text(text = "No recent transactions found.", fontSize = 12.sp, color = Color.Gray, modifier = Modifier.padding(vertical = 12.dp))
                }
            } else {
                items(transactions) { tx ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(MaterialTheme.colorScheme.surface)
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(text = tx.description, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            Text(text = tx.date, fontSize = 10.sp, color = Color.Gray)
                        }
                        val isCredit = tx.type == "CREDIT"
                        Text(
                            text = if (isCredit) "+$${String.format("%.2f", tx.amount)}" else "-$${String.format("%.2f", tx.amount)}",
                            fontWeight = FontWeight.Bold,
                            color = if (isCredit) SuccessGreen else MaterialTheme.colorScheme.error,
                            fontSize = 14.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileScreen(viewModel: AppViewModel) {
    val profile by viewModel.profile.collectAsState()
    val amcContracts by viewModel.amcContracts.collectAsState()

    var isEditing by remember { mutableStateOf(false) }
    var nameField by remember { mutableStateOf("") }
    var emailField by remember { mutableStateOf("") }
    var phoneField by remember { mutableStateOf("") }
    var addressField by remember { mutableStateOf("") }

    // Synchronize fields once profile is fetched
    LaunchedEffect(profile) {
        profile?.let {
            nameField = it.name
            emailField = it.email
            phoneField = it.phone
            addressField = it.address
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Property & Account Dashboard", onBackClick = { viewModel.navigateTo("home") })

        if (profile == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Profile View Card
                item {
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = "Profile Credentials", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                                IconButton(onClick = {
                                    if (isEditing) {
                                        viewModel.updateProfileInfo(nameField, emailField, phoneField, addressField)
                                    }
                                    isEditing = !isEditing
                                }, modifier = Modifier.testTag("edit_profile_toggle")) {
                                    Icon(
                                        imageVector = if (isEditing) Icons.Default.Save else Icons.Default.Edit,
                                        contentDescription = "Edit profile",
                                        tint = MaterialTheme.colorScheme.primary
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            if (isEditing) {
                                OutlinedTextField(
                                    value = nameField,
                                    onValueChange = { nameField = it },
                                    label = { Text("Full Name") },
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).testTag("profile_name_input"),
                                    shape = RoundedCornerShape(8.dp)
                                )
                                OutlinedTextField(
                                    value = emailField,
                                    onValueChange = { emailField = it },
                                    label = { Text("Email Address") },
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).testTag("profile_email_input"),
                                    shape = RoundedCornerShape(8.dp)
                                )
                                OutlinedTextField(
                                    value = phoneField,
                                    onValueChange = { phoneField = it },
                                    label = { Text("Phone Number") },
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).testTag("profile_phone_input"),
                                    shape = RoundedCornerShape(8.dp)
                                )
                                OutlinedTextField(
                                    value = addressField,
                                    onValueChange = { addressField = it },
                                    label = { Text("Primary Residence") },
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).testTag("profile_address_input"),
                                    shape = RoundedCornerShape(8.dp)
                                )
                            } else {
                                Text(text = "Name: ${profile!!.name}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(text = "Email: ${profile!!.email}", fontSize = 12.sp, color = Color.Gray)
                                Text(text = "Phone: ${profile!!.phone}", fontSize = 12.sp, color = Color.Gray)
                                Text(text = "Primary Address: ${profile!!.address}", fontSize = 12.sp, color = Color.Gray)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(20.dp))
                }

                // Property Management Block
                item {
                    Text(text = "Registered Properties", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(8.dp))
                    listOf(
                        "Home (Alex's Suite, Metro City)" to "Primary Address",
                        "Office (Vance Tower, Business Dist)" to "Secondary Property",
                        "Parents Villa (Oak Ridge Estate)" to "Family Property"
                    ).forEach { (property, desc) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.HomeWork, contentDescription = "Property", tint = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(text = property, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    Text(text = desc, fontSize = 10.sp, color = Color.Gray)
                                }
                            }
                            Icon(Icons.Default.CheckCircle, contentDescription = "Configured", tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(16.dp))
                        }
                    }
                    Spacer(modifier = Modifier.height(20.dp))
                }

                // Active AMC Contracts list
                item {
                    Text(text = "Active AMC Contracts (Guardian Priority)", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(8.dp))
                }

                if (amcContracts.isEmpty()) {
                    item {
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                            modifier = Modifier.fillMaxWidth().clickable { viewModel.navigateTo("amc") }
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(text = "No active AMC membership detected.", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                Text(text = "Join over 5,000+ properties. Get quarterly preventive audits and direct priority queuing. Learn more →", fontSize = 11.sp)
                            }
                        }
                    }
                } else {
                    items(amcContracts) { contract ->
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.tertiary),
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(text = contract.planName, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(SuccessGreen.copy(alpha = 0.15f))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(text = contract.status, color = SuccessGreen, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(text = "Active: ${contract.startDate} - ${contract.endDate}", fontSize = 11.sp, color = Color.Gray)
                                Text(text = "Free Preventive Inspections Left: ${contract.inspectionsLeft}", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.tertiary)
                            }
                        }
                    }
                }

                // Dual Role Worker Switcher Card
                item {
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(text = "Professional Integration", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(8.dp))
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { viewModel.setAppMode("worker") }
                            .testTag("switch_to_worker_mode_btn")
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Build,
                                contentDescription = "Worker Portal",
                                tint = MaterialTheme.colorScheme.onSecondaryContainer,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(16.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Switch to Partner / Worker Portal",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer
                                )
                                Text(
                                    text = "Manage job offers, check duty hours, and review earnings logs.",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.8f)
                                )
                            }
                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = "Navigate",
                                tint = MaterialTheme.colorScheme.onSecondaryContainer
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { viewModel.setAppMode("admin") }
                            .testTag("switch_to_admin_mode_btn")
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Security,
                                contentDescription = "Admin Portal",
                                tint = MaterialTheme.colorScheme.onTertiaryContainer,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(16.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Switch to System Admin Console",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.onTertiaryContainer
                                )
                                Text(
                                    text = "Access analytics, dynamic pricing, safety alerts, and manage database services.",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.8f)
                                )
                            }
                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = "Navigate",
                                tint = MaterialTheme.colorScheme.onTertiaryContainer
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(30.dp))
                }
            }
        }
    }
}

@Composable
fun NotificationsScreen(viewModel: AppViewModel) {
    val notifications by viewModel.notifications.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(
            title = "Notification Hub",
            onBackClick = { viewModel.navigateBack() },
            onActionClick = { viewModel.clearAllNotifications() },
            actionIcon = Icons.Default.Checklist,
            actionBadgeCount = 0
        )

        if (notifications.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.NotificationsOff, contentDescription = "No alerts", tint = Color.LightGray, modifier = Modifier.size(60.dp))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = "No notification history found.", fontSize = 13.sp, color = Color.Gray)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                item {
                    Text(text = "Recent Alerts & Despatch Records", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                }

                items(notifications) { item ->
                    Card(
                        shape = RoundedCornerShape(10.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (item.isRead) MaterialTheme.colorScheme.surface else MaterialTheme.colorScheme.surfaceVariant
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable { viewModel.markNotificationAsRead(item.id) },
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                    ) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.Top) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (item.title.contains("EMERGENCY")) MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
                                        else MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = if (item.title.contains("EMERGENCY")) Icons.Default.Emergency else Icons.Default.Notifications,
                                    contentDescription = "Alert",
                                    tint = if (item.title.contains("EMERGENCY")) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = item.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(text = item.message, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(text = item.timestamp, fontSize = 9.sp, color = Color.Gray)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AmcScreen(viewModel: AppViewModel) {
    val contracts by viewModel.amcContracts.collectAsState()

    val plans = listOf(
        Triple("Basic Preventive Shield", 199.00, listOf("2 free full-house inspection cycles", "Priority Queue over regular bookings", "Free visitations & diagnoses")),
        Triple("Gold System Guardian", 299.00, listOf("4 free full-house inspection cycles", "Direct Priority Dispatch queue (30-60 min response)", "Full HVAC & Electric safety warranty", "10% discount on additional catalogs")),
        Triple("Elite Whole-Home Guardian", 499.00, listOf("Unlimited on-demand inspection safety audits", "Direct SOS emergency override dispatch", "Complete appliances coverage protection", "Premium certified technicians only", "20% discount on additional catalogs"))
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Guardian AMC Contracts", onBackClick = { viewModel.navigateTo("home") })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            item {
                Text(
                    text = "Professional Annual Maintenance Contracts",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Shield your properties with proactive maintenance and premium response metrics.",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            items(plans) { (name, price, features) ->
                val isPurchased = contracts.any { it.planName == name }

                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(2.dp, if (isPurchased) MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .testTag("amc_plan_$name")
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = name, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                            if (isPurchased) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(SuccessGreen.copy(alpha = 0.15f))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(text = "Active Contract", color = SuccessGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "$${price.toInt()}/year",
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp,
                            color = MaterialTheme.colorScheme.tertiary
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        features.forEach { feature ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Check, contentDescription = "Bullet", tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(text = feature, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        if (!isPurchased) {
                            Button(
                                onClick = { viewModel.purchaseAmcPlan(name, price) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("buy_amc_$name"),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("Purchase & Register Property")
                            }
                        } else {
                            OutlinedButton(
                                onClick = { /* Contract details */ },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("Manage Priority Dispatch Queue")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WishlistScreen(viewModel: AppViewModel) {
    val wishlist by viewModel.wishlist.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "My Wishlisted Services", onBackClick = { viewModel.navigateTo("home") })

        if (wishlist.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.FavoriteBorder, contentDescription = "Empty", tint = Color.LightGray, modifier = Modifier.size(60.dp))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = "Your saved catalog items appear here.", fontSize = 13.sp, color = Color.Gray)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                items(wishlist) { item ->
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = item.serviceName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text(text = "Category: ${item.category}", fontSize = 11.sp, color = Color.Gray)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "$${String.format("%.2f", item.price)}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                IconButton(onClick = { viewModel.toggleWishlist(item.serviceName, item.category, item.price) }) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.Red)
                                }
                                Spacer(modifier = Modifier.width(4.dp))
                                Button(
                                    onClick = { viewModel.startBookingFlow(item.serviceName, item.price) },
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text("Book Now", fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun HistoryScreen(viewModel: AppViewModel) {
    val bookings by viewModel.bookings.collectAsState()
    val orders by viewModel.orders.collectAsState()

    var activeTab by remember { mutableStateOf("Services") }
    var selectedBookingToReview by remember { mutableStateOf<Booking?>(null) }
    var reviewRatingInput by remember { mutableStateOf(5f) }
    var reviewTextInput by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Booking & Orders History", onBackClick = { viewModel.navigateTo("home") })

        TabRow(selectedTabIndex = if (activeTab == "Services") 0 else 1) {
            Tab(
                selected = activeTab == "Services",
                onClick = { activeTab = "Services" },
                text = { Text("Service Bookings") },
                modifier = Modifier.testTag("tab_services")
            )
            Tab(
                selected = activeTab == "Orders",
                onClick = { activeTab = "Orders" },
                text = { Text("Product Orders") },
                modifier = Modifier.testTag("tab_orders")
            )
        }

        if (activeTab == "Services") {
            if (bookings.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No bookings history found.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    items(bookings) { booking ->
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp)
                                .testTag("history_booking_${booking.id}")
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(text = booking.serviceName, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(
                                                when (booking.status) {
                                                    "Completed" -> SuccessGreen.copy(alpha = 0.15f)
                                                    "Pending" -> WarningOrange.copy(alpha = 0.15f)
                                                    else -> MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                                                }
                                            )
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = booking.status,
                                            color = when (booking.status) {
                                                "Completed" -> SuccessGreen
                                                "Pending" -> WarningOrange
                                                else -> MaterialTheme.colorScheme.primary
                                            },
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(text = "Scheduled: ${booking.date} | ${booking.timeSlot}", fontSize = 11.sp, color = Color.Gray)
                                Text(text = "Amount Paid: $${String.format("%.2f", booking.price)}", fontSize = 11.sp, fontWeight = FontWeight.Bold)

                                if (booking.status == "Completed") {
                                    Spacer(modifier = Modifier.height(10.dp))
                                    Divider(color = MaterialTheme.colorScheme.outlineVariant)
                                    Spacer(modifier = Modifier.height(10.dp))

                                    if (booking.rating > 0f) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.Star, contentDescription = "Stars", tint = RatingGold, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(text = "${booking.rating.toInt()} Stars Provided", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                        }
                                        if (booking.reviewText.isNotEmpty()) {
                                            Text(text = "\"${booking.reviewText}\"", fontSize = 11.sp, color = Color.Gray)
                                        }
                                    } else {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(text = "Share service feedback?", fontSize = 11.sp, color = Color.Gray)
                                            Button(
                                                onClick = {
                                                    selectedBookingToReview = booking
                                                    reviewRatingInput = 5f
                                                    reviewTextInput = ""
                                                },
                                                shape = RoundedCornerShape(6.dp),
                                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                                                modifier = Modifier.testTag("review_btn_${booking.id}")
                                            ) {
                                                Text("Submit Review", fontSize = 10.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                                            }
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(8.dp))
                                    OutlinedButton(
                                        onClick = {
                                            viewModel.selectBooking(booking.id)
                                            viewModel.navigateTo("invoices")
                                        },
                                        shape = RoundedCornerShape(6.dp),
                                        modifier = Modifier.fillMaxWidth().testTag("invoice_btn_${booking.id}")
                                    ) {
                                        Icon(Icons.Default.Receipt, contentDescription = "Invoice", modifier = Modifier.size(14.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("View Digital Invoice", fontSize = 11.sp)
                                    }
                                } else {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Button(
                                        onClick = {
                                            viewModel.selectBooking(booking.id)
                                            viewModel.navigateTo("tracking")
                                        },
                                        shape = RoundedCornerShape(6.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Icon(Icons.Default.Map, contentDescription = "Track", modifier = Modifier.size(14.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Track Active Technician", fontSize = 11.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (orders.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No product orders history found.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    items(orders) { order ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(8.dp))
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(text = order.productName, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(text = "Delivered: ${order.date}", fontSize = 10.sp, color = Color.Gray)
                                Text(text = "Total paid: $${String.format("%.2f", order.price)}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(SuccessGreen.copy(alpha = 0.15f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(text = order.status, color = SuccessGreen, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }

    // Submit Review Dialog Modal
    selectedBookingToReview?.let { booking ->
        Dialog(onDismissRequest = { selectedBookingToReview = null }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(text = "Submit Review Rating", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = booking.serviceName, fontSize = 11.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(16.dp))

                    // Stars Selector
                    Row {
                        for (i in 1..5) {
                            IconButton(onClick = { reviewRatingInput = i.toFloat() }) {
                                Icon(
                                    imageVector = if (i <= reviewRatingInput) Icons.Default.Star else Icons.Default.StarBorder,
                                    contentDescription = "$i Stars",
                                    tint = RatingGold,
                                    modifier = Modifier.size(32.dp)
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = reviewTextInput,
                        onValueChange = { reviewTextInput = it },
                        placeholder = { Text("What did you think of the service professional?") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp)
                            .testTag("review_text_input"),
                        shape = RoundedCornerShape(8.dp)
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        OutlinedButton(onClick = { selectedBookingToReview = null }) {
                            Text("Cancel")
                        }
                        Button(
                            onClick = {
                                viewModel.submitReview(booking.id, reviewRatingInput, reviewTextInput)
                                selectedBookingToReview = null
                            },
                            modifier = Modifier.testTag("submit_review_api_btn")
                        ) {
                            Text("Submit Review")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun InvoicesScreen(viewModel: AppViewModel) {
    val bookingId by viewModel.selectedBookingId.collectAsState()
    val bookings by viewModel.bookings.collectAsState()
    val activeBooking = bookings.firstOrNull { it.id == bookingId }
    val paymentTransactions by viewModel.paymentTransactions.collectAsState()
    val profile by viewModel.profile.collectAsState()

    var activeTab by remember { mutableStateOf("Selected Receipt") }

    // Sandbox state variables
    var sandboxServiceName by remember { mutableStateOf("Full Apartment Deep Cleaning") }
    var sandboxAmount by remember { mutableStateOf("110.00") }
    var sandboxPaymentMethod by remember { mutableStateOf("Stripe") } // Stripe, Razorpay, UPI, Card
    
    // Stripe fields
    var stripeCardNumber by remember { mutableStateOf("4242 4242 4242 4242") }
    var stripeExpiry by remember { mutableStateOf("12/29") }
    var stripeCvc by remember { mutableStateOf("382") }
    
    // Razorpay fields
    var rzpEmail by remember { mutableStateOf(profile?.email ?: "user@example.com") }
    var rzpContact by remember { mutableStateOf(profile?.phone ?: "9876543210") }
    
    // UPI fields
    var upiId by remember { mutableStateOf("onecall@okaxis") }

    // Refund fields
    var selectedTxnForRefund by remember { mutableStateOf<PaymentTransaction?>(null) }
    var refundReasonInput by remember { mutableStateOf("Customer cancellation / reschedule") }

    // Processing simulations
    var isProcessingPayment by remember { mutableStateOf(false) }
    var paymentSuccessMessage by remember { mutableStateOf("") }
    var isProcessingRefund by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Payment & Invoices Desk", onBackClick = { viewModel.navigateBack() })

        // Navigation Tabs for Invoices Screen
        ScrollableTabRow(
            selectedTabIndex = when (activeTab) {
                "Selected Receipt" -> 0
                "Payment History" -> 1
                "Refund Desk" -> 2
                "Gateway Sandbox" -> 3
                else -> 0
            },
            edgePadding = 16.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Tab(
                selected = activeTab == "Selected Receipt",
                onClick = { activeTab = "Selected Receipt" },
                text = { Text("Selected Receipt") },
                modifier = Modifier.testTag("tab_selected_receipt")
            )
            Tab(
                selected = activeTab == "Payment History",
                onClick = { activeTab = "Payment History" },
                text = { Text("History (${paymentTransactions.size})") },
                modifier = Modifier.testTag("tab_payment_history")
            )
            Tab(
                selected = activeTab == "Refund Desk",
                onClick = { activeTab = "Refund Desk" },
                text = { Text("Refund Terminal") },
                modifier = Modifier.testTag("tab_refund_desk")
            )
            Tab(
                selected = activeTab == "Gateway Sandbox",
                onClick = { activeTab = "Gateway Sandbox" },
                text = { Text("Gateway Sandbox") },
                modifier = Modifier.testTag("tab_gateway_sandbox")
            )
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            when (activeTab) {
                "Selected Receipt" -> {
                    if (activeBooking == null) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Default.ReceiptLong,
                                contentDescription = "Receipt Icon",
                                tint = MaterialTheme.colorScheme.outline,
                                modifier = Modifier.size(64.dp)
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                "No Active Booking Selected",
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "Go to 'History' and click 'View Digital Invoice' or test via Sandbox.",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.outline,
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        val matchingTxn = paymentTransactions.firstOrNull { it.bookingId == activeBooking.id }
                        val gstRate = 0.18
                        val basePrice = activeBooking.price
                        val gstAmount = basePrice * gstRate
                        val totalAmount = basePrice + gstAmount
                        val hsnCode = when (activeBooking.category.lowercase()) {
                            "electrical" -> "998713"
                            "plumbing" -> "998711"
                            "cleaning" -> "998714"
                            "hvac" -> "998715"
                            else -> "998719"
                        }
                        
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            item {
                                Card(
                                    shape = RoundedCornerShape(16.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .testTag("invoice_card_body")
                                ) {
                                    Column(modifier = Modifier.padding(20.dp)) {
                                        // Header details
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Column {
                                                Text(
                                                    text = "ONE CALL INDIA PVT LTD",
                                                    fontWeight = FontWeight.Black,
                                                    fontSize = 18.sp,
                                                    color = MaterialTheme.colorScheme.primary
                                                )
                                                Text(
                                                    text = "GSTIN: 27AAAAO1111A1Z2 (Maharashtra)",
                                                    fontSize = 9.sp,
                                                    color = MaterialTheme.colorScheme.outline
                                                )
                                            }
                                            val isRefunded = matchingTxn?.status == "REFUNDED"
                                            Box(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(6.dp))
                                                    .background(
                                                        if (isRefunded) MaterialTheme.colorScheme.error.copy(alpha = 0.15f)
                                                        else SuccessGreen.copy(alpha = 0.15f)
                                                    )
                                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                                            ) {
                                                Text(
                                                    text = if (isRefunded) "REFUNDED" else "PAID",
                                                    color = if (isRefunded) MaterialTheme.colorScheme.error else SuccessGreen,
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }
                                        }

                                        HorizontalDivider(
                                            modifier = Modifier.padding(vertical = 12.dp),
                                            color = MaterialTheme.colorScheme.outlineVariant
                                        )

                                        // Metadata
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Text(
                                                    text = "BILL TO:",
                                                    fontSize = 9.sp,
                                                    color = MaterialTheme.colorScheme.outline,
                                                    fontWeight = FontWeight.Bold
                                                )
                                                Text(
                                                    text = profile?.name ?: "Evelyn Sterling",
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                                Text(
                                                    text = profile?.email ?: "evelyn@sterling.com",
                                                    fontSize = 10.sp,
                                                    color = MaterialTheme.colorScheme.outline
                                                )
                                                Text(
                                                    text = profile?.phone ?: "+91 9999999999",
                                                    fontSize = 10.sp,
                                                    color = MaterialTheme.colorScheme.outline
                                                )
                                            }
                                            Column(horizontalAlignment = Alignment.End) {
                                                Text(
                                                    text = "INVOICE DETAILS:",
                                                    fontSize = 9.sp,
                                                    color = MaterialTheme.colorScheme.outline,
                                                    fontWeight = FontWeight.Bold
                                                )
                                                Text(
                                                    text = activeBooking.date,
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                                Text(
                                                    text = "No: ${matchingTxn?.invoiceNumber ?: "INV-2026-${10000 + activeBooking.id}"}",
                                                    fontSize = 10.sp,
                                                    fontWeight = FontWeight.Medium,
                                                    color = MaterialTheme.colorScheme.primary
                                                )
                                                Text(
                                                    text = "TXN: ${matchingTxn?.transactionId ?: "Direct_Billing"}",
                                                    fontSize = 8.sp,
                                                    color = MaterialTheme.colorScheme.outline
                                                )
                                            }
                                        }

                                        Spacer(modifier = Modifier.height(12.dp))
                                        Text(
                                            text = "Service Site: ${activeBooking.address}",
                                            fontSize = 11.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )

                                        HorizontalDivider(
                                            modifier = Modifier.padding(vertical = 12.dp),
                                            color = MaterialTheme.colorScheme.outlineVariant
                                        )

                                        // Itemization Table
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = "Item & SAC/HSN Description",
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.primary
                                            )
                                            Text(
                                                text = "Amount (INR)",
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.primary
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(6.dp))

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Text(
                                                    text = "${activeBooking.serviceName} (${activeBooking.category})",
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.SemiBold
                                                )
                                                Text(
                                                    text = "SAC Code: $hsnCode | Production Service",
                                                    fontSize = 10.sp,
                                                    color = MaterialTheme.colorScheme.outline
                                                )
                                            }
                                            Text(
                                                text = "Rs. ${String.format("%.2f", basePrice)}",
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.SemiBold
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(8.dp))

                                        // Taxes breakdown
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = "CGST @ 9% (SAC $hsnCode)",
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.outline
                                            )
                                            Text(
                                                text = "Rs. ${String.format("%.2f", gstAmount / 2)}",
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.outline
                                            )
                                        }
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = "SGST @ 9% (SAC $hsnCode)",
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.outline
                                            )
                                            Text(
                                                text = "Rs. ${String.format("%.2f", gstAmount / 2)}",
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.outline
                                            )
                                        }

                                        HorizontalDivider(
                                            modifier = Modifier.padding(vertical = 12.dp),
                                            color = MaterialTheme.colorScheme.outlineVariant
                                        )

                                        // Totals
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Column {
                                                Text(
                                                    text = "Total Invoice Amount",
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 13.sp
                                                )
                                                Text(
                                                    text = "(Inclusive of 18% GST)",
                                                    fontSize = 9.sp,
                                                    color = MaterialTheme.colorScheme.outline
                                                )
                                            }
                                            Text(
                                                text = "Rs. ${String.format("%.2f", totalAmount)}",
                                                fontWeight = FontWeight.Black,
                                                fontSize = 18.sp,
                                                color = MaterialTheme.colorScheme.primary
                                            )
                                        }

                                        if (matchingTxn?.status == "REFUNDED") {
                                            Spacer(modifier = Modifier.height(12.dp))
                                            Box(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .background(MaterialTheme.colorScheme.error.copy(alpha = 0.08f))
                                                    .border(
                                                        1.dp,
                                                        MaterialTheme.colorScheme.error.copy(alpha = 0.3f),
                                                        RoundedCornerShape(8.dp)
                                                    )
                                                    .padding(12.dp)
                                            ) {
                                                Column {
                                                    Text(
                                                        text = "Refund Information",
                                                        fontWeight = FontWeight.Bold,
                                                        color = MaterialTheme.colorScheme.error,
                                                        fontSize = 11.sp
                                                    )
                                                    Text(
                                                        text = "Amount Refunded: Rs. ${String.format("%.2f", matchingTxn?.refundAmount ?: totalAmount)}",
                                                        fontSize = 11.sp,
                                                        color = MaterialTheme.colorScheme.onErrorContainer
                                                    )
                                                    Text(
                                                        text = "Reason: ${matchingTxn?.refundReason ?: "No details provided"}",
                                                        fontSize = 10.sp,
                                                        color = MaterialTheme.colorScheme.outline
                                                    )
                                                }
                                            }
                                        }

                                        Spacer(modifier = Modifier.height(20.dp))
                                        Column(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalAlignment = Alignment.CenterHorizontally
                                        ) {
                                            Icon(
                                                Icons.Default.VerifiedUser,
                                                contentDescription = "Shield",
                                                tint = MaterialTheme.colorScheme.tertiary,
                                                modifier = Modifier.size(28.dp)
                                            )
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = "Tax Invoice Compliant with GST India Standard",
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = MaterialTheme.colorScheme.tertiary
                                            )
                                            Text(
                                                text = "Digitally signed on complete payment callback.",
                                                fontSize = 8.sp,
                                                color = MaterialTheme.colorScheme.outline
                                            )
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))
                                Button(
                                    onClick = {
                                        paymentSuccessMessage = "PDF file successfully created inside 'Downloads' folder: ${matchingTxn?.invoiceNumber ?: "INV-2026-N"}.pdf"
                                    },
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(48.dp)
                                        .testTag("download_invoice_btn")
                                ) {
                                    Icon(Icons.Default.Download, contentDescription = "Download")
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Download Certified Tax PDF")
                                }

                                if (paymentSuccessMessage.isNotEmpty()) {
                                    Spacer(modifier = Modifier.height(12.dp))
                                    Text(
                                        text = paymentSuccessMessage,
                                        color = SuccessGreen,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        textAlign = TextAlign.Center
                                    )
                                }
                            }
                        }
                    }
                }

                "Payment History" -> {
                    if (paymentTransactions.isEmpty()) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Default.History,
                                contentDescription = "History Icon",
                                tint = MaterialTheme.colorScheme.outline,
                                modifier = Modifier.size(64.dp)
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("No Transactions Yet", fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "Create a new booking with online payments or use the Sandbox tab to test payments.",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.outline,
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            items(paymentTransactions) { txn ->
                                Card(
                                    shape = RoundedCornerShape(12.dp),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 6.dp)
                                        .clickable {
                                            txn.bookingId?.let { bid ->
                                                viewModel.selectBooking(bid)
                                                activeTab = "Selected Receipt"
                                            }
                                        }
                                ) {
                                    Column(modifier = Modifier.padding(14.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(
                                                    imageVector = when (txn.paymentMethod.uppercase()) {
                                                        "STRIPE GATEWAY", "STRIPE" -> Icons.Default.CreditCard
                                                        "RAZORPAY PAYMENT", "RAZORPAY" -> Icons.Default.Payments
                                                        "UPI INSTANT", "UPI" -> Icons.Default.Smartphone
                                                        else -> Icons.Default.AccountBalanceWallet
                                                    },
                                                    contentDescription = txn.paymentMethod,
                                                    tint = MaterialTheme.colorScheme.primary,
                                                    modifier = Modifier.size(24.dp)
                                                )
                                                Spacer(modifier = Modifier.width(10.dp))
                                                Column {
                                                    Text(
                                                        text = txn.serviceName,
                                                        fontWeight = FontWeight.Bold,
                                                        fontSize = 13.sp,
                                                        maxLines = 1,
                                                        overflow = TextOverflow.Ellipsis
                                                    )
                                                    Text(
                                                        text = "${txn.paymentMethod} • ${txn.invoiceNumber}",
                                                        fontSize = 11.sp,
                                                        color = MaterialTheme.colorScheme.outline
                                                    )
                                                }
                                            }
                                            Column(horizontalAlignment = Alignment.End) {
                                                Text(
                                                    text = "Rs. ${String.format("%.2f", txn.totalAmount)}",
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 14.sp,
                                                    color = MaterialTheme.colorScheme.primary
                                                )
                                                Box(
                                                    modifier = Modifier
                                                        .clip(RoundedCornerShape(4.dp))
                                                        .background(
                                                            if (txn.status == "REFUNDED") MaterialTheme.colorScheme.error.copy(alpha = 0.15f)
                                                            else SuccessGreen.copy(alpha = 0.15f)
                                                        )
                                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                                ) {
                                                    Text(
                                                        text = txn.status,
                                                        color = if (txn.status == "REFUNDED") MaterialTheme.colorScheme.error else SuccessGreen,
                                                        fontSize = 9.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            }
                                        }

                                        HorizontalDivider(
                                            modifier = Modifier.padding(vertical = 8.dp),
                                            color = MaterialTheme.colorScheme.outlineVariant
                                        )

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = "GST (18%): Rs. ${String.format("%.2f", txn.gstAmount)}",
                                                fontSize = 10.sp,
                                                color = MaterialTheme.colorScheme.outline
                                            )
                                            Text(
                                                text = "TXN ID: ${txn.transactionId}",
                                                fontSize = 9.sp,
                                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                                color = MaterialTheme.colorScheme.outline
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                "Refund Desk" -> {
                    val refundableTxns = paymentTransactions.filter { it.status == "SUCCESS" }
                    
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        item {
                            Text(
                                text = "Production Refund Execution Terminal",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "Select a transaction below, explain the reason, and trigger a secure real-time production-ready refund API simulation.",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.outline
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            if (refundableTxns.isEmpty()) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(120.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        "No SUCCESS transactions eligible for refund.",
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.outline,
                                        textAlign = TextAlign.Center
                                    )
                                }
                            } else {
                                Card(
                                    shape = RoundedCornerShape(12.dp),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(16.dp)) {
                                        Text(
                                            text = "Step 1: Choose Transaction",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.secondary
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        
                                        refundableTxns.forEach { txn ->
                                            val isSelected = selectedTxnForRefund?.id == txn.id
                                            Row(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .padding(vertical = 4.dp)
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .background(if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else Color.Transparent)
                                                    .clickable { selectedTxnForRefund = txn }
                                                    .padding(10.dp),
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                RadioButton(
                                                    selected = isSelected,
                                                    onClick = { selectedTxnForRefund = txn }
                                                )
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Column {
                                                    Text(
                                                        text = "${txn.serviceName} (${txn.invoiceNumber})",
                                                        fontSize = 12.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                    Text(
                                                        text = "Rs. ${String.format("%.2f", txn.totalAmount)} • via ${txn.paymentMethod}",
                                                        fontSize = 11.sp,
                                                        color = MaterialTheme.colorScheme.outline
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                OutlinedTextField(
                                    value = refundReasonInput,
                                    onValueChange = { refundReasonInput = it },
                                    label = { Text("Reason for Refund") },
                                    modifier = Modifier.fillMaxWidth().testTag("refund_reason_input"),
                                    shape = RoundedCornerShape(8.dp)
                                )

                                Spacer(modifier = Modifier.height(20.dp))

                                Button(
                                    onClick = {
                                        selectedTxnForRefund?.let { txn ->
                                            isProcessingRefund = true
                                            viewModel.processRefund(txn.transactionId, refundReasonInput)
                                            selectedTxnForRefund = null
                                            isProcessingRefund = false
                                            paymentSuccessMessage = "Refund initiated successfully!"
                                        }
                                    },
                                    enabled = selectedTxnForRefund != null && !isProcessingRefund,
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(48.dp)
                                        .testTag("trigger_refund_btn")
                                ) {
                                    if (isProcessingRefund) {
                                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                                    } else {
                                        Icon(Icons.Default.Undo, contentDescription = "Refund")
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Execute Instant UPI/Stripe Refund")
                                    }
                                }
                            }
                        }
                    }
                }

                "Gateway Sandbox" -> {
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        item {
                            Text(
                                text = "Production Payment Gateway Simulator",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "Simulate actual merchant integration with detailed security callbacks.",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.outline
                            )
                            Spacer(modifier = Modifier.height(12.dp))

                            // Service details
                            OutlinedTextField(
                                value = sandboxServiceName,
                                onValueChange = { sandboxServiceName = it },
                                label = { Text("Service Description") },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(8.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            OutlinedTextField(
                                value = sandboxAmount,
                                onValueChange = { sandboxAmount = it },
                                label = { Text("Base Service Cost (INR)") },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(8.dp),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            Text(
                                text = "Choose Gateway Provider",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.secondary
                            )
                            Spacer(modifier = Modifier.height(8.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                listOf("Stripe", "Razorpay", "UPI", "Card").forEach { method ->
                                    val isSel = sandboxPaymentMethod == method
                                    Button(
                                        onClick = { sandboxPaymentMethod = method },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (isSel) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                                            contentColor = if (isSel) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                                        ),
                                        modifier = Modifier.weight(1f).testTag("select_sandbox_$method")
                                    ) {
                                        Text(method, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(16.dp))

                            Card(
                                shape = RoundedCornerShape(12.dp),
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    when (sandboxPaymentMethod) {
                                        "Stripe" -> {
                                            Text("Stripe Secure Payment Sheet", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Spacer(modifier = Modifier.height(8.dp))
                                            OutlinedTextField(
                                                value = stripeCardNumber,
                                                onValueChange = { stripeCardNumber = it },
                                                label = { Text("Card Number") },
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                            Spacer(modifier = Modifier.height(6.dp))
                                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                                OutlinedTextField(
                                                    value = stripeExpiry,
                                                    onValueChange = { stripeExpiry = it },
                                                    label = { Text("MM/YY") },
                                                    modifier = Modifier.weight(1f)
                                                )
                                                OutlinedTextField(
                                                    value = stripeCvc,
                                                    onValueChange = { stripeCvc = it },
                                                    label = { Text("CVC") },
                                                    modifier = Modifier.weight(1f)
                                                )
                                            }
                                        }
                                        "Razorpay" -> {
                                            Text("Razorpay Express Integration Panel", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Spacer(modifier = Modifier.height(8.dp))
                                            OutlinedTextField(
                                                value = rzpEmail,
                                                onValueChange = { rzpEmail = it },
                                                label = { Text("Billing Email") },
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                            Spacer(modifier = Modifier.height(6.dp))
                                            OutlinedTextField(
                                                value = rzpContact,
                                                onValueChange = { rzpContact = it },
                                                label = { Text("Billing Contact") },
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                        }
                                        "UPI" -> {
                                            Text("UPI Intent QR / VPA Gateway", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Spacer(modifier = Modifier.height(8.dp))
                                            OutlinedTextField(
                                                value = upiId,
                                                onValueChange = { upiId = it },
                                                label = { Text("Virtual Payment Address (VPA)") },
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                            Spacer(modifier = Modifier.height(10.dp))
                                            Box(
                                                modifier = Modifier
                                                    .size(100.dp)
                                                    .background(Color.White)
                                                    .border(1.dp, Color.Black)
                                                    .align(Alignment.CenterHorizontally),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                // Quick simulation of QR box
                                                Icon(
                                                    Icons.Default.QrCodeScanner,
                                                    contentDescription = "QR Code Scanner",
                                                    tint = Color.Black,
                                                    modifier = Modifier.size(64.dp)
                                                )
                                            }
                                        }
                                        "Card" -> {
                                            Text("Direct Credit/Debit Merchant Terminal", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Spacer(modifier = Modifier.height(8.dp))
                                            OutlinedTextField(
                                                value = stripeCardNumber,
                                                onValueChange = { stripeCardNumber = it },
                                                label = { Text("Card Number") },
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(20.dp))

                            val computedGst = (sandboxAmount.toDoubleOrNull() ?: 0.0) * 0.18
                            val totalSimulated = (sandboxAmount.toDoubleOrNull() ?: 0.0) + computedGst

                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                        Text("Subtotal:", fontSize = 11.sp)
                                        Text("Rs. ${String.format("%.2f", sandboxAmount.toDoubleOrNull() ?: 0.0)}", fontSize = 11.sp)
                                    }
                                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                        Text("GST (18%):", fontSize = 11.sp)
                                        Text("Rs. ${String.format("%.2f", computedGst)}", fontSize = 11.sp)
                                    }
                                    HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.2f))
                                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                        Text("Grand Total Due:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        Text("Rs. ${String.format("%.2f", totalSimulated)}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(20.dp))

                            Button(
                                onClick = {
                                    val amt = sandboxAmount.toDoubleOrNull() ?: 0.0
                                    if (amt > 0.0) {
                                        isProcessingPayment = true
                                        viewModel.processPayment(
                                            bookingId = null,
                                            amcContractId = null,
                                            serviceName = sandboxServiceName,
                                            baseAmount = amt,
                                            paymentMethod = sandboxPaymentMethod
                                        ) {
                                            isProcessingPayment = false
                                            paymentSuccessMessage = "Successfully simulated production payment of Rs. ${String.format("%.2f", totalSimulated)}!"
                                        }
                                    }
                                },
                                enabled = !isProcessingPayment,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .testTag("sandbox_submit_payment")
                              ) {
                                if (isProcessingPayment) {
                                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                                } else {
                                    Icon(Icons.Default.Security, contentDescription = "Secure")
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Simulate Production Payment Response")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


@Composable
fun EmergencyScreen(viewModel: AppViewModel) {
    val bookingId by viewModel.selectedBookingId.collectAsState()
    val bookings by viewModel.bookings.collectAsState()
    val activeEmergency = bookings.firstOrNull { it.id == bookingId }

    var ticksCount by remember { mutableStateOf(10) }

    LaunchedEffect(Unit) {
        while (ticksCount > 0) {
            kotlinx.coroutines.delay(1000)
            ticksCount--
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Rapid SOS Response", onBackClick = { viewModel.navigateTo("home") })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Emergency,
                        contentDescription = "Urgent SOS",
                        tint = MaterialTheme.colorScheme.secondary,
                        modifier = Modifier.size(50.dp)
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "RAPID DESPATCH ACTIVE",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = MaterialTheme.colorScheme.secondary
                )
                Text(
                    text = "A dedicated professional crew is being routed to your primary address right now.",
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(24.dp))
            }

            // Countdown timer UI
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(2.dp, MaterialTheme.colorScheme.secondary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = "ESTIMATED ARRIVAL TIME WINDOW", fontSize = 11.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (ticksCount > 0) "18:${String.format("%02d", ticksCount)} mins" else "17:59 mins",
                            fontWeight = FontWeight.Bold,
                            fontSize = 32.sp,
                            color = MaterialTheme.colorScheme.secondary
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        LinearProgressIndicator(
                            progress = (10 - ticksCount) / 10f,
                            color = MaterialTheme.colorScheme.secondary,
                            trackColor = Color.LightGray,
                            modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Property and technician details
            item {
                activeEmergency?.let { booking ->
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(text = "EMERGENCY ASSISTANCE LOGS", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.secondary)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(text = "Target Property: ${booking.address}", fontSize = 11.sp)
                            Text(text = "Rapid Commander: ${booking.technicianName}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text(text = "Contact Line: ${booking.technicianPhone}", fontSize = 11.sp)
                            Text(text = "Gate Authentication Pin: ${booking.otp}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }

            // Immediate Support Hotlines
            item {
                Text(text = "Immediate Call Assistance Backup", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = { /* Call hotline */ },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("hotline_call_btn")
                ) {
                    Icon(Icons.Default.Phone, contentDescription = "Call")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Call 24/7 Hotline (+1 800-SOS-CALL)")
                }
                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }
}

@Composable
fun SettingsScreen(viewModel: AppViewModel) {
    val enablePush by viewModel.enablePushNotifications.collectAsState()
    val enableLoc by viewModel.enableLocationPermission.collectAsState()
    val language by viewModel.selectedLanguage.collectAsState()

    var showLanguageDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "App Preferences & Settings", onBackClick = { viewModel.navigateTo("home") })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            item {
                Text(text = "Notification Settings", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "In-App Push Alerts", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(text = "Receive dispatch notifications", fontSize = 11.sp, color = Color.Gray)
                    }
                    Switch(
                        checked = enablePush,
                        onCheckedChange = { viewModel.enablePushNotifications.value = it },
                        modifier = Modifier.testTag("toggle_push_switch")
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                Text(text = "Device Permissions", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "GPS Location Permission", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(text = "Required for dispatcher routing", fontSize = 11.sp, color = Color.Gray)
                    }
                    Switch(
                        checked = enableLoc,
                        onCheckedChange = { viewModel.enableLocationPermission.value = it },
                        modifier = Modifier.testTag("toggle_location_switch")
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                Text(text = "Language Localization", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .clickable { showLanguageDialog = true }
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "App Interface Language", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(text = "Current: $language", fontSize = 11.sp, color = Color.Gray)
                    }
                    Icon(Icons.Default.Language, contentDescription = "Language")
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                Text(text = "System Administration", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(6.dp))
                Card(
                    shape = RoundedCornerShape(8.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "App Version: 1.0.0 (Production Build)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text(text = "Release Signing Key: Verified Standard SHA256", fontSize = 11.sp, color = Color.Gray)
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = { /* Simulator Logout */ },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth().testTag("logout_btn")
                        ) {
                            Text("Logout & Reset Session")
                        }
                    }
                }
                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }

    if (showLanguageDialog) {
        Dialog(onDismissRequest = { showLanguageDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.padding(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "Choose App Language", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    listOf("English", "Spanish", "French", "German", "Hindi").forEach { lang ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.selectedLanguage.value = lang
                                    showLanguageDialog = false
                                }
                                .padding(vertical = 12.dp, horizontal = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = lang, fontSize = 14.sp)
                            if (language == lang) {
                                Icon(Icons.Default.Check, contentDescription = "Selected", tint = MaterialTheme.colorScheme.primary)
                            }
                        }
                    }
                }
            }
        }
    }
}
