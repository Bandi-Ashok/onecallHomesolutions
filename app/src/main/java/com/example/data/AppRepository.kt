package com.example.data

import kotlinx.coroutines.flow.Flow

class AppRepository(private val dao: AppDao) {
    // Bookings
    val allBookings: Flow<List<Booking>> = dao.getAllBookings()
    
    fun getBookingById(id: Int): Flow<Booking?> = dao.getBookingById(id)

    suspend fun insertBooking(booking: Booking): Long = dao.insertBooking(booking)

    suspend fun updateBooking(booking: Booking) = dao.updateBooking(booking)

    suspend fun deleteBooking(booking: Booking) = dao.deleteBooking(booking)

    // Product Orders
    val allOrders: Flow<List<ProductOrder>> = dao.getAllOrders()

    suspend fun insertOrder(order: ProductOrder) = dao.insertOrder(order)

    // Wallet Transactions
    val allTransactions: Flow<List<WalletTransaction>> = dao.getAllTransactions()

    suspend fun insertTransaction(transaction: WalletTransaction) = dao.insertTransaction(transaction)

    // Coupons
    val allCoupons: Flow<List<Coupon>> = dao.getAllCoupons()

    suspend fun insertCoupon(coupon: Coupon) = dao.insertCoupon(coupon)

    suspend fun updateCoupon(coupon: Coupon) = dao.updateCoupon(coupon)

    // AMC Contracts
    val allAmcContracts: Flow<List<AmcContract>> = dao.getAllAmcContracts()

    suspend fun insertAmcContract(contract: AmcContract) = dao.insertAmcContract(contract)

    suspend fun updateAmcContract(contract: AmcContract) = dao.updateAmcContract(contract)

    // Notifications
    val allNotifications: Flow<List<Notification>> = dao.getAllNotifications()

    suspend fun insertNotification(notification: Notification) = dao.insertNotification(notification)

    suspend fun markNotificationAsRead(id: Int) = dao.markNotificationAsRead(id)

    suspend fun markAllNotificationsAsRead() = dao.markAllNotificationsAsRead()

    // Wishlist
    val wishlistItems: Flow<List<WishlistItem>> = dao.getWishlistItems()

    suspend fun insertWishlistItem(item: WishlistItem) = dao.insertWishlistItem(item)

    suspend fun deleteWishlistItemByServiceName(serviceName: String) = dao.deleteWishlistItemByServiceName(serviceName)

    // User Profile
    val userProfile: Flow<UserProfile?> = dao.getUserProfile()

    suspend fun insertUserProfile(profile: UserProfile) = dao.insertUserProfile(profile)

    // Worker Profile
    val workerProfile: Flow<WorkerProfile?> = dao.getWorkerProfile()

    suspend fun insertWorkerProfile(profile: WorkerProfile) = dao.insertWorkerProfile(profile)

    suspend fun updateWorkerProfile(profile: WorkerProfile) = dao.updateWorkerProfile(profile)

    // Job Offers
    val allJobOffers: Flow<List<JobOffer>> = dao.getAllJobOffers()

    fun getJobOfferById(id: Int): Flow<JobOffer?> = dao.getJobOfferById(id)

    suspend fun insertJobOffer(offer: JobOffer): Long = dao.insertJobOffer(offer)

    suspend fun updateJobOffer(offer: JobOffer) = dao.updateJobOffer(offer)

    suspend fun deleteJobOffer(offer: JobOffer) = dao.deleteJobOffer(offer)

    // Attendance Logs
    val allAttendanceLogs: Flow<List<AttendanceLog>> = dao.getAllAttendanceLogs()

    suspend fun insertAttendanceLog(log: AttendanceLog): Long = dao.insertAttendanceLog(log)

    suspend fun updateAttendanceLog(log: AttendanceLog) = dao.updateAttendanceLog(log)

    // Audit Logs
    val allAuditLogs: Flow<List<DatabaseAuditTrail>> = dao.getAllAuditLogs()

    suspend fun insertAuditLog(log: DatabaseAuditTrail): Long = dao.insertAuditLog(log)

    suspend fun logAuditEvent(tableName: String, recordId: String, actionType: String, changeDetail: String, operator: String = "SYSTEM") {
        val auditRecord = DatabaseAuditTrail(
            tableName = tableName,
            recordId = recordId,
            actionType = actionType,
            changeDetail = changeDetail,
            operator = operator
        )
        dao.insertAuditLog(auditRecord)
    }

    // Chat Messages
    fun getChatMessagesForBooking(bookingId: Int): Flow<List<ChatMessage>> = dao.getChatMessagesForBooking(bookingId)

    suspend fun insertChatMessage(message: ChatMessage): Long {
        logAuditEvent("chat_messages", "NEW", "INSERT", "Inserted chat message: '${message.messageText}' by ${message.senderRole}")
        return dao.insertChatMessage(message)
    }

    // Worker Realtime GPS Location
    fun getWorkerLocation(workerId: Int): Flow<WorkerLocation?> = dao.getWorkerLocation(workerId)

    suspend fun updateWorkerLocation(location: WorkerLocation) {
        dao.insertOrUpdateWorkerLocation(location)
    }

    // Payment Transactions
    fun getAllPaymentTransactions(): Flow<List<PaymentTransaction>> = dao.getAllPaymentTransactions()

    suspend fun insertPaymentTransaction(transaction: PaymentTransaction): Long {
        logAuditEvent("payment_transactions", "NEW", "INSERT", "Inserted payment transaction: Amount ${transaction.totalAmount} using ${transaction.paymentMethod}")
        return dao.insertPaymentTransaction(transaction)
    }

    suspend fun getPaymentTransactionById(id: Int): PaymentTransaction? = dao.getPaymentTransactionById(id)

    suspend fun getPaymentTransactionByBookingId(bookingId: Int): PaymentTransaction? = dao.getPaymentTransactionByBookingId(bookingId)
}
