package com.example.ui

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.theme.RatingGold
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.WarningOrange
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun WorkerHomeScreen(viewModel: AppViewModel) {
    val profile by viewModel.workerProfile.collectAsState()
    val offers by viewModel.jobOffers.collectAsState()
    val currentRoute by viewModel.currentRoute.collectAsState()

    val pendingOffers = offers.filter { it.status == "PENDING" }
    val isOnline = profile?.isOnline == true

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // AppHeader with Role Switcher
        AppHeader(
            title = "Partner Center",
            onActionClick = { viewModel.setAppMode("customer") },
            actionIcon = Icons.Default.SwitchAccount
        )

        if (profile == null) {
            WorkerRegistrationScreen(viewModel)
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Space at top
                item { Spacer(modifier = Modifier.height(8.dp)) }

                // KYC Warning Banner if not verified
                if (profile?.kycStatus != "VERIFIED") {
                    item {
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { viewModel.navigateTo("worker_kyc") }
                                .testTag("kyc_warning_banner")
                        ) {
                            Row(
                                modifier = Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.GppMaybe,
                                    contentDescription = "Pending KYC",
                                    tint = MaterialTheme.colorScheme.error
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "KYC Actions Required",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp,
                                        color = MaterialTheme.colorScheme.onErrorContainer
                                    )
                                    Text(
                                        text = "Please submit trade certificates to activate daily cash-out features.",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                                    )
                                }
                                Icon(Icons.Default.ChevronRight, contentDescription = "Go", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    }
                }

                // Partner Welcome & Quick Stats Row
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Welcome back, ${profile?.name}!",
                                fontWeight = FontWeight.Bold,
                                fontSize = 20.sp,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "Master Trade: ${profile?.tradeCategory}",
                                fontSize = 12.sp,
                                color = Color.Gray
                            )
                        }

                        // Star badge
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(RatingGold.copy(alpha = 0.15f))
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, contentDescription = "Rating", tint = RatingGold, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = profile?.rating.toString(),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                    }
                }

                // Duty Switch & Attendance Punch Cards
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = if (isOnline) "On Duty: Receiving Jobs" else "Off Duty: Suspended",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    Text(
                                        text = if (isOnline) "Active in immediate dispatch queue" else "Tap toggle to request job offers",
                                        fontSize = 11.sp,
                                        color = Color.Gray
                                    )
                                }
                                Switch(
                                    checked = isOnline,
                                    onCheckedChange = { viewModel.toggleDutyStatus() },
                                    modifier = Modifier.testTag("worker_duty_switch")
                                )
                            }

                            Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = if (profile?.isCheckedIn == true) "Attendance: Checked-In" else "Attendance: Checked-Out",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                    Text(
                                        text = if (profile?.isCheckedIn == true) "Clocked In @ ${profile?.checkInTime}" else "Not registered on system logs",
                                        fontSize = 11.sp,
                                        color = Color.Gray
                                    )
                                }

                                Button(
                                    onClick = { viewModel.punchAttendance() },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (profile?.isCheckedIn == true) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
                                    ),
                                    modifier = Modifier.testTag("punch_attendance_btn")
                                ) {
                                    Text(
                                        text = if (profile?.isCheckedIn == true) "Clock Out" else "Clock In",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }

                // Earnings Metrics Row
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .clickable { viewModel.navigateTo("worker_wallet") }
                                .testTag("today_earnings_card"),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Icon(Icons.Default.TrendingUp, contentDescription = "Today", tint = SuccessGreen, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(text = "Today's Take-Home", fontSize = 11.sp, color = Color.Gray)
                                Text(
                                    text = "$${String.format("%.2f", profile?.todayEarnings ?: 0.0)}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 18.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }

                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .clickable { viewModel.navigateTo("worker_wallet") }
                                .testTag("wallet_balance_card"),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Icon(Icons.Default.AccountBalanceWallet, contentDescription = "Wallet", tint = MaterialTheme.colorScheme.secondary, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(text = "Payout Wallet Balance", fontSize = 11.sp, color = Color.Gray)
                                Text(
                                    text = "$${String.format("%.2f", profile?.walletBalance ?: 0.0)}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 18.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                    }
                }

                // Active Dispatches (Accept/Reject Live Feed)
                item {
                    Text(
                        text = "Live Dispatch Feed (Immediate requests)",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = MaterialTheme.colorScheme.primary
                    )
                }

                if (!isOnline) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                                .padding(24.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Default.VisibilityOff, contentDescription = "Offline", tint = Color.LightGray, modifier = Modifier.size(40.dp))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "You are currently OFFLINE",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                                Text(
                                    text = "Enable your duty switch at the top to receive live technician bookings.",
                                    fontSize = 11.sp,
                                    color = Color.Gray,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    }
                } else if (pendingOffers.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                                .padding(24.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                CircularProgressIndicator(modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = "Listening for nearby jobs...",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = Color.Gray
                                )
                            }
                        }
                    }
                } else {
                    items(pendingOffers) { offer ->
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("offer_card_${offer.id}")
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Column {
                                        Text(
                                            text = offer.serviceName,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.Navigation, contentDescription = "Distance", tint = Color.Gray, modifier = Modifier.size(14.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(text = "${offer.distanceMiles} miles away", fontSize = 12.sp, color = Color.Gray)
                                        }
                                    }

                                    Column(horizontalAlignment = Alignment.End) {
                                        Text(text = "Earnings", fontSize = 10.sp, color = Color.Gray)
                                        Text(
                                            text = "$${String.format("%.2f", offer.estEarnings)}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp,
                                            color = SuccessGreen
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.LocationOn, contentDescription = "Address", tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = offer.clientAddress,
                                        fontSize = 12.sp,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedButton(
                                        onClick = { viewModel.rejectJobOffer(offer.id) },
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier
                                            .weight(1f)
                                            .testTag("reject_btn_${offer.id}"),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
                                    ) {
                                        Text("Reject", fontWeight = FontWeight.Bold)
                                    }

                                    Button(
                                        onClick = { viewModel.acceptJobOffer(offer.id) },
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier
                                            .weight(1.5f)
                                            .testTag("accept_btn_${offer.id}")
                                    ) {
                                        Text("Accept Dispatch", fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }

                // Quick Navigation links
                item {
                    Text(
                        text = "Partner Menu Shortcuts",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }

                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        ShortcutBtn(Icons.Default.History, "Job History", Modifier.weight(1f)) { viewModel.navigateTo("worker_history") }
                        ShortcutBtn(Icons.Default.Star, "Ratings", Modifier.weight(1f)) { viewModel.navigateTo("worker_ratings") }
                        ShortcutBtn(Icons.Default.SupportAgent, "Support", Modifier.weight(1f)) { viewModel.navigateTo("worker_support") }
                    }
                }
            }
        }
    }
}

@Composable
fun ShortcutBtn(icon: ImageVector, label: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        modifier = modifier
            .height(75.dp)
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(imageVector = icon, contentDescription = label, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(22.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.Bold, maxLines = 1)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkerRegistrationScreen(viewModel: AppViewModel) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var expandedTrade by remember { mutableStateOf(false) }
    var selectedTrade by remember { mutableStateOf("Electrical") }
    val trades = listOf("Electrical", "Cleaning", "Plumbing", "HVAC", "Painting", "Carpentry")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.Handyman,
            contentDescription = "Trade Register",
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(56.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "Register as a Home Guardian",
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Apply to provide certified high-paying local dispatch services inside the metropolitan grid area.",
            fontSize = 12.sp,
            color = Color.Gray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Full Legal Name") },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("worker_reg_name"),
            shape = RoundedCornerShape(10.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Corporate Email Address") },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("worker_reg_email"),
            shape = RoundedCornerShape(10.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Contact Number") },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("worker_reg_phone"),
            shape = RoundedCornerShape(10.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))

        // Trade Selection Box
        ExposedDropdownMenuBox(
            expanded = expandedTrade,
            onExpandedChange = { expandedTrade = !expandedTrade },
            modifier = Modifier.fillMaxWidth()
        ) {
            OutlinedTextField(
                value = selectedTrade,
                onValueChange = {},
                readOnly = true,
                label = { Text("Select Master Trade Certification") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedTrade) },
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor()
                    .testTag("worker_trade_dropdown"),
                shape = RoundedCornerShape(10.dp)
            )
            ExposedDropdownMenu(
                expanded = expandedTrade,
                onDismissRequest = { expandedTrade = false }
            ) {
                trades.forEach { trade ->
                    DropdownMenuItem(
                        text = { Text(trade) },
                        onClick = {
                            selectedTrade = trade
                            expandedTrade = false
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(30.dp))

        Button(
            onClick = {
                if (name.isNotEmpty() && email.isNotEmpty() && phone.isNotEmpty()) {
                    viewModel.registerWorkerProfile(name, email, phone, selectedTrade)
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .testTag("worker_reg_submit"),
            shape = RoundedCornerShape(10.dp)
        ) {
            Text("Complete Registration", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun WorkerKycScreen(viewModel: AppViewModel) {
    var documentId by remember { mutableStateOf("") }
    var certificateType by remember { mutableStateOf("") }
    var isUploading by remember { mutableStateOf(false) }
    var uploadProgress by remember { mutableStateOf(0f) }
    val scope = rememberCoroutineScope()
    val profile by viewModel.workerProfile.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "KYC Verification Portal", onBackClick = { viewModel.navigateBack() })

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Default.Shield,
                contentDescription = "Shield SEC",
                tint = MaterialTheme.colorScheme.tertiary,
                modifier = Modifier.size(60.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "One Call Guardian Compliance",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = "We enforce deep automated police verification and local trade union checks to guarantee safety checks for all client properties.",
                fontSize = 11.sp,
                color = Color.Gray,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 12.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Current Status Panel
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "Compliance Verification State", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        text = "STATUS: ${profile?.kycStatus}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = when (profile?.kycStatus) {
                            "VERIFIED" -> SuccessGreen
                            "PENDING_VERIFICATION" -> WarningOrange
                            else -> MaterialTheme.colorScheme.error
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            if (profile?.kycStatus == "VERIFIED") {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = SuccessGreen.copy(alpha = 0.1f)),
                    border = BorderStroke(1.dp, SuccessGreen),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Verified, contentDescription = "Verified", tint = SuccessGreen)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "Security Clearances Active", fontWeight = FontWeight.Bold, color = SuccessGreen)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = "Document ID: ${profile?.kycDocumentId}", fontSize = 12.sp)
                        Text(text = "Trade Credentials: ${profile?.kycCertificateType}", fontSize = 12.sp)
                    }
                }
            } else {
                OutlinedTextField(
                    value = documentId,
                    onValueChange = { documentId = it },
                    label = { Text("Government ID Number (DL / Passport / National ID)") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("kyc_doc_field"),
                    shape = RoundedCornerShape(10.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = certificateType,
                    onValueChange = { certificateType = it },
                    label = { Text("Trade License Name (e.g. Master Plumber)") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("kyc_cert_field"),
                    shape = RoundedCornerShape(10.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))

                if (isUploading) {
                    Text(text = "Uploading documents securely...", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(6.dp))
                    LinearProgressIndicator(progress = uploadProgress, modifier = Modifier.fillMaxWidth())
                    Spacer(modifier = Modifier.height(24.dp))
                } else {
                    Button(
                        onClick = {
                            if (documentId.isNotEmpty() && certificateType.isNotEmpty()) {
                                isUploading = true
                                scope.launch {
                                    for (i in 1..10) {
                                        delay(150)
                                        uploadProgress = i / 10f
                                    }
                                    viewModel.submitKYC(documentId, certificateType)
                                    isUploading = false
                                    viewModel.navigateBack()
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("kyc_submit_btn"),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Upload Photo ID & Verify", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun WorkerNavigationScreen(viewModel: AppViewModel) {
    val activeJobId by viewModel.selectedJobOfferId.collectAsState()
    val offers by viewModel.jobOffers.collectAsState()
    val activeJob = offers.firstOrNull { it.id == activeJobId }

    var otpInput by remember { mutableStateOf("") }
    var otpVerified by remember { mutableStateOf(false) }
    var otpErrorMsg by remember { mutableStateOf("") }
    var beforePhotoUploaded by remember { mutableStateOf(false) }
    var afterPhotoUploaded by remember { mutableStateOf(false) }
    var transitProgressStep by remember { mutableStateOf(0) } // 0: En-route, 1: Arrived at Door, 2: OTP Verified (Work), 3: Work Completed (Photos)

    val routingSteps = listOf(
        "Head North-East on Grand Plaza Parkway toward Sector 3",
        "Merge onto Outer Ring Express Tunnel (Fast-Track Lane)",
        "Take Exit 42-B toward Birchwood Hills residential sector",
        "Turn left at central circle, proceed 300 meters to client location"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Transit Navigation HUD", onBackClick = { viewModel.navigateTo("worker_home") })

        if (activeJob == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No active job target selected.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Client Summary Card
                item {
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(text = "CLIENT & ADDR", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                            Text(text = activeJob.clientName, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Text(text = activeJob.clientAddress, fontSize = 13.sp, color = Color.DarkGray)
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Phone, contentDescription = "Phone", modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = activeJob.clientPhone, fontSize = 12.sp, color = Color.Gray)
                            }
                        }
                    }
                }

                // Live Navigation Simulator Box
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFFE8F5E9))
                            .border(2.dp, SuccessGreen.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.padding(12.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Map,
                                contentDescription = "Simulated Map",
                                tint = SuccessGreen,
                                modifier = Modifier.size(36.dp)
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "GPS ROUTE RADAR (ACTIVE SIMULATOR)",
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp,
                                color = SuccessGreen
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = routingSteps[transitProgressStep.coerceIn(0, routingSteps.size - 1)],
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(12.dp))

                            // Step progress button
                            if (transitProgressStep < 3) {
                                Button(
                                    onClick = {
                                        if (transitProgressStep == 2) {
                                            // Make Arrived check trigger OTP verification phase
                                            transitProgressStep = 3
                                        } else {
                                            transitProgressStep += 1
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = SuccessGreen),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.testTag("gps_step_btn")
                                ) {
                                    Text(
                                        text = when (transitProgressStep) {
                                            0 -> "Simulate Transit Milestone →"
                                            1 -> "Arrived at Doorstep"
                                            else -> "Verify Secure Door Code"
                                        },
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            } else {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = "Arrived", tint = SuccessGreen)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = "Arrived & Verified Securely", fontWeight = FontWeight.Bold, color = SuccessGreen, fontSize = 13.sp)
                                }
                            }
                        }
                    }
                }

                // OTP verification section (Visible when arrived)
                if (transitProgressStep >= 2 && !otpVerified) {
                    item {
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "Secure Doorstep OTP Handshake",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "Ask client for the secure door code to unlock task checklist details.",
                                    fontSize = 11.sp,
                                    color = Color.Gray
                                )
                                Spacer(modifier = Modifier.height(12.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    OutlinedTextField(
                                        value = otpInput,
                                        onValueChange = { otpInput = it },
                                        placeholder = { Text("Enter 4-Digit Code") },
                                        modifier = Modifier
                                            .weight(1f)
                                            .testTag("worker_otp_input"),
                                        shape = RoundedCornerShape(8.dp),
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Button(
                                        onClick = {
                                            if (viewModel.verifyJobOTP(activeJob.id, otpInput)) {
                                                otpVerified = true
                                                otpErrorMsg = ""
                                                transitProgressStep = 3
                                            } else {
                                                otpErrorMsg = "Incorrect Secure OTP. Please double-check with the homeowner."
                                            }
                                        },
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.testTag("verify_otp_btn")
                                    ) {
                                        Text("Verify")
                                    }
                                }
                                if (otpErrorMsg.isNotEmpty()) {
                                    Text(text = otpErrorMsg, color = MaterialTheme.colorScheme.error, fontSize = 11.sp, modifier = Modifier.padding(top = 4.dp))
                                }
                            }
                        }
                    }
                }

                // Job Evidence Checklist Section (Unlocked by OTP verification)
                if (otpVerified || activeJob.status in listOf("OTP_VERIFIED", "IN_PROGRESS", "PHOTOS_UPLOADED", "COMPLETED")) {
                    item {
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "Job Evidence Photo Checkpoint",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "Upload digital proof-of-work before and after finishing maintenance.",
                                    fontSize = 11.sp,
                                    color = Color.Gray
                                )
                                Spacer(modifier = Modifier.height(16.dp))

                                // Before Photo Button
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "1. Before-Work Snap", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    if (beforePhotoUploaded || activeJob.beforePhotoUri.isNotEmpty()) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.CheckCircle, contentDescription = "Done", tint = SuccessGreen, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(text = "Uploaded", color = SuccessGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                        }
                                    } else {
                                        Button(
                                            onClick = {
                                                viewModel.uploadJobPhoto(activeJob.id, "BEFORE")
                                                beforePhotoUploaded = true
                                            },
                                            shape = RoundedCornerShape(8.dp),
                                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                                            modifier = Modifier.testTag("upload_before_btn")
                                        ) {
                                            Icon(Icons.Default.CameraAlt, contentDescription = "Camera", modifier = Modifier.size(14.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Capture", fontSize = 11.sp)
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))
                                Divider(color = MaterialTheme.colorScheme.outlineVariant)
                                Spacer(modifier = Modifier.height(12.dp))

                                // After Photo Button
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "2. After-Work Finish Snap", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    if (afterPhotoUploaded || activeJob.afterPhotoUri.isNotEmpty()) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.CheckCircle, contentDescription = "Done", tint = SuccessGreen, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(text = "Uploaded", color = SuccessGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                        }
                                    } else {
                                        Button(
                                            onClick = {
                                                viewModel.uploadJobPhoto(activeJob.id, "AFTER")
                                                afterPhotoUploaded = true
                                            },
                                            shape = RoundedCornerShape(8.dp),
                                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                                            enabled = beforePhotoUploaded || activeJob.beforePhotoUri.isNotEmpty(),
                                            modifier = Modifier.testTag("upload_after_btn")
                                        ) {
                                            Icon(Icons.Default.CameraAlt, contentDescription = "Camera", modifier = Modifier.size(14.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Capture", fontSize = 11.sp)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Final Dispatch Release
                if (afterPhotoUploaded || activeJob.status in listOf("PHOTOS_UPLOADED", "COMPLETED")) {
                    item {
                        Button(
                            onClick = {
                                viewModel.completeJob(activeJob.id)
                                viewModel.navigateTo("worker_home")
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp)
                                .testTag("complete_job_btn"),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Submit & Cash out Earnings", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WorkerWalletScreen(viewModel: AppViewModel) {
    val profile by viewModel.workerProfile.collectAsState()
    val logs by viewModel.attendanceLogs.collectAsState()
    var withdrawAmount by remember { mutableStateOf("") }
    var payoutMsg by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Wallet & Attendance Logs", onBackClick = { viewModel.navigateBack() })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Balance and withdraw Card
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "Total Partner Capital", color = Color.LightGray, fontSize = 11.sp)
                        Text(
                            text = "$${String.format("%.2f", profile?.walletBalance ?: 0.0)}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 32.sp,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(16.dp))

                        // Transfer input
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedTextField(
                                value = withdrawAmount,
                                onValueChange = { withdrawAmount = it },
                                placeholder = { Text("Enter payout sum") },
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("withdraw_amount_field"),
                                shape = RoundedCornerShape(8.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.5f),
                                    focusedBorderColor = Color.White,
                                    focusedPlaceholderColor = Color.White.copy(alpha = 0.7f),
                                    unfocusedPlaceholderColor = Color.White.copy(alpha = 0.5f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Button(
                                onClick = {
                                    val amt = withdrawAmount.toDoubleOrNull() ?: 0.0
                                    if (viewModel.withdrawWorkerEarnings(amt)) {
                                        payoutMsg = "Successfully cashed out $${String.format("%.2f", amt)} directly into linked bank account."
                                        withdrawAmount = ""
                                    } else {
                                        payoutMsg = "Insufficient wallet funds for bank cash-out."
                                    }
                                },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                                modifier = Modifier.testTag("withdraw_submit_btn")
                            ) {
                                Text("Cash Out", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                            }
                        }

                        if (payoutMsg.isNotEmpty()) {
                            Text(
                                text = payoutMsg,
                                fontSize = 11.sp,
                                color = Color.White,
                                modifier = Modifier.padding(top = 8.dp)
                            )
                        }
                    }
                }
            }

            // Attendance Logs
            item {
                Text(
                    text = "Duty Attendance Logs",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            if (logs.isEmpty()) {
                item {
                    Text(text = "No recorded attendance sheets available.", fontSize = 12.sp, color = Color.Gray)
                }
            } else {
                items(logs) { log ->
                    Card(
                        shape = RoundedCornerShape(10.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(text = "Date: ${log.date}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(
                                    text = "Punch: ${log.punchInTime} - ${if (log.punchOutTime.isEmpty()) "Active" else log.punchOutTime}",
                                    fontSize = 11.sp,
                                    color = Color.Gray
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(SuccessGreen.copy(alpha = 0.15f))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "${log.totalHours} hrs worked",
                                    color = SuccessGreen,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WorkerRatingsScreen(viewModel: AppViewModel) {
    val bookings by viewModel.bookings.collectAsState()
    val completedRatings = bookings.filter { it.status == "Completed" && it.rating > 0 }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Customer Feedback & Ratings", onBackClick = { viewModel.navigateBack() })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text(
                    text = "Verified Customer Reviews",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "These reviews are audited periodically by compliance teams.",
                    fontSize = 12.sp,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            if (completedRatings.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "No rating feedbacks registered on profile.", color = Color.Gray, fontSize = 13.sp)
                    }
                }
            } else {
                items(completedRatings) { bk ->
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = bk.serviceName, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.primary)
                                Row {
                                    for (i in 1..5) {
                                        Icon(
                                            imageVector = Icons.Default.Star,
                                            contentDescription = "Rating Star",
                                            tint = if (i <= bk.rating) RatingGold else Color.LightGray,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "Reviewed on: ${bk.date}", fontSize = 11.sp, color = Color.Gray)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = bk.reviewText,
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WorkerSupportScreen(viewModel: AppViewModel) {
    var ticketCategory by remember { mutableStateOf("Billing") }
    var issueText by remember { mutableStateOf("") }
    var isSubmitted by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Partner Support Hub", onBackClick = { viewModel.navigateBack() })

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(Icons.Default.SupportAgent, contentDescription = "Support", tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(50.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Partner Support & Compliance Center",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = "File direct priority support tickets regarding dispatch payout delays, GPS misalignments, or bad client interactions.",
                fontSize = 11.sp,
                color = Color.Gray,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(24.dp))

            if (isSubmitted) {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = SuccessGreen.copy(alpha = 0.15f)),
                    border = BorderStroke(1.dp, SuccessGreen),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = "Confirmed", tint = SuccessGreen, modifier = Modifier.size(32.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = "Ticket Successfully Submitted", fontWeight = FontWeight.Bold, color = SuccessGreen)
                        Text(
                            text = "Reference ticket: #GC-T-8820. A compliance specialist will dial your contact phone number within 15 mins.",
                            fontSize = 11.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            } else {
                Text(
                    text = "Select Ticket Category",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))

                val categories = listOf("Billing", "Dispatch/GPS", "Safety Breach")
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    for (cat in categories) {
                        val isSelected = ticketCategory == cat
                        Card(
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, if (isSelected) MaterialTheme.colorScheme.primary else Color.LightGray),
                            colors = CardDefaults.cardColors(containerColor = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else Color.White),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { ticketCategory = cat }
                        ) {
                            Text(
                                text = cat,
                                modifier = Modifier.padding(12.dp),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = issueText,
                    onValueChange = { issueText = it },
                    label = { Text("Describe the maintenance issue / incident details") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp)
                        .testTag("support_desc_field"),
                    shape = RoundedCornerShape(10.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        if (issueText.isNotEmpty()) {
                            isSubmitted = true
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("submit_ticket_btn"),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("Submit Priority Ticket", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun WorkerHistoryScreen(viewModel: AppViewModel) {
    val offers by viewModel.jobOffers.collectAsState()
    val completedOffers = offers.filter { it.status == "COMPLETED" }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        AppHeader(title = "Dispatched Job History", onBackClick = { viewModel.navigateBack() })

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text(
                    text = "Your Finished Contracts",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "History of standard completed service jobs and payouts on-grid.",
                    fontSize = 12.sp,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            if (completedOffers.isEmpty()) {
                item {
                    Box(modifier = Modifier.fillMaxWidth().padding(40.dp), contentAlignment = Alignment.Center) {
                        Text("No completed jobs on history log.", color = Color.Gray)
                    }
                }
            } else {
                items(completedOffers) { job ->
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(text = job.serviceName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text(
                                    text = "+$${String.format("%.2f", job.estEarnings)}",
                                    color = SuccessGreen,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "Client: ${job.clientName}", fontSize = 12.sp)
                            Text(text = "Address: ${job.clientAddress}", fontSize = 11.sp, color = Color.Gray)
                            Spacer(modifier = Modifier.height(8.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(SuccessGreen.copy(alpha = 0.15f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(text = "COMPLETED & CREDITED", color = SuccessGreen, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}
