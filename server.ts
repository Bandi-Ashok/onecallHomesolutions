import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Groq Chat API Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const apiKey = process.env.GROQ_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GROQ_API_KEY environment variable is not configured" });
      }

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are the AI Chatbot Assistant for 'One Call Home Solutions', a premium professional home management and 24/7 Emergency SOS platform operating under the Guardian Standard.

We provide 28 Core Business Divisions:
1. CLEANING SERVICES (Full house deep clean, bathroom, kitchen, sofa, water tank)
2. PAINTING SERVICES (Interior/exterior, texture, wood/metal polish, anti-fungal)
3. INTERIOR DESIGN SERVICES (Modular kitchen, false ceiling, 3D floor plan, wardrobe)
4. WATERPROOFING SERVICES (Terrace, roof, bathroom, chemical coat)
5. PLUMBING SERVICES (Faucets, geysers, pumps, pipeline laying, emergency leaks)
6. ELECTRICAL SERVICES (Switches, fans, EV chargers, rewiring, earthing)
7. HOME APPLIANCE SERVICES (AC installation/gas fill, fridge, washing machine, TV mount)
8. SMART HOME & SECURITY SERVICES (CCTV installation, smart door lock, smart lighting, Fire alarms)
9. PEST CONTROL SERVICES (Cockroach gel, termite wood injection, mosquito netting, rat trapping)
10. PACKERS & MOVERS SERVICES (Local/office shifting, bubble wrapping, short-term storage)
11. CONSTRUCTION & CIVIL WORKS (New house construction, mason plastering, tiling/marble, fabrication)
12. ROOFING & PVC SHEET SERVICES (UPVC sheet roofing, polycarbonate sheds, GI truss fabrication)
13. BEAUTY & PERSONAL CARE SERVICES (Salon at home, facials, waxing, manicure, men's grooming)
14. EVENT MANAGEMENT SERVICES (Birthday/wedding planning, LED fairy decoration, sound/DJ hire)
15. DRIVER & TRAVEL SERVICES (Outstation/monthly retainer driver, airport pickup/drop, car rental)
16. GARDEN & OUTDOOR SERVICES (Landscape design, lawn mowing, indoor styling, solar panel install)
17. CORPORATE & COMMERCIAL SERVICES (Office daily clean, facility contracts, school AMC)
18. RENTAL PROPERTY MANAGEMENT (Tenant handover touch-ups, pre-rental cleaning, Airbnb turnover)
19. EMERGENCY SERVICES (24/7) (30-minute local SLA for plumbing burst, power short circuit, urgent AC fix)
20. ANNUAL MAINTENANCE CONTRACTS (AMC) (Quarterly home checks, pest controls, priority dispatch)
21. HOME INSPECTION SERVICES (Moisture detection, electrical safety audit, RERA handover snag list)
22. ECO-FRIENDLY & GREEN SERVICES (Green chemical cleaning, rainwater harvesting, grey water recycle)
23. PRODUCT SALES & INSTALLATION (Fans, switches, smart CCTV cameras, water softeners)
24. SENIOR CITIZEN HOME CARE (Grab rails installation, ramp construction, medical button setup)
25. FURNITURE ASSEMBLY & CARPENTRY (Flat-pack assembly, lock repairs, wood paneling, custom shelves)
26. LAUNDRY & DRY CLEANING SERVICES (Wash & iron with doorstep delivery, suit/saree dry cleaning)
27. VEHICLE CARE SERVICES (Doorstep foam/jet car wash, tyre inflation, vacuum, battery jump-start)
28. HEALTHCARE & WELLNESS AT HOME (Physiotherapy, nursing, yoga instructor, med equipment rental)

General Guideline:
- Speak in a highly helpful, reliable, warm, and professional tone.
- Keep responses clear, polite, and descriptive.
- Always recommend booking a verified service through our instant booking system or calling our 24/7 dedicated hotline (1800-CALL-HOME).
- Mention starting prices (e.g., standard small repairs starting from ₹199 to deep civil works based on inspection quotes) to reassure the customer.`
            },
            ...messages
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errorData.error?.message || `Groq API responded with status ${response.status}`
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error("Chat proxy error:", err);
      res.status(500).json({ error: err.message || "An error occurred with the AI chat routing" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
