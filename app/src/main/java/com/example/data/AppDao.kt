package com.example.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface AppDao {
    // Bookings
    @Query("SELECT * FROM bookings ORDER BY id DESC")
    fun getAllBookings(): Flow<List<Booking>>

    @Query("SELECT * FROM bookings WHERE id = :id")
    fun getBookingById(id: Int): Flow<Booking?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBooking(booking: Booking): Long

    @Update
    suspend fun updateBooking(booking: Booking)

    @Delete
    suspend fun deleteBooking(booking: Booking)

    // Product Orders
    @Query("SELECT * FROM product_orders ORDER BY id DESC")
    fun getAllOrders(): Flow<List<ProductOrder>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: ProductOrder)

    // Wallet Transactions
    @Query("SELECT * FROM wallet_transactions ORDER BY id DESC")
    fun getAllTransactions(): Flow<List<WalletTransaction>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: WalletTransaction)

    // Coupons
    @Query("SELECT * FROM coupons")
    fun getAllCoupons(): Flow<List<Coupon>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCoupon(coupon: Coupon)

    @Update
    suspend fun updateCoupon(coupon: Coupon)

    // AMC Contracts
    @Query("SELECT * FROM amc_contracts ORDER BY id DESC")
    fun getAllAmcContracts(): Flow<List<AmcContract>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAmcContract(contract: AmcContract)

    @Update
    suspend fun updateAmcContract(contract: AmcContract)

    // Notifications
    @Query("SELECT * FROM notifications ORDER BY id DESC")
    fun getAllNotifications(): Flow<List<Notification>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: Notification)

    @Query("UPDATE notifications SET isRead = 1 WHERE id = :id")
    suspend fun markNotificationAsRead(id: Int)

    @Query("UPDATE notifications SET isRead = 1")
    suspend fun markAllNotificationsAsRead()

    // Wishlist
    @Query("SELECT * FROM wishlist_items ORDER BY id DESC")
    fun getWishlistItems(): Flow<List<WishlistItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWishlistItem(item: WishlistItem)

    @Query("DELETE FROM wishlist_items WHERE serviceName = :serviceName")
    suspend fun deleteWishlistItemByServiceName(serviceName: String)

    // User Profile
    @Query("SELECT * FROM user_profile WHERE id = 1 LIMIT 1")
    fun getUserProfile(): Flow<UserProfile?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUserProfile(profile: UserProfile)

    // ==========================================
    // WORKER ENTITIES
    // ==========================================

    @Query("SELECT * FROM worker_profile WHERE id = 1 LIMIT 1")
    fun getWorkerProfile(): Flow<WorkerProfile?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkerProfile(profile: WorkerProfile)

    @Update
    suspend fun updateWorkerProfile(profile: WorkerProfile)

    @Query("SELECT * FROM job_offers ORDER BY id DESC")
    fun getAllJobOffers(): Flow<List<JobOffer>>

    @Query("SELECT * FROM job_offers WHERE id = :id LIMIT 1")
    fun getJobOfferById(id: Int): Flow<JobOffer?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertJobOffer(offer: JobOffer): Long

    @Update
    suspend fun updateJobOffer(offer: JobOffer)

    @Delete
    suspend fun deleteJobOffer(offer: JobOffer)

    @Query("SELECT * FROM attendance_logs ORDER BY id DESC")
    fun getAllAttendanceLogs(): Flow<List<AttendanceLog>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAttendanceLog(log: AttendanceLog): Long

    @Update
    suspend fun updateAttendanceLog(log: AttendanceLog)

    // ==========================================
    // AUDIT LOGS ENTITIES
    // ==========================================

    @Query("SELECT * FROM database_audit_trail ORDER BY id DESC")
    fun getAllAuditLogs(): Flow<List<DatabaseAuditTrail>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAuditLog(log: DatabaseAuditTrail): Long

    // ==========================================
    // CHAT & REALTIME LOCATION ENTITIES
    // ==========================================

    @Query("SELECT * FROM chat_messages WHERE bookingId = :bookingId ORDER BY timestamp ASC")
    fun getChatMessagesForBooking(bookingId: Int): Flow<List<ChatMessage>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertChatMessage(message: ChatMessage): Long

    @Query("SELECT * FROM worker_locations WHERE workerId = :workerId LIMIT 1")
    fun getWorkerLocation(workerId: Int): Flow<WorkerLocation?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateWorkerLocation(location: WorkerLocation)

    // ==========================================
    // PAYMENT TRANSACTIONS ENTITIES
    // ==========================================

    @Query("SELECT * FROM payment_transactions ORDER BY timestamp DESC")
    fun getAllPaymentTransactions(): Flow<List<PaymentTransaction>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPaymentTransaction(transaction: PaymentTransaction): Long

    @Query("SELECT * FROM payment_transactions WHERE id = :id LIMIT 1")
    suspend fun getPaymentTransactionById(id: Int): PaymentTransaction?

    @Query("SELECT * FROM payment_transactions WHERE bookingId = :bookingId LIMIT 1")
    suspend fun getPaymentTransactionByBookingId(bookingId: Int): PaymentTransaction?
}
