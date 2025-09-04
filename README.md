# MedLink: Bridging Traditional and Modern Medicine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Stack: MERN](https://img.shields.io/badge/stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![Project Status: Active](https://img.shields.io/badge/status-active-brightgreen.svg)]()

MedLink is a comprehensive digital health platform designed to solve a critical interoperability challenge in the Indian healthcare ecosystem. Our project directly addresses the need for a **dual-coding system**, seamlessly integrating India's traditional Ayush terminologies (NAMASTE) with the global ICD-11 standard, all within a secure, FHIR-compliant framework.

This platform empowers doctors to document with precision and enables a truly unified health record for every patient, in line with the standards set by the **Ayushman Bharat Digital Mission (ABDM)**.

---

## 🚀 Key Features

-   **⚕️ Dual-Coding Engine:** A real-time, auto-complete feature that suggests both **NAMASTE** (Ayurveda, Siddha, Unani) and **ICD-11** codes as a doctor writes a diagnosis.
-   **🔐 Secure National Authentication:**
    -   **Patient Login:** Verified through the national **ABHA (Ayushman Bharat Health Account)** gateway using OTP.
    -   **Doctor Login:** Verified through the national **HPR (Healthcare Professional Registry)** to ensure authenticity.
-   **📄 FHIR-Compliant Data Exchange:** All clinical encounters are structured as **FHIR R4 Bundles**, ensuring data is standardized and interoperable with hospital EMR systems.
-   **💻 Unified User Portals:** Separate, secure dashboards for both patients and doctors to manage and view health records.
-   **🤖 AI-Powered Assistance:** Integrated chatbots to assist with general queries and provide quick code lookups for doctors.
-   **📜 Legacy Data Import:** An OCR-powered tool to digitize old paper or PDF prescriptions, making them part of the patient's digital journey.

---

## 🗺️ System Workflow

The application is designed as a cohesive ecosystem that handles user authentication, clinical documentation, and secure data distribution.

### Module 1: Secure User Onboarding & Authentication

```
[ User visits MedLink Homepage ]
              |
              v
+------< Choose Portal >------+
|                             |
v                             v
[ PATIENT PATH ]              [ DOCTOR PATH ]
|                             |
v                             v
[ Clicks "Patient Login" ]    [ Clicks "Doctor Login" ]
|                             |
v                             v
[ Enters ABHA Number ]        [ Enters HPR ID ]
|                             |
v                             v
[ API: Request OTP via ABDM ] [ API: Validate ID via HPR ]
|                             |
v                             v
[ Enters Received OTP ]       [ System Confirms Verification ]
|                             |
v                             v
[ Auth Success: ABHA Token ]  [ Auth Success: Session Token ]
|                             |
v                             v
[ --> PATIENT DASHBOARD ]     [ --> DOCTOR DASHBOARD ]
```

### Module 2: Core Clinical Workflow

```
[ DOCTOR DASHBOARD ]
      |
      v
[ Searches Patient by ABHA Number ]
      |
      v
[ Clicks "New Prescription/Encounter" ]
      |
      v
[ Enters Diagnosis in Form ]
      |
      +---> [ THE MAGIC STEP: DUAL-CODING ]
      |     |
      |     v
      |     [ User types "Vata..."]
      |     |
      |     v
      |     [ API+AI: Call Terminology Service ]
      |     |
      |     v
      |     [ System suggests: ]
      |     [ > Vatavyadhi [NAMASTE] ]
      |     [ > General vata disorder [ICD-11] ]
      |
      v
[ Doctor Selects Diagnosis Code ]
      |
      v
[ Adds Medicines, Dosage, Duration ]
      |
      v
[ Clicks "Save & Generate Record" ] --> (Triggers Module 3)
```

### Module 3: Data Processing & Distribution

```
[ Starts from Module 2 "Save" Action ]
      |
      v
[ BACKEND: Create FHIR Bundle (JSON) ]
      |
      v
[ DATABASE: Store Secure FHIR Record ]
      |
      v
+------< Distribute Data >------+
|                               |
v                               v
[ PATH A: Patient Delivery ]    [ PATH B: Hospital EMR Integration ]
|                               |
v                               v
[ Generate User-Friendly PDF ]  [ API: Send raw FHIR Bundle (JSON) ]
|                               |
v                               v
[ CLOUD: Upload PDF Securely ]  [ EMR System Receives Data ]
|                               |
v                               v
[ Generate Secure Link ]        [ EMR Validates Security Token ]
|                               |
v                               v
[ API: Send Link via SMS/WA ]   [ EMR Ingests Patient Record ]
|
v
[ Update Patient Dashboard with PDF ]
```

### Module 4 & 5: AI Assistance & Legacy Data Import

```
[ AI-POWERED ASSISTANCE ]
-------------------------
[ FLOW 1: General Queries Chatbot ]
[ User on Homepage ] -> [ Opens Chatbot ] -> [ Asks Query ] -> [ Returns FAQ Answer ]

[ FLOW 2: Doctor's Assistant Chatbot ]
[ Doctor on Dashboard ] -> [ Opens Assistant ] -> [ Types "Amavata" ] -> [ Returns NAMASTE + ICD-11 Codes ]

[ LEGACY DATA IMPORT ]
----------------------
[ Doctor selects "Upload Old Prescription" ]
      |
      v
[ Uploads PDF / Image of old record ]
      |
      v
[ AI/OCR: Extract Text from Document ]
      |
      v
[ Show Verification UI (Image vs. Text) ]
      |
      v
[ Doctor Reviews & Corrects Extracted Text ]
      |
      v
[ Create New Digital Record ] --> (Flow continues at Module 2)

```

---

## 🛠️ Technology Stack

-   **Frontend:** React, React Router, Axios, Context API
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose
-   **Key APIs & Services:**
    -   Ayushman Bharat Digital Mission (ABDM) for ABHA
    -   Healthcare Professional Registry (HPR)
    -   FHIR R4 Standards
    -   Google Vision AI (for OCR)
    -   Twilio/Vonage (for SMS/WhatsApp notifications)
    -   AWS S3 / Firebase Storage (for PDF storage)

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18.x or later)
-   npm
-   MongoDB (local instance or a cloud URI)

### Installation

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/your-username/medlink.git](https://github.com/your-username/medlink.git)
    cd medlink
    ```
2.  **Install root dependencies:**
    ```sh
    npm install
    ```
3.  **Install server dependencies:**
    ```sh
    npm install --prefix server
    ```
4.  **Install client dependencies:**
    ```sh
    npm install --prefix client
    ```
5.  **Set up environment variables:**
    -   Create a `.env` file in the `server/` directory.
    -   Create a `.env` file in the `client/` directory.
    -   Add the necessary environment variables (refer to `.env.example` files).
    ```env
    # Example for server/.env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```

### Running the Application

1.  **Run the development server from the root directory:**
    This command will start both the backend and frontend servers concurrently.
    ```sh
    npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:3000`.