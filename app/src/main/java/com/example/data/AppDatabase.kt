package com.example.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        Booking::class,
        ProductOrder::class,
        WalletTransaction::class,
        Coupon::class,
        AmcContract::class,
        Notification::class,
        WishlistItem::class,
        UserProfile::class,
        WorkerProfile::class,
        JobOffer::class,
        AttendanceLog::class,
        DatabaseAuditTrail::class,
        ChatMessage::class,
        WorkerLocation::class,
        PaymentTransaction::class
    ],
    version = 5,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun appDao(): AppDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        val MIGRATION_2_3 = object : androidx.room.migration.Migration(2, 3) {
            override fun migrate(db: androidx.sqlite.db.SupportSQLiteDatabase) {
                // Create audit trail table
                db.execSQL("""
                    CREATE TABLE IF NOT EXISTS `database_audit_trail` (
                        `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                        `tableName` TEXT NOT NULL, 
                        `recordId` TEXT NOT NULL, 
                        `actionType` TEXT NOT NULL, 
                        `timestamp` INTEGER NOT NULL, 
                        `changeDetail` TEXT NOT NULL, 
                        `operator` TEXT NOT NULL
                    )
                """)
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_database_audit_trail_tableName` ON `database_audit_trail` (`tableName`)")
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_database_audit_trail_actionType` ON `database_audit_trail` (`actionType`)")

                // Add indices to existing tables to avoid table scan penalty
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_bookings_status` ON `bookings` (`status`)")
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_bookings_category` ON `bookings` (`category`)")
                db.execSQL("CREATE UNIQUE INDEX IF NOT EXISTS `index_coupons_code` ON `coupons` (`code`)")
                db.execSQL("CREATE UNIQUE INDEX IF NOT EXISTS `index_user_profile_email` ON `user_profile` (`email`)")
                db.execSQL("CREATE UNIQUE INDEX IF NOT EXISTS `index_worker_profile_email` ON `worker_profile` (`email`)")
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_job_offers_status` ON `job_offers` (`status`)")
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_attendance_logs_date` ON `attendance_logs` (`date`)")
            }
        }

        val MIGRATION_3_4 = object : androidx.room.migration.Migration(3, 4) {
            override fun migrate(db: androidx.sqlite.db.SupportSQLiteDatabase) {
                // Create chat_messages table
                db.execSQL("""
                    CREATE TABLE IF NOT EXISTS `chat_messages` (
                        `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        `bookingId` INTEGER NOT NULL,
                        `senderRole` TEXT NOT NULL,
                        `messageText` TEXT NOT NULL,
                        `timestamp` INTEGER NOT NULL,
                        `isRead` INTEGER NOT NULL
                    )
                """)
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_chat_messages_bookingId` ON `chat_messages` (`bookingId`)")
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_chat_messages_timestamp` ON `chat_messages` (`timestamp`)")

                // Create worker_locations table
                db.execSQL("""
                    CREATE TABLE IF NOT EXISTS `worker_locations` (
                        `workerId` INTEGER PRIMARY KEY NOT NULL,
                        `latitude` REAL NOT NULL,
                        `longitude` REAL NOT NULL,
                        `speed` REAL NOT NULL,
                        `bearing` REAL NOT NULL,
                        `lastUpdated` INTEGER NOT NULL
                    )
                """)
            }
        }

        val MIGRATION_4_5 = object : androidx.room.migration.Migration(4, 5) {
            override fun migrate(db: androidx.sqlite.db.SupportSQLiteDatabase) {
                db.execSQL("""
                    CREATE TABLE IF NOT EXISTS `payment_transactions` (
                        `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        `bookingId` INTEGER,
                        `amcContractId` INTEGER,
                        `serviceName` TEXT NOT NULL,
                        `baseAmount` REAL NOT NULL,
                        `gstAmount` REAL NOT NULL,
                        `totalAmount` REAL NOT NULL,
                        `paymentMethod` TEXT NOT NULL,
                        `transactionId` TEXT NOT NULL,
                        `invoiceNumber` TEXT NOT NULL,
                        `status` TEXT NOT NULL,
                        `timestamp` INTEGER NOT NULL,
                        `refundAmount` REAL NOT NULL,
                        `refundReason` TEXT
                    )
                """)
            }
        }

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "one_call_database"
                )
                .addMigrations(MIGRATION_2_3, MIGRATION_3_4, MIGRATION_4_5)
                .fallbackToDestructiveMigration()
                .addCallback(DatabaseCallback())
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                // Populate default data in a background coroutine
                INSTANCE?.let { database ->
                    CoroutineScope(Dispatchers.IO).launch {
                        populateDatabase(database.appDao())
                    }
                }
            }

            private suspend fun populateDatabase(dao: AppDao) {
                // 1. Initial User Profile
                dao.insertUserProfile(
                    UserProfile(
                        id = 1,
                        name = "Alex Mercer",
                        email = "alex.mercer@gmail.com",
                        phone = "+1 (555) 019-2834",
                        address = "452 Guardian Way, Suite 100, Metro City",
                        walletBalance = 250.00
                    )
                )

                // 2. Initial Coupons
                dao.insertCoupon(
                    Coupon(
                        code = "WELCOME50",
                        discount = 50.00,
                        description = "Flat $50 off on your very first service booking."
                    )
                )
                dao.insertCoupon(
                    Coupon(
                        code = "AMCSAVER",
                        discount = 120.00,
                        description = "Get $120 discount on purchasing any AMC Gold/Elite subscription."
                    )
                )
                dao.insertCoupon(
                    Coupon(
                        code = "SAFETY20",
                        discount = 20.00,
                        description = "Save 20% up to $30 on premium electrical safety checkups."
                    )
                )

                // 3. Initial Active/Expired AMC Contracts
                dao.insertAmcContract(
                    AmcContract(
                        planName = "Elite Whole-Home Guardian",
                        price = 499.00,
                        startDate = "Jan 12, 2026",
                        endDate = "Jan 12, 2027",
                        status = "Active",
                        inspectionsLeft = 3
                    )
                )

                // 4. Past historical booking & order
                dao.insertBooking(
                    Booking(
                        serviceName = "Whole Home Deep Cleaning",
                        category = "Cleaning",
                        date = "Jul 05, 2026",
                        timeSlot = "10:00 AM - 01:00 PM",
                        price = 180.00,
                        status = "Completed",
                        address = "452 Guardian Way, Suite 100, Metro City",
                        technicianName = "Robert Chen",
                        technicianPhone = "+1 (555) 123-4567",
                        rating = 5f,
                        reviewText = "Exceptional service! Robert was highly professional, on-time, and left the home absolutely sparkling. Best cleaning service I've ever booked."
                    )
                )

                dao.insertOrder(
                    ProductOrder(
                        productName = "Premium HVAC Allergen Filter",
                        date = "Jul 02, 2026",
                        price = 45.00,
                        status = "Delivered"
                    )
                )

                // 5. Initial Wallet Transactions
                dao.insertTransaction(
                    WalletTransaction(
                        amount = 300.00,
                        type = "CREDIT",
                        description = "Added funds via Digital Wallet UPI",
                        date = "Jul 01, 2026"
                    )
                )
                dao.insertTransaction(
                    WalletTransaction(
                        amount = 50.00,
                        type = "DEBIT",
                        description = "Paid for electrical inspection partial",
                        date = "Jul 05, 2026"
                    )
                )

                // 6. Initial Wishlist Items
                dao.insertWishlistItem(
                    WishlistItem(
                        serviceName = "Premium Wall Painting & Detailing",
                        category = "Painting",
                        price = 320.00
                    )
                )
                dao.insertWishlistItem(
                    WishlistItem(
                        serviceName = "AC Installation & Gas Charge",
                        category = "HVAC",
                        price = 150.00
                    )
                )

                // 7. Notifications
                dao.insertNotification(
                    Notification(
                        title = "Welcome to One Call Home Solutions!",
                        message = "Your safety home, our priority. Tap here to set up your home properties and view our seasonal 28+ service categories.",
                        timestamp = "Jul 14, 2026"
                    )
                )
                dao.insertNotification(
                    Notification(
                        title = "AMC Priority Inspection Scheduled",
                        message = "Your Elite Whole-Home Contract includes 4 free inspections. Your next quarterly electrical audit is scheduled automatically for Aug 10.",
                        timestamp = "Jul 12, 2026"
                    )
                )

                // 8. Seed Worker Profile (Marcus Vance, Electrical Master)
                dao.insertWorkerProfile(
                    WorkerProfile(
                        id = 1,
                        name = "Marcus Vance",
                        email = "marcus.vance@onecallpartner.com",
                        phone = "+1 (555) 765-4321",
                        tradeCategory = "Electrical",
                        rating = 4.9f,
                        totalJobsCompleted = 142,
                        walletBalance = 340.50,
                        todayEarnings = 120.00,
                        isOnline = true,
                        kycStatus = "VERIFIED",
                        kycDocumentId = "US-DL-9941A",
                        kycCertificateType = "Certified Master Electrician (Local Union 12)",
                        isCheckedIn = true,
                        checkInTime = "08:30 AM"
                    )
                )

                // 9. Seed Active and Completed Job Offers
                dao.insertJobOffer(
                    JobOffer(
                        id = 101,
                        serviceName = "Emergency Circuit Breaker Fault",
                        category = "Electrical",
                        clientName = "Evelyn Sterling",
                        clientAddress = "1042 Birchwood Terrace, Sector 4, Metro City",
                        clientPhone = "+1 (555) 304-9281",
                        distanceMiles = 2.4,
                        estEarnings = 64.00,
                        status = "PENDING",
                        scheduledTime = "Immediate (Within 30 Mins)",
                        otp = "4815"
                    )
                )
                dao.insertJobOffer(
                    JobOffer(
                        id = 102,
                        serviceName = "Ceiling Fan Complete Wiring",
                        category = "Electrical",
                        clientName = "Jonathan Gray",
                        clientAddress = "719 Oakwood Blvd, Metro City",
                        clientPhone = "+1 (555) 881-2244",
                        distanceMiles = 5.1,
                        estEarnings = 36.00,
                        status = "PENDING",
                        scheduledTime = "Jul 15, 2026 @ 10:00 AM",
                        otp = "1623"
                    )
                )
                dao.insertJobOffer(
                    JobOffer(
                        id = 103,
                        serviceName = "AC Installation & Gas Charge",
                        category = "Electrical",
                        clientName = "Dr. Robert Chen",
                        clientAddress = "204 Emerald Heights, Metro City",
                        clientPhone = "+1 (555) 902-1133",
                        distanceMiles = 3.8,
                        estEarnings = 120.00,
                        status = "COMPLETED",
                        scheduledTime = "Today @ 09:30 AM",
                        otp = "9041",
                        beforePhotoUri = "simulated_before_img",
                        afterPhotoUri = "simulated_after_img"
                    )
                )

                // 10. Seed Attendance Logs
                dao.insertAttendanceLog(
                    AttendanceLog(
                        id = 1,
                        date = "Jul 14, 2026",
                        punchInTime = "08:30 AM",
                        punchOutTime = "",
                        totalHours = 6.5,
                        status = "PRESENT"
                    )
                )
                dao.insertAttendanceLog(
                    AttendanceLog(
                        id = 2,
                        date = "Jul 13, 2026",
                        punchInTime = "08:00 AM",
                        punchOutTime = "05:00 PM",
                        totalHours = 9.0,
                        status = "PRESENT"
                    )
                )
                dao.insertAttendanceLog(
                    AttendanceLog(
                        id = 3,
                        date = "Jul 12, 2026",
                        punchInTime = "08:15 AM",
                        punchOutTime = "04:45 PM",
                        totalHours = 8.5,
                        status = "PRESENT"
                    )
                )
            }
        }
    }
}
