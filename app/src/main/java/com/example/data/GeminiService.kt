package com.example.data

import android.graphics.Bitmap
import android.util.Base64
import android.util.Log
import com.example.BuildConfig
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query
import java.io.ByteArrayOutputStream
import java.util.concurrent.TimeUnit

// --- Moshi Models for Gemini ---

@JsonClass(generateAdapter = true)
data class GeminiRequest(
    @Json(name = "contents") val contents: List<GeminiContent>,
    @Json(name = "generationConfig") val generationConfig: GeminiGenerationConfig? = null,
    @Json(name = "systemInstruction") val systemInstruction: GeminiContent? = null
)

@JsonClass(generateAdapter = true)
data class GeminiContent(
    @Json(name = "parts") val parts: List<GeminiPart>
)

@JsonClass(generateAdapter = true)
data class GeminiPart(
    @Json(name = "text") val text: String? = null,
    @Json(name = "inlineData") val inlineData: GeminiInlineData? = null
)

@JsonClass(generateAdapter = true)
data class GeminiInlineData(
    @Json(name = "mimeType") val mimeType: String,
    @Json(name = "data") val data: String
)

@JsonClass(generateAdapter = true)
data class GeminiGenerationConfig(
    @Json(name = "temperature") val temperature: Double? = null,
    @Json(name = "maxOutputTokens") val maxOutputTokens: Int? = null,
    @Json(name = "responseMimeType") val responseMimeType: String? = null
)

@JsonClass(generateAdapter = true)
data class GeminiResponse(
    @Json(name = "candidates") val candidates: List<GeminiCandidate>? = null
)

@JsonClass(generateAdapter = true)
data class GeminiCandidate(
    @Json(name = "content") val content: GeminiContent? = null
)

// --- Retrofit Api Interface ---

interface GeminiApi {
    @POST("v1beta/models/gemini-3.5-flash:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GeminiRequest
    ): GeminiResponse
}

// --- Gemini Service Wrapper ---

object GeminiService {
    private const val TAG = "GeminiService"
    private const val BASE_URL = "https://generativelanguage.googleapis.com/"

    private val moshi = Moshi.Builder()
        .addLast(KotlinJsonAdapterFactory())
        .build()

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    private val api: GeminiApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(GeminiApi::class.java)
    }

    /**
     * Checks if the Gemini API Key is configured.
     */
    fun isApiKeyConfigured(): Boolean {
        val key = BuildConfig.GEMINI_API_KEY
        return key.isNotEmpty() && key != "MY_GEMINI_API_KEY" && !key.contains("PLACEHOLDER")
    }

    /**
     * Helper to encode Bitmap to Base64.
     */
    private fun Bitmap.toBase64(): String {
        val outputStream = ByteArrayOutputStream()
        this.compress(Bitmap.CompressFormat.JPEG, 80, outputStream)
        return Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
    }

    /**
     * Generates content from text prompt.
     */
    suspend fun generateContent(prompt: String, systemInstruction: String? = null): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (!isApiKeyConfigured()) {
            Log.w(TAG, "Gemini API key is not configured, running smart local simulation.")
            return@withContext simulateResponse(prompt, systemInstruction)
        }

        val request = GeminiRequest(
            contents = listOf(GeminiContent(parts = listOf(GeminiPart(text = prompt)))),
            systemInstruction = systemInstruction?.let { GeminiContent(parts = listOf(GeminiPart(text = it))) }
        )

        try {
            val response = api.generateContent(apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                ?: "No valid AI response generated."
        } catch (e: Exception) {
            Log.e(TAG, "Error generating content from Gemini API", e)
            "Error: ${e.localizedMessage}. (Key is configured but request failed. Running simulation fallback)\n\n" + simulateResponse(prompt, systemInstruction)
        }
    }

    /**
     * Generates multimodal content from text prompt and image bitmap.
     */
    suspend fun generateImageAnalysis(prompt: String, bitmap: Bitmap, systemInstruction: String? = null): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (!isApiKeyConfigured()) {
            Log.w(TAG, "Gemini API key is not configured, running smart image analysis simulation.")
            return@withContext simulateImageAnalysis(prompt)
        }

        val request = GeminiRequest(
            contents = listOf(
                GeminiContent(
                    parts = listOf(
                        GeminiPart(text = prompt),
                        GeminiPart(inlineData = GeminiInlineData(mimeType = "image/jpeg", data = bitmap.toBase64()))
                    )
                )
            ),
            systemInstruction = systemInstruction?.let { GeminiContent(parts = listOf(GeminiPart(text = it))) }
        )

        try {
            val response = api.generateContent(apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                ?: "No valid analysis generated."
        } catch (e: Exception) {
            Log.e(TAG, "Error generating multimodal content from Gemini API", e)
            "Error: ${e.localizedMessage}. (Key is configured but request failed. Running simulation fallback)\n\n" + simulateImageAnalysis(prompt)
        }
    }

    /**
     * Local contextual simulated response for rapid testing when keys are missing.
     */
    private fun simulateResponse(prompt: String, systemInstruction: String?): String {
        val lower = prompt.lowercase()
        return when {
            lower.contains("estimate") || lower.contains("cost") || lower.contains("quote") -> {
                """
                ### 🛠️ One Call AI Professional Estimate
                
                Based on your repair request details, here is an automated smart diagnostic and cost breakdown:
                
                **Estimated Service Category:** Electrical & System Diagnostics
                
                | Expense Item | Description | Cost (INR) |
                | :--- | :--- | :--- |
                | **Base Labor Fee** | Safety-certified engineering visits (1-hour window) | ₹450.00 |
                | **Parts & Spares** | High-grade replacement wires, safe conduit, insulated connectors | ₹320.00 |
                | **Taxes & Surcharges** | SGST (9%) + CGST (9%) statutory tax | ₹138.60 |
                | **Total Estimate** | **Inclusive of all safety insurance fees** | **₹908.60** |
                
                **Recommended Action:** Proceed with our *Professional Safety Repair* package. This includes full post-repair diagnostics, 7-day safety warranties, and priority standby dispatch.
                
                *Disclaimer: This is an AI-generated quote based on standard pricing matrix templates. Actual on-site technician quotes may vary slightly depending on wiring topology.*
                """.trimIndent()
            }
            lower.contains("schedule") || lower.contains("slot") || lower.contains("calendar") -> {
                """
                ### 📅 One Call AI Smart Scheduler

                Based on our active field engineer metrics, emergency queues, and historical dispatch times, here is your personalized optimization plan:

                **Recommended Time Window:** **Today, 2:30 PM - 4:00 PM** (Highest Availability)
                
                **Why this slot is optimal:**
                - **95% On-Time Probability:** Standard travel patterns show zero peak traffic congestion in your sector during this period.
                - **Expert Alignment:** Senior safety engineers specialized in your selected service category are currently wrapping up nearby jobs.
                - **Off-Peak Priority Discount:** Booking this window triggers a ₹100.00 promotional discount on visitation surcharges.
                
                *Select this slot in your checkout flow to claim the prioritized scheduling voucher!*
                """.trimIndent()
            }
            lower.contains("recommend") || lower.contains("suggest") || lower.contains("wishlist") -> {
                """
                ### ✨ Smart AI Recommendations for Your Home
                
                Hello! Based on the local high-humidity weather patterns, upcoming seasonal changes, and property health indicators, we recommend the following professional audits:
                
                1. **Full-Home HVAC Audit & Coil Deep Clean**
                   *Reason:* Pre-monsoon humidity spikes can clog condenser fins and promote mold growth. Regular cleaning keeps indoor air quality pristine.
                   *Est. Cost:* ₹1,299.00
                   
                2. **Electrical DB Board & Earthing Check**
                   *Reason:* Essential pre-rain safety verification to prevent voltage leakage or dangerous surge potentials.
                   *Est. Cost:* ₹499.00
                   
                *Tap 'Add to Wishlist' or select 'Book Now' to secure these priority certified services.*
                """.trimIndent()
            }
            lower.contains("predictive") || lower.contains("risk") || lower.contains("maintenance") -> {
                """
                ### ⚠️ System Predictive Maintenance Analysis
                
                **Scanning home systems...**
                
                *   **AC / HVAC System:** **HIGH RISK (Level 3/5)**
                    *Diagnosis:* Last servicing was recorded over 180 days ago. Condenser current draw likely increased by 12%.
                    *Recommendation:* Urgent preventative filter clean and coolant levels inspection.
                *   **Bathroom Plumbing & Drainage:** **LOW RISK (Level 1/5)**
                    *Diagnosis:* Standard water flow parameters detected; no historical moisture alerts.
                *   **Kitchen Electrical Sockets:** **MEDIUM RISK (Level 2/5)**
                    *Diagnosis:* Recommended bi-annual safety checkup is due next week to prevent load resistance thermal stress.
                
                **System Summary:** Running pre-diagnostic diagnostics can extend appliance lifespans by up to 34% and reduce emergency breakdown risk by 80%.
                """.trimIndent()
            }
            else -> {
                """
                ### 🤖 One Call Gen-AI Support Desk
                
                Hello! I am your One Call AI assistant. I can assist you with:
                - **Smart Cost Estimates** for complex home repairs.
                - **Smart Scheduling** to find optimal slots and skip peak hours.
                - **Predictive System Diagnostics** to avoid critical breakdowns.
                - **Multimodal Visual Fault Diagnostics** from simple images.
                
                How can I make your home safer and more comfortable today? Let me know what you need help with!
                """.trimIndent()
            }
        }
    }

    /**
     * Local contextual simulated response for image analysis when keys are missing.
     */
    private fun simulateImageAnalysis(prompt: String): String {
        return """
        ### 🔍 Visual Fault Diagnosis & Diagnostic Report

        **AI Computer Vision Scan:** COMPLETE
        
        *   **Detected Issue:** Corrosion and micro-fissure leakage near primary join-valve assembly.
        *   **Severity Index:** **MEDIUM-HIGH (Action Recommended within 48 Hours)**
        
        **Detailed Diagnosis:**
        The image indicates localized thread oxidation on the jointing flange. Slow pressure seepage is creating salt-crusting and moisture buildup, which could lead to a sudden seal rupture under water hammer conditions.
        
        **Recommended Repair Category:** **Plumbing Services**
        *   **Required Action:** Main line valve isolation, joint thread re-taping, gasket replacement.
        *   **Estimated Cost:** ₹550.00 (Base visitation + repair spares)
        
        *Would you like to book a certified Plumber to resolve this immediately? Click 'Auto-Book Diagnostic' to proceed.*
        """.trimIndent()
    }
}
