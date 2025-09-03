# Arogya-AI - An AI Driven Health Care Application 

A comprehensive, secure, and scalable healthcare application designed to bridge the gap between patients and doctors through intelligent data analysis and seamless communication.

## 🌟 Overview

Aarogya AI is a comprehensive healthcare platform designed to create a seamless and intelligent connection between patients and doctors. It moves beyond simple tracking to offer predictive, personalized, and preventive health management.

For Patients, it's a personal health companion featuring an AI symptom checker, vaccine scheduler, and real-time air quality alerts, all integrated into a single, user-friendly dashboard.

For Doctors, it's a powerful clinical dashboard that transforms raw patient data into actionable insights. It provides tools for triage, AI-assisted diagnosis, secure communication, and streamlined workflow management.

Built on a secure Supabase (PostgreSQL) backend with strict privacy controls, Aarogya AI ensures patient data is protected while enabling a new level of collaborative and proactive care.

## 🚀 Features

For Patients:

🤖 AI Symptom Checker: Get instant, AI-powered preliminary assessments for your symptoms.
💉 Vaccine Scheduler: Never miss a dose with intelligent tracking and reminders.
🌫️ Air & Allergy Alerts: Receive real-time, location-based alerts for pollution and allergens.
🧠 Mental Health Tracker: Log your mood, get AI insights, and access crisis resources.
🍎 Diet & Nutrition Tracker: Monitor your meals and water intake with personalized goals.
🆘 Emergency Profile: Securely store critical medical information for emergencies.
📊 Weekly Health Reports: Get personalized insights and actionable health goals.


For Doctors:

👨‍💻 Professional Dashboard: A clinical-grade interface for patient management.
⚠️ Triage View: Prioritize patients based on AI-driven risk flags and new data.
📋 Integrated Patient Profile: A holistic, timeline-based view of a patient's health journey.
🩺 Clinical Decision Support (CDS): AI-powered tools for differential diagnosis and medication checks.
💬 Secure Communication: Built-in messaging and telemedicine for seamless patient interaction.
📅 Practice Management: Schedule appointments, create digital action plans, and generate SOAP notes.

## 🛠️ Tech Stack

Frontend: React.js / Next.js, Tailwind CSS
Backend: Node.js / Python (FastAPI)
Database: PostgreSQL with Supabase
Authentication: Supabase Auth
AI/ML: TensorFlow / PyTorch for symptom analysis (or integration with APIs like OpenAI)
Real-time Alerts: Twilio / Telegram API for notifications
Deployment: Vercel / Netlify (Frontend), Railway / AWS (Backend)

## 📦 Database Schema

Aarogya AI uses a robust, secure PostgreSQL database with Row Level Security (RLS) enabled on all tables. Key tables include:

patients & doctors: Core user profiles.
doctor_patient_relationships: Manages data-sharing consent (the core of our security model).
patient_symptom_checks, patient_mood_logs, patient_vaccines: Power the patient-facing features.
appointments & shared_health_reports: Facilitate doctor-patient interaction.

## 🔐 Security & Privacy

HIPAA/GDPR Compliant Design: All PHI (Protected Health Information) is encrypted and stored securely.
Row-Level Security (RLS): Patients and doctors can only access data they are explicitly permitted to see.
End-to-End Encryption: All sensitive data is encrypted in transit and at rest.
Secure Authentication: Managed by Supabase Auth with support for OAuth, magic links, and more.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jal-spotter-dash-main
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   > Note: Use `--legacy-peer-deps` to resolve React version conflicts with react-leaflet

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Aarogya AI: Use Cases

For Patients:

Symptom Triage: Get instant AI-powered analysis for quick peace of mind.
Vaccine Management: Never miss a dose with automated tracking & reminders.
Environmental Health: Receive proactive alerts for air quality & allergens.
Mental Wellbeing: Track mood, get insights, and access crisis support.
Chronic Care: Manage diet, medications, and conditions in one place.
Family Health: Oversee the health of your entire family from a single dashboard.

For Doctors:
7. Patient Triage: Quickly identify and prioritize high-risk cases.
8. Holistic View: See a complete, AI-summarized timeline of a patient's health.
9. Clinical Decision Support: Get AI-generated differential diagnoses and risk assessments.
10. Streamlined Workflow: Send digital care plans, message patients, and conduct video consults.
11. Remote Monitoring: Track patient-reported outcomes and vital signs between visits.

For Public Health:
12. Outbreak Early Warning: Community-level reporting can signal potential local health threats.

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Deploy to Netlify, Vercel, or similar platforms
- **Docker**: Containerize the application for cloud deployment
- **CDN**: Serve static assets through a content delivery network

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

----

**Built with ❤️ for Healthier Bharat**















