package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Index

@Entity(
    tableName = "worker_profile",
    indices = [
        Index(value = ["email"], unique = true)
    ]
)
data class WorkerProfile(
    @PrimaryKey val id: Int = 1,
    val name: String = "Marcus Vance",
    val email: String = "marcus.vance@onecallpartner.com",
    val phone: String = "+1 (555) 765-4321",
    val tradeCategory: String = "Electrical", // Electrical, Cleaning, Plumbing, HVAC, Painting, Carpentry
    val rating: Float = 4.9f,
    val totalJobsCompleted: Int = 142,
    val walletBalance: Double = 340.50,
    val todayEarnings: Double = 120.00,
    val isOnline: Boolean = true,
    // KYC status: "NOT_STARTED", "PENDING_VERIFICATION", "VERIFIED", "REJECTED"
    val kycStatus: String = "VERIFIED",
    val kycDocumentId: String = "US-DL-9941A",
    val kycCertificateType: String = "Certified Master Electrician (Local Union 12)",
    val isCheckedIn: Boolean = true,
    val checkInTime: String = "08:30 AM",
    val checkOutTime: String = ""
)

@Entity(
    tableName = "job_offers",
    indices = [
        Index(value = ["status"])
    ]
)
data class JobOffer(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val serviceName: String,
    val category: String,
    val clientName: String,
    val clientAddress: String,
    val clientPhone: String,
    val distanceMiles: Double,
    val estEarnings: Double,
    val status: String, // "PENDING", "ACCEPTED", "REJECTED", "OTP_VERIFIED", "IN_PROGRESS", "PHOTOS_UPLOADED", "COMPLETED"
    val scheduledTime: String,
    val otp: String = "8841",
    val beforePhotoUri: String = "",
    val afterPhotoUri: String = ""
)

@Entity(
    tableName = "attendance_logs",
    indices = [
        Index(value = ["date"])
    ]
)
data class AttendanceLog(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val date: String,
    val punchInTime: String,
    val punchOutTime: String = "",
    val totalHours: Double = 0.0,
    val status: String // "PRESENT", "ABSENT"
)

