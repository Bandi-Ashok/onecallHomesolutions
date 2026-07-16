package com.example.ui

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun AiHubScreen(viewModel: AppViewModel) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabTitles = listOf("Chat & Voice", "Cost Estimate", "Smart Schedule", "Predictive Rx", "Vision Faults")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // AppHeader
        AppHeader(
            title = "One Call AI Intelligence Desk",
            onBackClick = { viewModel.navigateTo("home") }
        )

        // Scrollable Tabs
        ScrollableTabRow(
            selectedTabIndex = selectedTab,
            edgePadding = 16.dp,
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
            contentColor = MaterialTheme.colorScheme.primary,
            modifier = Modifier.fillMaxWidth()
        ) {
            tabTitles.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal,
                            fontSize = 13.sp
                        )
                    }
                )
            }
        }

        Divider(color = MaterialTheme.colorScheme.outlineVariant)

        // Content Area
        Box(
            modifier = Modifier
                .fillMaxSize()
                .weight(1f)
        ) {
            when (selectedTab) {
                0 -> AiChatTab(viewModel)
                1 -> AiCostTab(viewModel)
                2 -> AiScheduleTab(viewModel)
                3 -> AiPredictiveTab(viewModel)
                4 -> AiVisionTab(viewModel)
            }
        }
    }
}

// ==========================================
// TAB 1: AI CHAT & VOICE ASSISTANT
// ==========================================
@Composable
fun AiChatTab(viewModel: AppViewModel) {
    val messages by viewModel.aiChatMessages.collectAsState()
    val isThinking by viewModel.isAiThinking.collectAsState()
    val isListening by viewModel.isListening.collectAsState()
    
    var textInput by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    // Scroll to bottom when messages change
    LaunchedEffect(messages.size, isThinking) {
        scrollState.animateScrollTo(scrollState.maxValue)
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Suggestions Chips Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SuggestionChip(
                onClick = { viewModel.sendAiChatMessage("Provide an itemized cost estimate for fixing three leaking water pipes.") },
                label = { Text("Estimate Plumbing", fontSize = 11.sp) }
            )
            SuggestionChip(
                onClick = { viewModel.sendAiChatMessage("What is the most optimal slot to schedule an electrical panel inspection?") },
                label = { Text("Optimize Schedule", fontSize = 11.sp) }
            )
            SuggestionChip(
                onClick = { viewModel.sendAiChatMessage("Help me diagnose why my AC is making a rattling noise.") },
                label = { Text("Troubleshoot AC noise", fontSize = 11.sp) }
            )
            SuggestionChip(
                onClick = { viewModel.sendAiChatMessage("Run a home safety predictive risk scan on my property.") },
                label = { Text("Predictive Risks", fontSize = 11.sp) }
            )
        }

        // Messages Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .verticalScroll(scrollState)
                .padding(horizontal = 16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Spacer(modifier = Modifier.height(8.dp))
                messages.forEach { (sender, text) ->
                    val isUser = sender == "User"
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                    ) {
                        Card(
                            shape = RoundedCornerShape(
                                topStart = 16.dp,
                                topEnd = 16.dp,
                                bottomStart = if (isUser) 16.dp else 0.dp,
                                bottomEnd = if (isUser) 0.dp else 16.dp
                            ),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isUser) {
                                    MaterialTheme.colorScheme.primaryContainer
                                } else {
                                    MaterialTheme.colorScheme.surfaceVariant
                                }
                            ),
                            modifier = Modifier
                                .widthIn(max = 300.dp)
                                .padding(vertical = 2.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    text = if (isUser) "You" else "One Call AI Copilot",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.secondary
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = text,
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }

                if (isThinking) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Start
                    ) {
                        Card(
                            shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp, bottomEnd = 16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                            modifier = Modifier.padding(vertical = 2.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(16.dp),
                                    strokeWidth = 2.dp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(text = "Analyzing metrics...", fontSize = 12.sp)
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }
        }

        // Voice Listening Overlay
        if (isListening) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    VoiceWavePulse()
                    Spacer(modifier = Modifier.width(16.dp))
                    Text(
                        text = "Listening to voice request...",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onTertiaryContainer
                    )
                }
            }
        }

        // Bottom Bar
        Surface(
            tonalElevation = 4.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = { viewModel.clearAiChat() },
                    modifier = Modifier.testTag("ai_chat_clear_button")
                ) {
                    Icon(Icons.Default.DeleteSweep, contentDescription = "Clear Chat", tint = Color.Gray)
                }

                OutlinedTextField(
                    value = textInput,
                    onValueChange = { textInput = it },
                    placeholder = { Text("Ask anything about home care...") },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("ai_chat_input"),
                    shape = RoundedCornerShape(24.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.width(8.dp))

                // Voice Assistant Button
                IconButton(
                    onClick = {
                        viewModel.startVoiceListeningSimulate { spokenText ->
                            viewModel.sendAiChatMessage(spokenText)
                        }
                    },
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.tertiary)
                        .testTag("ai_voice_button")
                ) {
                    Icon(Icons.Default.Mic, contentDescription = "Voice Input", tint = Color.White)
                }

                Spacer(modifier = Modifier.width(4.dp))

                IconButton(
                    onClick = {
                        if (textInput.isNotBlank()) {
                            viewModel.sendAiChatMessage(textInput)
                            textInput = ""
                        }
                    },
                    enabled = textInput.isNotBlank() && !isThinking,
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(if (textInput.isNotBlank()) MaterialTheme.colorScheme.primary else Color.LightGray)
                        .testTag("ai_send_button")
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White)
                }
            }
        }
    }
}

@Composable
fun VoiceWavePulse() {
    val infiniteTransition = rememberInfiniteTransition()
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.4f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        )
    )

    Box(
        modifier = Modifier
            .size(36.dp)
            .clip(CircleShape)
            .background(MaterialTheme.colorScheme.tertiary.copy(alpha = 0.25f)),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(24.dp * scale)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.tertiary.copy(alpha = 0.45f)),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(16.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.tertiary)
            )
        }
    }
}

// ==========================================
// TAB 2: AI COST ESTIMATOR
// ==========================================
@Composable
fun AiCostTab(viewModel: AppViewModel) {
    var details by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Electrical") }
    val categories = listOf("Electrical", "Plumbing", "HVAC", "Cleaning", "Carpentry")
    
    val quote by viewModel.estimatedQuote.collectAsState()
    val isEstimating by viewModel.isEstimating.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "Automated Itemized Cost Estimator",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Describe your home defect in plain English, and our AI will calculate an itemized materials & labor estimate.",
            fontSize = 12.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(text = "1. Select Service Category", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            categories.forEach { cat ->
                val isSelected = selectedCategory == cat
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedCategory = cat },
                    label = { Text(cat) }
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(text = "2. Describe the Fault / Scope of Work", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        OutlinedTextField(
            value = details,
            onValueChange = { details = it },
            placeholder = { Text("e.g., I have 3 sagging power outlets in the corridor and 1 broken ceiling light in the bedroom.") },
            modifier = Modifier
                .fillMaxWidth()
                .height(110.dp)
                .testTag("cost_details_input"),
            maxLines = 4,
            shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { viewModel.generateCostEstimate(details, selectedCategory) },
            enabled = details.isNotBlank() && !isEstimating,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .testTag("generate_estimate_button"),
            shape = RoundedCornerShape(12.dp)
        ) {
            if (isEstimating) {
                CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Analyzing Market Pricing...")
            } else {
                Icon(Icons.Default.Calculate, contentDescription = "Calculate")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Generate Smart Estimate")
            }
        }

        if (quote.isNotEmpty()) {
            Spacer(modifier = Modifier.height(24.dp))
            Card(
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Receipt, contentDescription = "Receipt", tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Itemized Diagnostic Bill",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = quote,
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Button(
                        onClick = {
                            viewModel.setActiveCategory(selectedCategory)
                            viewModel.navigateTo("booking_flow")
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(45.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.ShoppingCart, contentDescription = "Book")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Auto-Book Certified Service Now")
                    }
                }
            }
        }
    }
}

// ==========================================
// TAB 3: SMART SCHEDULING
// ==========================================
@Composable
fun AiScheduleTab(viewModel: AppViewModel) {
    var urgency by remember { mutableStateOf("Urgent (Within 12 hours)") }
    var dateChoice by remember { mutableStateOf("Today, Jul 15") }
    
    val urgencies = listOf("Regular (2-3 days)", "Urgent (Within 12 hours)", "Emergency (Immediate)")
    val dates = listOf("Today, Jul 15", "Tomorrow, Jul 16", "Friday, Jul 17")

    val scheduleReport by viewModel.smartScheduleRecommendation.collectAsState()
    val isScheduling by viewModel.isScheduling.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "AI Smart Schedule Optimizer",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "By correlating traffic logs, expert proximity, and off-peak loads, we recommend the highest probability prompt delivery slots.",
            fontSize = 12.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(text = "1. Select Urgency Level", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Spacer(modifier = Modifier.height(8.dp))
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            urgencies.forEach { lvl ->
                val isSelected = urgency == lvl
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant)
                        .clickable { urgency = lvl }
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(selected = isSelected, onClick = { urgency = lvl })
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = lvl, fontSize = 13.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(text = "2. Preferred Dispatch Day", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Row(
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            dates.forEach { dt ->
                val isSelected = dateChoice == dt
                FilterChip(
                    selected = isSelected,
                    onClick = { dateChoice = dt },
                    label = { Text(dt) }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { viewModel.generateSmartSchedule(urgency, dateChoice) },
            enabled = !isScheduling,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .testTag("optimize_schedule_button"),
            shape = RoundedCornerShape(12.dp)
        ) {
            if (isScheduling) {
                CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Analyzing Dispatch standby logs...")
            } else {
                Icon(Icons.Default.DateRange, contentDescription = "Optimize")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Optimize Dispatch Window")
            }
        }

        if (scheduleReport.isNotEmpty()) {
            Spacer(modifier = Modifier.height(24.dp))
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = "AI", tint = MaterialTheme.colorScheme.tertiary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Optimized Dispatch Advisory",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = MaterialTheme.colorScheme.onTertiaryContainer
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = scheduleReport,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onTertiaryContainer
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        ScheduleBadge("98% On-Time", Icons.Default.Timelapse)
                        ScheduleBadge("₹100 Off-Peak Surcharge Saved", Icons.Default.Savings)
                    }
                }
            }
        }
    }
}

@Composable
fun ScheduleBadge(text: String, icon: ImageVector) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(Color.White.copy(alpha = 0.5f))
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.primary)
        Spacer(modifier = Modifier.width(4.dp))
        Text(text = text, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}

// ==========================================
// TAB 4: PREDICTIVE MAINTENANCE
// ==========================================
@Composable
fun AiPredictiveTab(viewModel: AppViewModel) {
    var hvacAge by remember { mutableStateOf(2f) }
    var plumbingAge by remember { mutableStateOf(3f) }
    var electricalAge by remember { mutableStateOf(4f) }

    val report by viewModel.predictiveMaintenanceAnalysis.collectAsState()
    val isScanning by viewModel.isAnalyzingMaintenance.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "AI System Health & Predictive Maintenance Scanner",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Identify latent wear-and-tear risks before they trigger catastrophic structural failures or water damages.",
            fontSize = 12.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(text = "HVAC / Air Conditioning System Age: ${hvacAge.toInt()} Years", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Slider(
            value = hvacAge,
            onValueChange = { hvacAge = it },
            valueRange = 0f..10f,
            steps = 9
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(text = "Bathroom Plumbing / Valves Age: ${plumbingAge.toInt()} Years", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Slider(
            value = plumbingAge,
            onValueChange = { plumbingAge = it },
            valueRange = 0f..15f,
            steps = 14
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(text = "Main Electrical DB Board Age: ${electricalAge.toInt()} Years", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Slider(
            value = electricalAge,
            onValueChange = { electricalAge = it },
            valueRange = 0f..20f,
            steps = 19
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = { viewModel.runPredictiveMaintenanceScan(hvacAge.toInt().toString(), plumbingAge.toInt().toString(), electricalAge.toInt().toString()) },
            enabled = !isScanning,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .testTag("run_maintenance_scan_button"),
            shape = RoundedCornerShape(12.dp)
        ) {
            if (isScanning) {
                CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Running Diagnostic Matrix Scan...")
            } else {
                Icon(Icons.Default.Security, contentDescription = "Scan")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Run System Diagnostic Risk Assessment")
            }
        }

        if (report.isNotEmpty()) {
            Spacer(modifier = Modifier.height(24.dp))
            Card(
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.tertiary.copy(alpha = 0.3f)),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.HealthAndSafety, contentDescription = "Health", tint = MaterialTheme.colorScheme.tertiary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "AI Home Health Prognostic",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = MaterialTheme.colorScheme.tertiary
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = report,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
    }
}

// ==========================================
// TAB 5: AI IMAGE RECOGNITION (COMPUTER VISION FAULTS)
// ==========================================
@Composable
fun AiVisionTab(viewModel: AppViewModel) {
    var selectedScenario by remember { mutableStateOf("Electrical Sockets Outlets") }
    val scenarios = listOf("Electrical Sockets Outlets", "Oxidized Water Pipe Joint", "AC Condenser Fins Block", "Drywall Damage Fissure")
    
    val report by viewModel.imageAnalysisResult.collectAsState()
    val isAnalyzing by viewModel.isAnalyzingImage.collectAsState()

    val context = LocalContext.current
    var diagnosticBitmap by remember { mutableStateOf<Bitmap?>(null) }

    // Re-generate Mock Bitmap when Scenario Changes
    LaunchedEffect(selectedScenario) {
        val width = 600
        val height = 400
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        
        val bgPaint = Paint().apply { color = android.graphics.Color.DKGRAY }
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), bgPaint)

        val textPaint = Paint().apply {
            color = android.graphics.Color.WHITE
            textSize = 28f
            isAntiAlias = true
            textAlign = Paint.Align.CENTER
        }
        val faultPaint = Paint().apply {
            color = android.graphics.Color.RED
            strokeWidth = 5f
            style = Paint.Style.STROKE
        }

        when (selectedScenario) {
            "Electrical Sockets Outlets" -> {
                // Draw Socket Outlets
                val socketPaint = Paint().apply { color = android.graphics.Color.LTGRAY }
                canvas.drawRoundRect(200f, 120f, 400f, 280f, 20f, 20f, socketPaint)
                canvas.drawCircle(260f, 200f, 8f, Paint().apply { color = android.graphics.Color.BLACK })
                canvas.drawCircle(340f, 200f, 8f, Paint().apply { color = android.graphics.Color.BLACK })
                canvas.drawCircle(300f, 160f, 10f, Paint().apply { color = android.graphics.Color.BLACK })
                
                // Draw Burnt Spot
                val burntPaint = Paint().apply { color = android.graphics.Color.BLACK }
                canvas.drawCircle(300f, 180f, 22f, burntPaint)
                canvas.drawText("burnt outline defect area", 300f, 330f, textPaint)
                
                // Red Fault Box
                canvas.drawRect(180f, 100f, 420f, 300f, faultPaint)
            }
            "Oxidized Water Pipe Joint" -> {
                // Draw Pipe Joint
                val pipePaint = Paint().apply { color = android.graphics.Color.GRAY }
                canvas.drawRect(100f, 180f, 500f, 220f, pipePaint)
                canvas.drawRect(280f, 160f, 320f, 240f, Paint().apply { color = android.graphics.Color.LTGRAY })
                
                // Leak & Rust Spot
                val rustPaint = Paint().apply { color = android.graphics.Color.rgb(180, 100, 30) }
                canvas.drawCircle(300f, 200f, 25f, rustPaint)
                canvas.drawCircle(300f, 200f, 10f, Paint().apply { color = android.graphics.Color.BLUE }) // Water drop
                canvas.drawText("micro joint fluid leak", 300f, 330f, textPaint)
                
                // Red Fault Box
                canvas.drawRect(250f, 140f, 350f, 260f, faultPaint)
            }
            "AC Condenser Fins Block" -> {
                // AC Fins
                val finPaint = Paint().apply { color = android.graphics.Color.LTGRAY; strokeWidth = 3f }
                for (x in 150..450 step 15) {
                    canvas.drawLine(x.toFloat(), 100f, x.toFloat(), 300f, finPaint)
                }
                // Dust patch
                val dirtPaint = Paint().apply { color = android.graphics.Color.rgb(120, 110, 90) }
                canvas.drawOval(200f, 150f, 400f, 250f, dirtPaint)
                canvas.drawText("coil thermal blockage", 300f, 340f, textPaint)
                
                // Red Fault Box
                canvas.drawRect(180f, 120f, 420f, 280f, faultPaint)
            }
            else -> {
                // Wall Fissure
                val wallPaint = Paint().apply { color = android.graphics.Color.rgb(240, 235, 220) }
                canvas.drawRect(100f, 80f, 500f, 320f, wallPaint)
                
                val crackPaint = Paint().apply { color = android.graphics.Color.BLACK; strokeWidth = 4f }
                canvas.drawLine(200f, 120f, 280f, 180f, crackPaint)
                canvas.drawLine(280f, 180f, 320f, 280f, crackPaint)
                canvas.drawText("sub-structural drywall stress", 300f, 345f, textPaint)
                
                // Red Fault Box
                canvas.drawRect(150f, 100f, 350f, 300f, faultPaint)
            }
        }
        diagnosticBitmap = bitmap
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "AI Vision-Based Fault Diagnostic Desk",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Simulate snapping or uploading a photo of your damaged home appliance/wiring, and our Computer Vision module will analyze the issue.",
            fontSize = 12.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(text = "1. Choose Diagnostic Scenario", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            scenarios.forEach { s ->
                val isSelected = selectedScenario == s
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedScenario = s },
                    label = { Text(s) }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Diagnostic Canvas Display
        Text(text = "Computer Vision Live Sandbox Scan", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Spacer(modifier = Modifier.height(8.dp))
        
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(240.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color.DarkGray),
            contentAlignment = Alignment.Center
        ) {
            diagnosticBitmap?.let { bmp ->
                Image(
                    bitmap = bmp.asImageBitmap(),
                    contentDescription = "Diagnostic Snapshot",
                    modifier = Modifier.fillMaxSize()
                )
            }
            
            // Scanner Bar Animation
            val infiniteTransition = rememberInfiniteTransition()
            val yOffset by infiniteTransition.animateFloat(
                initialValue = 0f,
                targetValue = 240f,
                animationSpec = infiniteRepeatable(
                    animation = tween(1500, easing = LinearEasing),
                    repeatMode = RepeatMode.Reverse
                )
            )

            if (isAnalyzing) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp)
                        .offset(y = yOffset.dp - 120.dp)
                        .background(Color.Red)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                diagnosticBitmap?.let { bmp ->
                    viewModel.analyzeFaultImage(bmp, "Perform vision-based repair analysis on $selectedScenario")
                }
            },
            enabled = diagnosticBitmap != null && !isAnalyzing,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .testTag("submit_vision_scan_button"),
            shape = RoundedCornerShape(12.dp)
        ) {
            if (isAnalyzing) {
                CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Analyzing Image Pixels...")
            } else {
                Icon(Icons.Default.PhotoCamera, contentDescription = "Analyze")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Initiate Computer Vision Diagnosis")
            }
        }

        if (report.isNotEmpty()) {
            Spacer(modifier = Modifier.height(24.dp))
            Card(
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.RemoveRedEye, contentDescription = "Eye", tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Diagnostic Report",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = report,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = {
                            val cat = when (selectedScenario) {
                                "Electrical Sockets Outlets" -> "Electrical"
                                "Oxidized Water Pipe Joint" -> "Plumbing"
                                "AC Condenser Fins Block" -> "HVAC"
                                else -> "Painting"
                            }
                            viewModel.setActiveCategory(cat)
                            viewModel.navigateTo("booking_flow")
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(45.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.CalendarToday, contentDescription = "Book")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Auto-Book Diagnostic Dispatch")
                    }
                }
            }
        }
    }
}
