package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import com.google.android.gms.location.*
import android.os.Looper
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import android.graphics.Bitmap


class AppViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application)
    private val repository = AppRepository(database.appDao())

    init {
        com.example.backend.BackendServer.start(application, repository)
    }

    // 1. Data Streams
    val bookings: StateFlow<List<Booking>> = repository.allBookings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val orders: StateFlow<List<ProductOrder>> = repository.allOrders
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transactions: StateFlow<List<WalletTransaction>> = repository.allTransactions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val coupons: StateFlow<List<Coupon>> = repository.allCoupons
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val amcContracts: StateFlow<List<AmcContract>> = repository.allAmcContracts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val notifications: StateFlow<List<Notification>> = repository.allNotifications
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val wishlist: StateFlow<List<WishlistItem>> = repository.wishlistItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val profile: StateFlow<UserProfile?> = repository.userProfile
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // 2. UI Navigation & Filtering State
    private val _currentRoute = MutableStateFlow("home")
    val currentRoute: StateFlow<String> = _currentRoute.asStateFlow()

    private val _backstack = MutableStateFlow<List<String>>(listOf("home"))
    val backstack: StateFlow<List<String>> = _backstack.asStateFlow()

    private val _activeCategory = MutableStateFlow("Electrical")
    val activeCategory: StateFlow<String> = _activeCategory.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedBookingId = MutableStateFlow<Int?>(null)
    val selectedBookingId: StateFlow<Int?> = _selectedBookingId.asStateFlow()

    // 3. Temporary Booking Flow State
    private val _tempBookingService = MutableStateFlow<String>("")
    val tempBookingService: StateFlow<String> = _tempBookingService.asStateFlow()

    private val _tempBookingPrice = MutableStateFlow<Double>(0.0)
    val tempBookingPrice: StateFlow<Double> = _tempBookingPrice.asStateFlow()

    private val _selectedProperty = MutableStateFlow("Home Address")
    val selectedProperty: StateFlow<String> = _selectedProperty.asStateFlow()

    private val _selectedDate = MutableStateFlow("Jul 15, 2026")
    val selectedDate: StateFlow<String> = _selectedDate.asStateFlow()

    private val _selectedTimeSlot = MutableStateFlow("10:00 AM - 12:00 PM")
    val selectedTimeSlot: StateFlow<String> = _selectedTimeSlot.asStateFlow()

    private val _appliedCoupon = MutableStateFlow<Coupon?>(null)
    val appliedCoupon: StateFlow<Coupon?> = _appliedCoupon.asStateFlow()

    private val _selectedPaymentMethod = MutableStateFlow("Digital Wallet")
    val selectedPaymentMethod: StateFlow<String> = _selectedPaymentMethod.asStateFlow()

    // 4. Settings State
    val enablePushNotifications = MutableStateFlow(true)
    val enableLocationPermission = MutableStateFlow(true)
    val selectedLanguage = MutableStateFlow("English")

    // Navigation Methods
    fun navigateTo(route: String) {
        _currentRoute.value = route
        val currentBackstack = _backstack.value.toMutableList()
        if (currentBackstack.lastOrNull() != route) {
            currentBackstack.add(route)
            _backstack.value = currentBackstack
        }
    }

    fun navigateBack() {
        val currentBackstack = _backstack.value.toMutableList()
        if (currentBackstack.size > 1) {
            currentBackstack.removeAt(currentBackstack.size - 1)
            _backstack.value = currentBackstack
            _currentRoute.value = currentBackstack.last()
        } else {
            _currentRoute.value = "home"
            _backstack.value = listOf("home")
        }
    }

    fun setActiveCategory(category: String) {
        _activeCategory.value = category
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun selectBooking(bookingId: Int) {
        _selectedBookingId.value = bookingId
    }

    fun startBookingFlow(serviceName: String, price: Double) {
        _tempBookingService.value = serviceName
        _tempBookingPrice.value = price
        _appliedCoupon.value = null
        navigateTo("booking_flow")
    }

    fun setProperty(property: String) {
        _selectedProperty.value = property
    }

    fun setDate(date: String) {
        _selectedDate.value = date
    }

    fun setTimeSlot(slot: String) {
        _selectedTimeSlot.value = slot
    }

    fun applyCouponCode(code: String): Boolean {
        val found = coupons.value.firstOrNull { it.code.equals(code, ignoreCase = true) && !it.isUsed }
        return if (found != null) {
            _appliedCoupon.value = found
            true
        } else {
            false
        }
    }

    fun removeCoupon() {
        _appliedCoupon.value = null
    }

    fun setPaymentMethod(method: String) {
        _selectedPaymentMethod.value = method
    }

    // Database Operation Methods
    fun createBookingFromFlow(onSuccess: (Int) -> Unit) {
        viewModelScope.launch {
            val discountAmount = _appliedCoupon.value?.discount ?: 0.0
            val finalPrice = maxOf(0.0, _tempBookingPrice.value - discountAmount)

            // Deduct from wallet if wallet is chosen
            val currentProfile = profile.value
            if (_selectedPaymentMethod.value == "Digital Wallet" && currentProfile != null) {
                if (currentProfile.walletBalance >= finalPrice) {
                    val updatedProfile = currentProfile.copy(
                        walletBalance = currentProfile.walletBalance - finalPrice
                    )
                    repository.insertUserProfile(updatedProfile)
                    repository.insertTransaction(
                        WalletTransaction(
                            amount = finalPrice,
                            type = "DEBIT",
                            description = "Payment for ${_tempBookingService.value}",
                            date = _selectedDate.value
                        )
                    )
                } else {
                    // Insufficient balance, fail-safe or pay via COD automatically
                    _selectedPaymentMethod.value = "Cash on Delivery"
                }
            }

            // Create booking object
            val newBooking = Booking(
                serviceName = _tempBookingService.value,
                category = _activeCategory.value,
                date = _selectedDate.value,
                timeSlot = _selectedTimeSlot.value,
                price = finalPrice,
                status = "Pending",
                address = currentProfile?.address ?: _selectedProperty.value,
                technicianName = "Marcus Vance (Assigned)",
                technicianPhone = "+1 (555) 765-4321",
                otp = "8841"
            )

            val bookingId = repository.insertBooking(newBooking).toInt()

            // If a digital payment gateway was used, log a successful PaymentTransaction
            val gatewayMethod = _selectedPaymentMethod.value
            if (gatewayMethod in listOf("Stripe Gateway", "Razorpay Payment", "UPI Instant", "Credit/Debit Card", "Digital Wallet")) {
                val gstAmount = finalPrice * 0.18
                val totalAmount = finalPrice + gstAmount
                val randomNum = (10000..99999).random()
                val invoiceNumber = "INV-2026-$randomNum"
                val prefix = when (gatewayMethod) {
                    "Stripe Gateway" -> "ch_stripe_"
                    "Razorpay Payment" -> "pay_rzp_"
                    "UPI Instant" -> "txn_upi_"
                    "Digital Wallet" -> "txn_wallet_"
                    else -> "txn_card_"
                }
                val transactionId = "$prefix${System.currentTimeMillis().toString().takeLast(6)}$randomNum"

                val transaction = PaymentTransaction(
                    bookingId = bookingId,
                    serviceName = _tempBookingService.value,
                    baseAmount = finalPrice,
                    gstAmount = gstAmount,
                    totalAmount = totalAmount,
                    paymentMethod = gatewayMethod,
                    transactionId = transactionId,
                    invoiceNumber = invoiceNumber,
                    status = "SUCCESS",
                    timestamp = System.currentTimeMillis()
                )
                repository.insertPaymentTransaction(transaction)

                repository.insertNotification(
                    Notification(
                        title = "Payment Successful ($gatewayMethod)",
                        message = "Paid Rs. ${String.format("%.2f", totalAmount)} (incl. 18% GST of Rs. ${String.format("%.2f", gstAmount)}) for '${_tempBookingService.value}'. Invoice: $invoiceNumber.",
                        timestamp = "Just Now"
                    )
                )
            }

            // Trigger Coupon Usage
            _appliedCoupon.value?.let { coupon ->
                repository.updateCoupon(coupon.copy(isUsed = true))
            }

            // Add Notification
            repository.insertNotification(
                Notification(
                    title = "Booking Confirmed: ${_tempBookingService.value}",
                    message = "Your service professional Marcus Vance is assigned. Scheduled on ${_selectedDate.value} at ${_selectedTimeSlot.value}. OTP code: 8841.",
                    timestamp = "Just Now"
                )
            )

            onSuccess(bookingId)
        }
    }

    fun triggerEmergencySOS(onSuccess: (Int) -> Unit) {
        viewModelScope.launch {
            // Deduct 0 (emergency flat dispatch) or record in booking
            val newBooking = Booking(
                serviceName = "24/7 Rapid Emergency SOS Response",
                category = "Emergency",
                date = "Jul 15, 2026",
                timeSlot = "Immediate (30-min window)",
                price = 0.0,
                status = "Dispatched",
                address = profile.value?.address ?: "Current GPS Location",
                technicianName = "Commander Jax (Rapid Team)",
                technicianPhone = "+1 (555) 911-0000",
                otp = "9921"
            )

            val bookingId = repository.insertBooking(newBooking).toInt()

            repository.insertNotification(
                Notification(
                    title = "🚨 EMERGENCY DESPATCH TRIGGERED",
                    message = "Rapid SOS Response Team dispatched. Estimated arrival: 18-24 mins. Monitor technician status live. Code: 9921.",
                    timestamp = "Just Now"
                )
            )

            onSuccess(bookingId)
        }
    }

    fun purchaseAmcPlan(planName: String, price: Double) {
        viewModelScope.launch {
            val newContract = AmcContract(
                planName = planName,
                price = price,
                startDate = "Jul 15, 2026",
                endDate = "Jul 15, 2027",
                status = "Active",
                inspectionsLeft = 4
            )
            repository.insertAmcContract(newContract)
            val amcId = (1000..9999).random()

            // Deduct from wallet if possible
            val currentProfile = profile.value
            val isPaidViaWallet = currentProfile != null && currentProfile.walletBalance >= price
            if (isPaidViaWallet) {
                repository.insertUserProfile(
                    currentProfile.copy(walletBalance = currentProfile.walletBalance - price)
                )
                repository.insertTransaction(
                    WalletTransaction(
                        amount = price,
                        type = "DEBIT",
                        description = "AMC Subscription: $planName",
                        date = "Jul 15, 2026"
                    )
                )
            }

            // Log successful PaymentTransaction for AMC Billing Subscription with 18% GST added
            val gstAmount = price * 0.18
            val totalAmount = price + gstAmount
            val randomNum = (10000..99999).random()
            val invoiceNumber = "INV-AMC-$randomNum"
            val transactionId = "sub_amc_${System.currentTimeMillis().toString().takeLast(6)}$randomNum"

            val transaction = PaymentTransaction(
                bookingId = null,
                amcContractId = amcId,
                serviceName = "AMC Subscription: $planName",
                baseAmount = price,
                gstAmount = gstAmount,
                totalAmount = totalAmount,
                paymentMethod = if (isPaidViaWallet) "Digital Wallet" else "Stripe Gateway",
                transactionId = transactionId,
                invoiceNumber = invoiceNumber,
                status = "SUCCESS",
                timestamp = System.currentTimeMillis()
            )
            repository.insertPaymentTransaction(transaction)

            repository.insertNotification(
                Notification(
                    title = "AMC Premium Activated!",
                    message = "You are now a registered 'Priority Guardian'. Plan: $planName is active. Invoice $invoiceNumber generated (Rs. ${String.format("%.2f", totalAmount)} paid).",
                    timestamp = "Just Now"
                )
            )
        }
    }

    fun addMoneyToWallet(amount: Double) {
        viewModelScope.launch {
            val currentProfile = profile.value
            if (currentProfile != null) {
                repository.insertUserProfile(
                    currentProfile.copy(walletBalance = currentProfile.walletBalance + amount)
                )
                repository.insertTransaction(
                    WalletTransaction(
                        amount = amount,
                        type = "CREDIT",
                        description = "Deposited funds to One Call Wallet",
                        date = "Jul 15, 2026"
                    )
                )
                repository.insertNotification(
                    Notification(
                        title = "Wallet Top-up Successful",
                        message = "Successfully credited $${String.format("%.2f", amount)} into your One Call Digital Wallet.",
                        timestamp = "Just Now"
                    )
                )
            }
        }
    }

    fun submitReview(bookingId: Int, rating: Float, reviewText: String) {
        viewModelScope.launch {
            bookings.value.firstOrNull { it.id == bookingId }?.let { booking ->
                val updated = booking.copy(rating = rating, reviewText = reviewText)
                repository.updateBooking(updated)

                repository.insertNotification(
                    Notification(
                        title = "Thank you for your feedback!",
                        message = "Your rating of ${rating.toInt()} stars for '${booking.serviceName}' has been submitted. This helps us maintain our Guardian Standard.",
                        timestamp = "Just Now"
                    )
                )
            }
        }
    }

    fun toggleWishlist(serviceName: String, category: String, price: Double) {
        viewModelScope.launch {
            val isPresent = wishlist.value.any { it.serviceName == serviceName }
            if (isPresent) {
                repository.deleteWishlistItemByServiceName(serviceName)
            } else {
                repository.insertWishlistItem(
                    WishlistItem(serviceName = serviceName, category = category, price = price)
                )
            }
        }
    }

    fun clearAllNotifications() {
        viewModelScope.launch {
            repository.markAllNotificationsAsRead()
        }
    }

    fun markNotificationAsRead(id: Int) {
        viewModelScope.launch {
            repository.markNotificationAsRead(id)
        }
    }

    fun updateProfileInfo(name: String, email: String, phone: String, address: String) {
        viewModelScope.launch {
            val currentProfile = profile.value
            if (currentProfile != null) {
                val updated = currentProfile.copy(
                    name = name,
                    email = email,
                    phone = phone,
                    address = address
                )
                repository.insertUserProfile(updated)

                repository.insertNotification(
                    Notification(
                        title = "Profile Updated Successfully",
                        message = "Your property dashboard details have been updated securely.",
                        timestamp = "Just Now"
                    )
                )
            }
        }
    }

    // Real-time Chat, GPS, and Worker tracking flows
    val currentWorkerLocation: StateFlow<WorkerLocation?> = repository.getWorkerLocation(1)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), WorkerLocation(1, 40.7250, -74.0150))

    fun getChatMessages(bookingId: Int): Flow<List<ChatMessage>> {
        return repository.getChatMessagesForBooking(bookingId)
    }

    fun sendChatMessage(bookingId: Int, senderRole: String, messageText: String) {
        viewModelScope.launch {
            val msg = ChatMessage(
                bookingId = bookingId,
                senderRole = senderRole,
                messageText = messageText
            )
            repository.insertChatMessage(msg)

            // Auto-reply simulation for a lifelike experience when customer texts technician
            if (senderRole == "CUSTOMER") {
                kotlinx.coroutines.delay(1200)
                val technicianReply = when {
                    messageText.contains("where", ignoreCase = true) || messageText.contains("location", ignoreCase = true) ->
                        "I am en-route! You can watch my real-time GPS coordinate and moving car marker live on your tracker screen."
                    messageText.contains("time", ignoreCase = true) || messageText.contains("eta", ignoreCase = true) ->
                        "My speed and current distance place my estimated arrival (ETA) within the next few minutes. See you soon!"
                    messageText.contains("hello", ignoreCase = true) || messageText.contains("hi", ignoreCase = true) ->
                        "Hello! Marcus Vance here. I am fully packed with safety tools and heading towards you."
                    messageText.contains("sos", ignoreCase = true) || messageText.contains("emergency", ignoreCase = true) ->
                        "Emergency dispatched. Maintaining emergency protocols. Stay secure."
                    else -> "Understood. Maintaining normal route protocols. I will text you immediately upon arriving."
                }
                repository.insertChatMessage(
                    ChatMessage(
                        bookingId = bookingId,
                        senderRole = "WORKER",
                        messageText = technicianReply
                    )
                )
                repository.insertNotification(
                    Notification(
                        title = "New Message: Marcus Vance",
                        message = technicianReply,
                        timestamp = "Just Now"
                    )
                )
            }
        }
    }

    private var movementJob: Job? = null

    fun startWorkerMovementSimulation(bookingId: Int) {
        movementJob?.cancel()
        movementJob = viewModelScope.launch {
            // Customer is at NYC default
            val customerLat = 40.7128
            val customerLng = -74.0060
            var currentLat = 40.7250
            var currentLng = -74.0150

            val steps = 25
            val latStep = (customerLat - currentLat) / steps
            val lngStep = (customerLng - currentLng) / steps

            for (i in 1..steps) {
                currentLat += latStep
                currentLng += lngStep

                val bearing = if (i < steps) {
                    Math.toDegrees(Math.atan2(latStep, lngStep)).toFloat()
                } else 0.0f

                repository.updateWorkerLocation(
                    WorkerLocation(
                        workerId = 1,
                        latitude = currentLat,
                        longitude = currentLng,
                        speed = 32.5 + (i % 4) * 2,
                        bearing = bearing,
                        lastUpdated = System.currentTimeMillis()
                    )
                )

                // Dynamic booking status triggers
                when (i) {
                    5 -> updateBookingStatusInBg(bookingId, "Dispatched")
                    10 -> updateBookingStatusInBg(bookingId, "Arrived")
                    18 -> updateBookingStatusInBg(bookingId, "In Progress")
                    steps -> updateBookingStatusInBg(bookingId, "Completed")
                }

                kotlinx.coroutines.delay(2000) // Update every 2 seconds for active movement
            }
        }
    }

    private suspend fun updateBookingStatusInBg(bookingId: Int, status: String) {
        bookings.value.firstOrNull { it.id == bookingId }?.let { booking ->
            if (booking.status != status) {
                val updated = booking.copy(status = status)
                repository.updateBooking(updated)

                repository.insertNotification(
                    Notification(
                        title = "Service Tracker Update",
                        message = "Your One Call technician is now: $status for '${booking.serviceName}'.",
                        timestamp = "Just Now"
                    )
                )
            }
        }
    }

    // Actual Android Fused Location integration for GPS updates
    private var locationCallback: LocationCallback? = null
    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(application)

    fun startRealGPSUpdates() {
        try {
            val locationRequest = LocationRequest.Builder(
                Priority.PRIORITY_HIGH_ACCURACY,
                5000L
            ).build()

            locationCallback = object : LocationCallback() {
                override fun onLocationResult(locationResult: LocationResult) {
                    val lastLoc = locationResult.lastLocation ?: return
                    viewModelScope.launch {
                        repository.updateWorkerLocation(
                            WorkerLocation(
                                workerId = 1,
                                latitude = lastLoc.latitude,
                                longitude = lastLoc.longitude,
                                speed = lastLoc.speed.toDouble() * 2.23694, // Convert m/s to mph
                                bearing = lastLoc.bearing,
                                lastUpdated = System.currentTimeMillis()
                            )
                        )
                    }
                }
            }

            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback!!,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            // No permission or missing client, gracefully continue
        }
    }

    fun stopRealGPSUpdates() {
        locationCallback?.let {
            fusedLocationClient.removeLocationUpdates(it)
        }
    }

    // Helper mock function to simulate technician moving status
    fun simulateTechnicianStatusUpdate(bookingId: Int, nextStatus: String) {
        viewModelScope.launch {
            bookings.value.firstOrNull { it.id == bookingId }?.let { booking ->
                val updated = booking.copy(status = nextStatus)
                repository.updateBooking(updated)

                repository.insertNotification(
                    Notification(
                        title = "Technician Status Update",
                        message = "Marcus Vance is now: $nextStatus for '${booking.serviceName}'.",
                        timestamp = "Just Now"
                    )
                )

                // If status changed to Dispatched, trigger real-time GPS movement simulation
                if (nextStatus == "Dispatched") {
                    startWorkerMovementSimulation(bookingId)
                }
            }
        }
    }

    // ==========================================
    // WORKER STATE FLOWS & OPERATIONS
    // ==========================================

    val workerProfile: StateFlow<WorkerProfile?> = repository.workerProfile
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val jobOffers: StateFlow<List<JobOffer>> = repository.allJobOffers
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val attendanceLogs: StateFlow<List<AttendanceLog>> = repository.allAttendanceLogs
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _selectedJobOfferId = MutableStateFlow<Int?>(null)
    val selectedJobOfferId: StateFlow<Int?> = _selectedJobOfferId.asStateFlow()

    private val _appMode = MutableStateFlow("customer") // "customer" or "worker"
    val appMode: StateFlow<String> = _appMode.asStateFlow()

    fun setAppMode(mode: String) {
        _appMode.value = mode
        if (mode == "worker") {
            navigateTo("worker_home")
        } else {
            navigateTo("home")
        }
    }

    fun selectJobOffer(id: Int?) {
        _selectedJobOfferId.value = id
    }

    fun toggleDutyStatus() {
        viewModelScope.launch {
            workerProfile.value?.let { profile ->
                val updated = profile.copy(isOnline = !profile.isOnline)
                repository.updateWorkerProfile(updated)
            }
        }
    }

    fun punchAttendance() {
        viewModelScope.launch {
            workerProfile.value?.let { profile ->
                val isCurrentlyIn = profile.isCheckedIn
                if (isCurrentlyIn) {
                    // Clock Out
                    val updatedProfile = profile.copy(
                        isCheckedIn = false,
                        checkOutTime = "05:30 PM"
                    )
                    repository.updateWorkerProfile(updatedProfile)

                    // Update latest log
                    attendanceLogs.value.firstOrNull()?.let { log ->
                        val updatedLog = log.copy(
                            punchOutTime = "05:30 PM",
                            totalHours = 9.0
                        )
                        repository.updateAttendanceLog(updatedLog)
                    }
                } else {
                    // Clock In
                    val updatedProfile = profile.copy(
                        isCheckedIn = true,
                        checkInTime = "08:30 AM",
                        checkOutTime = ""
                    )
                    repository.updateWorkerProfile(updatedProfile)

                    // Insert new log
                    repository.insertAttendanceLog(
                        AttendanceLog(
                            date = "Today",
                            punchInTime = "08:30 AM",
                            punchOutTime = "",
                            status = "PRESENT"
                        )
                    )
                }
            }
        }
    }

    fun submitKYC(docId: String, certType: String) {
        viewModelScope.launch {
            workerProfile.value?.let { profile ->
                val updated = profile.copy(
                    kycStatus = "PENDING_VERIFICATION",
                    kycDocumentId = docId,
                    kycCertificateType = certType
                )
                repository.updateWorkerProfile(updated)

                // Simulate background Union / Govt database validation and approval
                kotlinx.coroutines.delay(2500)
                val approved = updated.copy(kycStatus = "VERIFIED")
                repository.updateWorkerProfile(approved)
            }
        }
    }

    fun registerWorkerProfile(name: String, email: String, phone: String, trade: String) {
        viewModelScope.launch {
            val newProfile = WorkerProfile(
                id = 1,
                name = name,
                email = email,
                phone = phone,
                tradeCategory = trade,
                rating = 5.0f,
                totalJobsCompleted = 0,
                walletBalance = 0.0,
                todayEarnings = 0.0,
                isOnline = true,
                kycStatus = "NOT_STARTED",
                isCheckedIn = true,
                checkInTime = "09:00 AM"
            )
            repository.insertWorkerProfile(newProfile)
        }
    }

    fun acceptJobOffer(id: Int) {
        viewModelScope.launch {
            jobOffers.value.firstOrNull { it.id == id }?.let { offer ->
                val updated = offer.copy(status = "ACCEPTED")
                repository.updateJobOffer(updated)
                selectJobOffer(offer.id)
                navigateTo("worker_navigation")
            }
        }
    }

    fun rejectJobOffer(id: Int) {
        viewModelScope.launch {
            jobOffers.value.firstOrNull { it.id == id }?.let { offer ->
                val updated = offer.copy(status = "REJECTED")
                repository.updateJobOffer(updated)
            }
        }
    }

    fun verifyJobOTP(id: Int, otpCode: String): Boolean {
        var success = false
        jobOffers.value.firstOrNull { it.id == id }?.let { offer ->
            if (offer.otp == otpCode) {
                success = true
                viewModelScope.launch {
                    val updated = offer.copy(status = "OTP_VERIFIED")
                    repository.updateJobOffer(updated)
                }
            }
        }
        return success
    }

    fun uploadJobPhoto(id: Int, photoType: String) {
        viewModelScope.launch {
            jobOffers.value.firstOrNull { it.id == id }?.let { offer ->
                val updated = if (photoType == "BEFORE") {
                    offer.copy(
                        status = "IN_PROGRESS",
                        beforePhotoUri = "simulated_before_img_${System.currentTimeMillis()}"
                    )
                } else {
                    offer.copy(
                        status = "PHOTOS_UPLOADED",
                        afterPhotoUri = "simulated_after_img_${System.currentTimeMillis()}"
                    )
                }
                repository.updateJobOffer(updated)
            }
        }
    }

    fun completeJob(id: Int) {
        viewModelScope.launch {
            jobOffers.value.firstOrNull { it.id == id }?.let { offer ->
                val completedOffer = offer.copy(status = "COMPLETED")
                repository.updateJobOffer(completedOffer)

                // Update Worker stats and Wallet
                workerProfile.value?.let { profile ->
                    val updatedProfile = profile.copy(
                        walletBalance = profile.walletBalance + offer.estEarnings,
                        todayEarnings = profile.todayEarnings + offer.estEarnings,
                        totalJobsCompleted = profile.totalJobsCompleted + 1
                    )
                    repository.updateWorkerProfile(updatedProfile)
                }
            }
        }
    }

    fun withdrawWorkerEarnings(amount: Double): Boolean {
        var success = false
        workerProfile.value?.let { profile ->
            if (profile.walletBalance >= amount) {
                success = true
                viewModelScope.launch {
                    val updatedProfile = profile.copy(
                        walletBalance = profile.walletBalance - amount
                    )
                    repository.updateWorkerProfile(updatedProfile)
                }
            }
        }
        return success
    }

    // ==========================================
    // ADMIN STATE FLOWS & OPERATIONS
    // ==========================================

    private val _adminActiveTab = MutableStateFlow("Dashboard")
    val adminActiveTab: StateFlow<String> = _adminActiveTab.asStateFlow()

    fun setAdminActiveTab(tab: String) {
        _adminActiveTab.value = tab
    }

    // Dynamic Pricing settings
    private val _surgeMultiplier = MutableStateFlow(1.5)
    val surgeMultiplier: StateFlow<Double> = _surgeMultiplier.asStateFlow()

    private val _baseFee = MutableStateFlow(45.0)
    val baseFee: StateFlow<Double> = _baseFee.asStateFlow()

    private val _hourlyRate = MutableStateFlow(65.0)
    val hourlyRate: StateFlow<Double> = _hourlyRate.asStateFlow()

    fun updatePricingSettings(multiplier: Double, base: Double, hourly: Double) {
        _surgeMultiplier.value = multiplier
        _baseFee.value = base
        _hourlyRate.value = hourly
    }

    // Services Catalog
    data class AdminService(val id: Int, val name: String, val category: String, val price: Double, val isAvailable: Boolean)
    private val _adminServices = MutableStateFlow<List<AdminService>>(
        listOf(
            AdminService(1, "Emergency Circuit Breaker Fault", "Electrical", 64.0, true),
            AdminService(2, "Ceiling Fan Complete Wiring", "Electrical", 36.0, true),
            AdminService(3, "Full Apartment Deep Cleaning", "Cleaning", 110.0, true),
            AdminService(4, "Toilet Drain Unclogging", "Plumbing", 55.0, true),
            AdminService(5, "AC Evaporator Coil Repair", "HVAC", 180.0, true),
            AdminService(6, "Wall Drywall Patch & Finish", "Carpentry", 85.0, true)
        )
    )
    val adminServices: StateFlow<List<AdminService>> = _adminServices.asStateFlow()

    fun addNewService(name: String, category: String, price: Double) {
        val nextId = (_adminServices.value.maxOfOrNull { it.id } ?: 0) + 1
        _adminServices.value = _adminServices.value + AdminService(nextId, name, category, price, true)
    }

    fun toggleServiceAvailability(id: Int) {
        _adminServices.value = _adminServices.value.map {
            if (it.id == id) it.copy(isAvailable = !it.isAvailable) else it
        }
    }

    // Live SOS Alerts Dashboard
    data class SosAlert(
        val id: Int,
        val workerName: String,
        val trade: String,
        val clientName: String,
        val issueDescription: String,
        val severity: String, // "CRITICAL", "HIGH", "MEDIUM"
        val timestamp: String,
        val status: String // "ACTIVE", "DISPATCHED", "RESOLVED"
    )
    private val _sosAlerts = MutableStateFlow<List<SosAlert>>(
        listOf(
            SosAlert(
                id = 1,
                workerName = "Marcus Vance",
                trade = "Electrical",
                clientName = "Evelyn Sterling",
                issueDescription = "Live high-voltage short spark trigger inside utility room",
                severity = "CRITICAL",
                timestamp = "10 Mins Ago",
                status = "ACTIVE"
            ),
            SosAlert(
                id = 2,
                workerName = "Tyler Boone",
                trade = "Plumbing",
                clientName = "Sarah Jenkins",
                issueDescription = "Basement flash flooding, localized mains valve jammed",
                severity = "HIGH",
                timestamp = "32 Mins Ago",
                status = "DISPATCHED"
            )
        )
    )
    val sosAlerts: StateFlow<List<SosAlert>> = _sosAlerts.asStateFlow()

    fun resolveSosAlert(id: Int) {
        _sosAlerts.value = _sosAlerts.value.map {
            if (it.id == id) it.copy(status = "RESOLVED") else it
        }
    }

    fun updateSosStatus(id: Int, status: String) {
        _sosAlerts.value = _sosAlerts.value.map {
            if (it.id == id) it.copy(status = status) else it
        }
    }

    fun triggerSimulatedSos() {
        val nextId = (_sosAlerts.value.maxOfOrNull { it.id } ?: 0) + 1
        val dummySos = SosAlert(
            id = nextId,
            workerName = "Arthur Pendelton",
            trade = "HVAC",
            clientName = "Mayor Higgins",
            issueDescription = "Industrial refrigerant pipe pressure leak detected on-roof",
            severity = "CRITICAL",
            timestamp = "Just Now",
            status = "ACTIVE"
        )
        _sosAlerts.value = listOf(dummySos) + _sosAlerts.value
    }

    // Dynamic Coupon additions to DB
    fun createAdminCoupon(code: String, discount: Double, description: String) {
        viewModelScope.launch {
            repository.insertCoupon(
                Coupon(
                    code = code,
                    discount = discount,
                    description = description,
                    isUsed = false
                )
            )
        }
    }

    // Payout Batch Process Simulation
    private val _isPayoutBatchRunning = MutableStateFlow(false)
    val isPayoutBatchRunning: StateFlow<Boolean> = _isPayoutBatchRunning.asStateFlow()

    fun runPayoutBatch() {
        viewModelScope.launch {
            _isPayoutBatchRunning.value = true
            kotlinx.coroutines.delay(2000)
            _isPayoutBatchRunning.value = false
        }
    }

    // Vendor Inventory management
    data class VendorInventoryItem(val id: Int, val partName: String, val vendorName: String, val stockLevel: Int, val unitCost: Double, val status: String)
    private val _vendorInventory = MutableStateFlow<List<VendorInventoryItem>>(
        listOf(
            VendorInventoryItem(1, "12-Gauge Copper Romex Wire (50ft)", "Metro Wire Supplies", 42, 34.50, "IN_STOCK"),
            VendorInventoryItem(2, "Brass Compression Ball Valve (3/4\")", "Apex Plumbing Wholesale", 12, 11.20, "LOW_STOCK"),
            VendorInventoryItem(3, "Carrier HVAC Pleated Filter (16x25x1)", "Climate Distribution Inc", 120, 8.90, "IN_STOCK"),
            VendorInventoryItem(4, "Standard Toggle Light Switch (White)", "Metro Wire Supplies", 8, 1.45, "CRITICAL_LOW")
        )
    )
    val vendorInventory: StateFlow<List<VendorInventoryItem>> = _vendorInventory.asStateFlow()

    fun orderVendorStock(id: Int, quantity: Int) {
        _vendorInventory.value = _vendorInventory.value.map { item ->
            if (item.id == id) {
                val newStock = item.stockLevel + quantity
                item.copy(
                    stockLevel = newStock,
                    status = if (newStock > 15) "IN_STOCK" else if (newStock > 5) "LOW_STOCK" else "CRITICAL_LOW"
                )
            } else item
        }
    }

    fun updateWorkerKycStatus(workerId: Int, status: String) {
        viewModelScope.launch {
            workerProfile.value?.let { profile ->
                if (profile.id == workerId) {
                    val updated = profile.copy(kycStatus = status)
                    repository.updateWorkerProfile(updated)
                }
            }
        }
    }

    // ==========================================
    // PRODUCTION PAYMENTS & REFUNDS
    // ==========================================
    val paymentTransactions: StateFlow<List<PaymentTransaction>> = repository.getAllPaymentTransactions()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun processPayment(
        bookingId: Int?,
        amcContractId: Int?,
        serviceName: String,
        baseAmount: Double,
        paymentMethod: String,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            val gstAmount = baseAmount * 0.18
            val totalAmount = baseAmount + gstAmount
            val randomNum = (10000..99999).random()
            val invoiceNumber = "INV-2026-$randomNum"

            val prefix = when (paymentMethod.uppercase()) {
                "STRIPE" -> "ch_stripe_"
                "RAZORPAY" -> "pay_rzp_"
                "UPI" -> "txn_upi_"
                else -> "txn_card_"
            }
            val transactionId = "$prefix${System.currentTimeMillis().toString().takeLast(6)}$randomNum"

            val transaction = PaymentTransaction(
                bookingId = bookingId,
                amcContractId = amcContractId,
                serviceName = serviceName,
                baseAmount = baseAmount,
                gstAmount = gstAmount,
                totalAmount = totalAmount,
                paymentMethod = paymentMethod,
                transactionId = transactionId,
                invoiceNumber = invoiceNumber,
                status = "SUCCESS",
                timestamp = System.currentTimeMillis()
            )

            repository.insertPaymentTransaction(transaction)

            // If it is an AMC plan, activate the plan locally
            if (amcContractId != null) {
                // If there's an existing AMC activation flow, we can do it here or update its status
            }

            // Insert notification
            repository.insertNotification(
                Notification(
                    title = "Payment Successful (${paymentMethod})",
                    message = "Received Rs. ${String.format("%.2f", totalAmount)} (incl. 18% GST of Rs. ${String.format("%.2f", gstAmount)}) for '$serviceName'. Invoice: $invoiceNumber.",
                    timestamp = "Just Now"
                )
            )

            // Optionally credit worker or set booking paid if applicable
            if (bookingId != null) {
                bookings.value.firstOrNull { it.id == bookingId }?.let { booking ->
                    // Set booking as Dispatched or paid
                    val updated = booking.copy(status = "Dispatched")
                    repository.updateBooking(updated)
                    // Trigger movement
                    startWorkerMovementSimulation(bookingId)
                }
            }

            onSuccess()
        }
    }

    fun processRefund(transactionId: String, reason: String) {
        viewModelScope.launch {
            // Find transaction from active state flow
            paymentTransactions.value.firstOrNull { it.transactionId == transactionId }?.let { txn ->
                val updatedTxn = txn.copy(
                    status = "REFUNDED",
                    refundAmount = txn.totalAmount,
                    refundReason = reason
                )
                repository.insertPaymentTransaction(updatedTxn)

                // Refund to user wallet balance for simulation fidelity or update status
                val currentProfile = profile.value
                if (currentProfile != null) {
                    repository.insertUserProfile(
                        currentProfile.copy(walletBalance = currentProfile.walletBalance + txn.totalAmount)
                    )
                }

                repository.insertNotification(
                    Notification(
                        title = "Refund Dispatched Successful",
                        message = "Refund of Rs. ${String.format("%.2f", txn.totalAmount)} successfully credited for transaction $transactionId.",
                        timestamp = "Just Now"
                    )
                )
            }
        }
    }

    // ==========================================
    // ONE CALL AI GEN-INTELLIGENCE DESK STATES & ACTIONS
    // ==========================================

    // 1. AI Chatbot & Voice Assistant States
    private val _aiChatMessages = MutableStateFlow<List<Pair<String, String>>>(
        listOf("AI" to "Hello! I am your One Call AI Home Management Copilot. I can assist you with diagnosing faults, recommending services, running predictive checks, and estimating costs. How can I help make your home safer today?")
    )
    val aiChatMessages: StateFlow<List<Pair<String, String>>> = _aiChatMessages.asStateFlow()

    private val _isAiThinking = MutableStateFlow(false)
    val isAiThinking: StateFlow<Boolean> = _isAiThinking.asStateFlow()

    private val _isListening = MutableStateFlow(false)
    val isListening: StateFlow<Boolean> = _isListening.asStateFlow()

    private val _isSpeaking = MutableStateFlow(false)
    val isSpeaking: StateFlow<Boolean> = _isSpeaking.asStateFlow()

    fun sendAiChatMessage(userMessage: String) {
        if (userMessage.isBlank()) return
        
        // Append user message
        val currentList = _aiChatMessages.value.toMutableList()
        currentList.add("User" to userMessage)
        _aiChatMessages.value = currentList

        _isAiThinking.value = true
        viewModelScope.launch {
            val response = GeminiService.generateContent(
                prompt = userMessage,
                systemInstruction = "You are One Call AI, a safety-first professional home maintenance assistant. Be concise, expert, practical, and design-focused."
            )
            val updatedList = _aiChatMessages.value.toMutableList()
            updatedList.add("AI" to response)
            _aiChatMessages.value = updatedList
            _isAiThinking.value = false
        }
    }

    fun startVoiceListeningSimulate(onSpokenText: (String) -> Unit) {
        _isListening.value = true
        viewModelScope.launch {
            delay(2500) // Simulate listening to speech
            _isListening.value = false
            // Smart quick speech inputs based on context
            val speechPrompts = listOf(
                "I need a cost estimate for fixing three leaking faucets in the master bathroom.",
                "Can you recommend the best slot to schedule a deep kitchen cleaning this week?",
                "Analyze the safety risk index for my 3-year-old HVAC system.",
                "Suggest pre-monsoon preventative services for electrical wiring."
            )
            val detectedSpeech = speechPrompts.random()
            onSpokenText(detectedSpeech)
        }
    }

    fun clearAiChat() {
        _aiChatMessages.value = listOf(
            "AI" to "Hello! I am your One Call AI Home Management Copilot. Chat history cleared. How can I assist you today?"
        )
    }

    // 2. AI Cost Estimator States
    private val _estimatedQuote = MutableStateFlow("")
    val estimatedQuote: StateFlow<String> = _estimatedQuote.asStateFlow()

    private val _isEstimating = MutableStateFlow(false)
    val isEstimating: StateFlow<Boolean> = _isEstimating.asStateFlow()

    fun generateCostEstimate(jobDetails: String, category: String) {
        if (jobDetails.isBlank()) return
        _isEstimating.value = true
        _estimatedQuote.value = ""
        viewModelScope.launch {
            val prompt = "Generate an itemized cost estimate for a home repair job. Category: $category. Job Details: $jobDetails. Output a professional billing format with material cost, labor fee, 18% GST tax breakdown, and recommended package name."
            val response = GeminiService.generateContent(prompt)
            _estimatedQuote.value = response
            _isEstimating.value = false
        }
    }

    // 3. Smart Scheduling States
    private val _smartScheduleRecommendation = MutableStateFlow("")
    val smartScheduleRecommendation: StateFlow<String> = _smartScheduleRecommendation.asStateFlow()

    private val _isScheduling = MutableStateFlow(false)
    val isScheduling: StateFlow<Boolean> = _isScheduling.asStateFlow()

    fun generateSmartSchedule(urgencyLevel: String, preferredDate: String) {
        _isScheduling.value = true
        _smartScheduleRecommendation.value = ""
        viewModelScope.launch {
            val prompt = "Find and recommend the most optimal dispatch slot for a service. Urgency Level: $urgencyLevel, Preferred Date: $preferredDate. Consider travel patterns, standard peak congestion hours, and technician standby logs. Explain why the slot was chosen and offer an off-peak price benefit if applicable."
            val response = GeminiService.generateContent(prompt)
            _smartScheduleRecommendation.value = response
            _isScheduling.value = false
        }
    }

    // 4. Predictive Maintenance States
    private val _predictiveMaintenanceAnalysis = MutableStateFlow("")
    val predictiveMaintenanceAnalysis: StateFlow<String> = _predictiveMaintenanceAnalysis.asStateFlow()

    private val _isAnalyzingMaintenance = MutableStateFlow(false)
    val isAnalyzingMaintenance: StateFlow<Boolean> = _isAnalyzingMaintenance.asStateFlow()

    fun runPredictiveMaintenanceScan(hvacAge: String, plumbingAge: String, electricalAge: String) {
        _isAnalyzingMaintenance.value = true
        _predictiveMaintenanceAnalysis.value = ""
        viewModelScope.launch {
            val prompt = "Perform a home system predictive maintenance and safety risk index analysis. HVAC system age: $hvacAge years, plumbing plumbingAge: $plumbingAge years, electrical distribution age: $electricalAge years. Output a list of systems with risk ratings, clear diagnosis, and recommended preventative interventions."
            val response = GeminiService.generateContent(prompt)
            _predictiveMaintenanceAnalysis.value = response
            _isAnalyzingMaintenance.value = false
        }
    }

    // 5. Image Fault Recognition States
    private val _imageAnalysisResult = MutableStateFlow("")
    val imageAnalysisResult: StateFlow<String> = _imageAnalysisResult.asStateFlow()

    private val _isAnalyzingImage = MutableStateFlow(false)
    val isAnalyzingImage: StateFlow<Boolean> = _isAnalyzingImage.asStateFlow()

    fun analyzeFaultImage(bitmap: Bitmap, promptQuery: String) {
        _isAnalyzingImage.value = true
        _imageAnalysisResult.value = ""
        viewModelScope.launch {
            val prompt = if (promptQuery.isBlank()) {
                "Perform a computer vision diagnostic scan of this fault image. Identify the defect or issue, state severity index (LOW, MEDIUM, HIGH), give a detailed technical diagnosis, and recommend the correct One Call repair service category with estimated cost."
            } else {
                promptQuery
            }
            val response = GeminiService.generateImageAnalysis(prompt, bitmap)
            _imageAnalysisResult.value = response
            _isAnalyzingImage.value = false
        }
    }
}


