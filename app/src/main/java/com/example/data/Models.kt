package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Index

@Entity(
    tableName = "bookings",
    indices = [
        Index(value = ["status"]),
        Index(value = ["category"])
    ]
)
data class Booking(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val serviceName: String,
    val category: String,
    val date: String,
    val timeSlot: String,
    val price: Double,
    val status: String, // Pending, Dispatched, Arrived, In Progress, Completed, Cancelled
    val address: String,
    val technicianName: String,
    val technicianPhone: String,
    val technicianPhoto: String = "",
    val rating: Float = 0f,
    val reviewText: String = "",
    val otp: String = ""
)

@Entity(tableName = "product_orders")
data class ProductOrder(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val productName: String,
    val date: String,
    val price: Double,
    val status: String
)

@Entity(tableName = "wallet_transactions")
data class WalletTransaction(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val amount: Double,
    val type: String, // CREDIT, DEBIT
    val description: String,
    val date: String
)

@Entity(
    tableName = "coupons",
    indices = [
        Index(value = ["code"], unique = true)
    ]
)
data class Coupon(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val code: String,
    val discount: Double,
    val description: String,
    val isUsed: Boolean = false
)

@Entity(tableName = "amc_contracts")
data class AmcContract(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val planName: String,
    val price: Double,
    val startDate: String,
    val endDate: String,
    val status: String, // Active, Expired
    val inspectionsLeft: Int
)

@Entity(tableName = "notifications")
data class Notification(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val message: String,
    val timestamp: String,
    val isRead: Boolean = false
)

@Entity(tableName = "wishlist_items")
data class WishlistItem(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val serviceName: String,
    val category: String,
    val price: Double
)

@Entity(
    tableName = "user_profile",
    indices = [
        Index(value = ["email"], unique = true)
    ]
)
data class UserProfile(
    @PrimaryKey val id: Int = 1,
    val name: String,
    val email: String,
    val phone: String,
    val address: String,
    val walletBalance: Double
)

@Entity(
    tableName = "database_audit_trail",
    indices = [
        Index(value = ["tableName"]),
        Index(value = ["actionType"])
    ]
)
data class DatabaseAuditTrail(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val tableName: String,
    val recordId: String,
    val actionType: String, // INSERT, UPDATE, DELETE
    val timestamp: Long = System.currentTimeMillis(),
    val changeDetail: String, // Details about changed fields
    val operator: String = "SYSTEM"
)

@Entity(
    tableName = "chat_messages",
    indices = [
        Index(value = ["bookingId"]),
        Index(value = ["timestamp"])
    ]
)
data class ChatMessage(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val bookingId: Int,
    val senderRole: String, // "CUSTOMER" or "WORKER"
    val messageText: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isRead: Boolean = false
)

@Entity(
    tableName = "worker_locations"
)
data class WorkerLocation(
    @PrimaryKey val workerId: Int = 1,
    val latitude: Double,
    val longitude: Double,
    val speed: Double = 0.0,
    val bearing: Float = 0.0f,
    val lastUpdated: Long = System.currentTimeMillis()
)

@Entity(tableName = "payment_transactions")
data class PaymentTransaction(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val bookingId: Int? = null,
    val amcContractId: Int? = null,
    val serviceName: String,
    val baseAmount: Double,
    val gstAmount: Double,
    val totalAmount: Double,
    val paymentMethod: String, // "Stripe", "Razorpay", "UPI", "Card"
    val transactionId: String,
    val invoiceNumber: String,
    val status: String, // "SUCCESS", "PENDING", "FAILED", "REFUNDED"
    val timestamp: Long = System.currentTimeMillis(),
    val refundAmount: Double = 0.0,
    val refundReason: String? = null
)



