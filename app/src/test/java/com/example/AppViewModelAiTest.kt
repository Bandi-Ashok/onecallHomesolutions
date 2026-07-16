package com.example

import android.app.Application
import androidx.test.core.app.ApplicationProvider
import com.example.ui.AppViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@OptIn(ExperimentalCoroutinesApi::class)
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class AppViewModelAiTest {

    private lateinit var app: Application
    private lateinit var viewModel: AppViewModel

    @Before
    fun setUp() {
        app = ApplicationProvider.getApplicationContext()
        viewModel = AppViewModel(app)
    }

    @Test
    fun `test initial AI Chatbot messages contain welcome text`() = runTest {
        val messages = viewModel.aiChatMessages.value
        assertFalse(messages.isEmpty())
        assertEquals("AI", messages.first().first)
        assertTrue(messages.first().second.contains("Hello! I am your One Call AI"))
    }

    @Test
    fun `test send AI Chat message appends user message and updates state`() = runTest {
        val testPrompt = "Calculate cost estimate for plumbing"
        
        // Initial state
        assertFalse(viewModel.isAiThinking.value)
        
        // Send message
        viewModel.sendAiChatMessage(testPrompt)
        
        // Verify user message appended
        val updatedMessages = viewModel.aiChatMessages.value
        assertTrue(updatedMessages.any { it.first == "User" && it.second == testPrompt })
    }

    @Test
    fun `test generate cost estimate updates quote state`() = runTest {
        val details = "Leaking plumbing joint in washbasin"
        val category = "Plumbing"
        
        // Act
        viewModel.generateCostEstimate(details, category)
        
        // Let background task complete or run synchronously under simulated mode
        assertNotNull(viewModel.estimatedQuote.value)
    }

    @Test
    fun `test smart scheduler recommendations`() = runTest {
        viewModel.generateSmartSchedule("Urgent (Within 12 hours)", "Today, Jul 15")
        assertNotNull(viewModel.smartScheduleRecommendation.value)
    }

    @Test
    fun `test run predictive maintenance scan`() = runTest {
        viewModel.runPredictiveMaintenanceScan("3", "5", "8")
        assertNotNull(viewModel.predictiveMaintenanceAnalysis.value)
    }
}
