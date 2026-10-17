# Party Hard People LLC — Web Platform

Modern, responsive web platform and interactive party quotation engine for **Party Hard People LLC**, providing customized children's parties, DJ entertainment, and equipment rentals across **Los Angeles, Orange County, and San Diego**.

---

## 📂 Project Structure

```
party-hard-people/
├── docs/
│   └── PRD.md              # Official Product Requirements Document (v1.0)
├── assets/
│   └── images/
│       ├── hero-celebration.jpg   # High-resolution DJ & dancing celebration banner
│       ├── bounce-rentals.jpg     # Commercial pastel castle bounce house setup
│       └── sound-lighting.jpg     # Pro audio PA, stage lighting & karaoke station
├── css/
│   └── main.css            # Core design system (Outfit & Plus Jakarta Sans typography, glassmorphism, responsive grid)
├── js/
│   └── app.js              # State management, 25% deposit math, 7-day quote expiry, multi-step validation
├── index.html              # Flagship conversion landing page + interactive Party Builder
├── services.html           # Categorized entertainment & equipment catalog
├── about.html              # Company mission, team, and SoCal regional coverage
├── gallery.html            # Verified event photo highlights
├── reviews.html            # Authentic parent testimonials & verified booking badges
├── faq.html                # Comprehensive logistics, booking, deposit & weather FAQs
├── contact.html            # Contact channels & service coverage
├── blog.html               # Party planning advice & seasonal promotions
├── privacy.html            # COPPA & CalOPPA compliant privacy policy (Adult-only PII)
├── terms.html              # 25% deposit terms, 7-day price guarantee, 12-month weather reschedule policy
├── admin.html              # Owner Operations Dashboard & Quote Management Portal
└── README.md               # Project documentation
```

---

## 🚀 How to Run Locally

Because this platform is built with **zero external dependencies** using standards-compliant HTML5, Vanilla CSS3, and ES6+ JavaScript:

1. **Direct Browser Launch:**  
   Double-click [index.html](file:///C:/Users/hua.bryant5116/.gemini/antigravity-ide/scratch/party-hard-people/index.html) or open it in Google Chrome, Microsoft Edge, or Firefox.
2. **Local HTTP Server (Optional):**  
   If you have a local server installed, you can serve the directory at `http://localhost:3000`:
   ```powershell
   # Via npx (if Node is available)
   npx serve .
   # Via Python (if installed)
   python -m http.server 3000
   ```
3. **Owner Portal Access:**  
   Navigate to [admin.html](file:///C:/Users/hua.bryant5116/.gemini/antigravity-ide/scratch/party-hard-people/admin.html) to review submitted customer inquiries, customize travel fees, issue locked 7-day quotes, and inspect equipment inventory.

---

## 🛡️ Key Features Implemented

* **Multi-Step Interactive Party Builder:** 5-step guided questionnaire with step-by-step state caching via `sessionStorage` (state preserved between steps).
* **Integer-Precision Deposit Calculation:** Accurate 25% deposit calculation preview without floating-point drift.
* **7-Day Price Lock Guarantee:** Automatic 7-day quote validity tracking per PRD rules.
* **Child Privacy Protection (COPPA/CalOPPA):** Strictly collects adult contact details and child age ranges/counts only—no children's names or individual identifiers.
* **Owner Dashboard:** Interactive inquiry table with customer review modal, quote generation, and inventory unit tracking to prevent double bookings.
