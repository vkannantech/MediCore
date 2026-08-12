<div align="center">

# 🏥 MediCore™

### Enterprise Healthcare Operations & Electronic Health Record Platform

[![Java](https://img.shields.io/badge/Java-17%20%7C%2025-007396?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15%20%7C%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4%EF%B8%8F-ff69b4?style=for-the-badge)](https://github.com/sponsors/vkannantech)

**MediCore™** is an enterprise-grade, multi-platform hospital management system (HMS) and electronic health record (EHR) platform engineered for research hospitals, private surgical clinics, multi-specialty networks, and academic medical centers. It ships with three complete, production-grade implementations — a Spring Boot REST microservice backend paired with an ultra-premium "Abyssal Wellness" Next.js 15 web interface, a standalone Next.js 16 + Prisma ORM 7 serverless deployment, and an original Java Swing desktop workstation — all sharing a unified MySQL relational database.

[🚀 Quick Start](#-quickstart--installation) · [📖 Documentation](#-architecture-deep-dive) · [🎨 Design System](#-the-abyssal-wellness-design-system) · [🔐 Demo Login](#-demo-accounts--credentials) · [❤️ Sponsor](https://github.com/sponsors/vkannantech)

</div>

---

## 📋 Table of Contents

- [✨ Why MediCore?](#-why-medicore)
- [🏗️ Architecture Deep Dive](#%EF%B8%8F-architecture-deep-dive)
  - [System Architecture Diagram](#system-architecture-diagram)
  - [Three Implementations, One Vision](#three-implementations-one-vision)
- [🎨 The "Abyssal Wellness" Design System](#-the-abyssal-wellness-design-system)
  - [Color Palette & Token Architecture](#color-palette--token-architecture)
  - [Typography System](#typography-system)
  - [Component Library](#component-library)
- [🩺 Feature Encyclopedia](#-feature-encyclopedia)
  - [I. Dual-Portal Authentication System](#i-dual-portal-authentication-system)
  - [II. Concierge Patient Health Portal](#ii-concierge-patient-health-portal)
  - [III. Doctor Clinical Practice Portal](#iii-doctor-clinical-practice-portal)
  - [IV. Time-Bound Consent Airlock & Record Sharing](#iv-time-bound-consent-airlock--record-sharing)
  - [V. Medical Encounter & Diagnostic Record Engine](#v-medical-encounter--diagnostic-record-engine)
  - [VI. Prescription Regimen Tracker](#vi-prescription-regimen-tracker)
  - [VII. Encrypted Digital Document Vault](#vii-encrypted-digital-document-vault)
  - [VIII. Live Sonar Global Clinical Search](#viii-live-sonar-global-clinical-search)
  - [IX. Care Timeline & Follow-Up Scheduler](#ix-care-timeline--follow-up-scheduler)
  - [X. Desktop Workstation (Java Swing)](#x-desktop-workstation-java-swing)
- [🗄️ Database Architecture & Entity Relationships](#%EF%B8%8F-database-architecture--entity-relationships)
- [🔒 Security Architecture](#-security-architecture)
- [🚀 Quickstart & Installation](#-quickstart--installation)
- [🔐 Demo Accounts & Credentials](#-demo-accounts--credentials)
- [📁 Complete Project Directory Map](#-complete-project-directory-map)
- [🛠️ Technology Stack Matrix](#%EF%B8%8F-technology-stack-matrix)
- [🗺️ Roadmap](#%EF%B8%8F-roadmap)
- [❤️ Support & Sponsoring](#%EF%B8%8F-support--sponsoring)
- [📄 License](#-license)

---

## ✨ Why MediCore?

Modern healthcare demands more than a CRUD application. It demands **trust**, **speed**, **privacy**, and **beauty**. MediCore was built from the ground up with these principles:

| Principle | How MediCore Delivers |
|---|---|
| **Patient Sovereignty** | Patients own their data. Time-bound, category-scoped consent airlocks let patients grant and revoke physician access with one click. Consents auto-expire. No permanent blanket access. |
| **Dual-Portal Experience** | Physicians and patients see entirely different dashboards, navigation menus, and data scopes — not a single generic view with hidden tabs. |
| **Clinical-Grade UI/UX** | The "Abyssal Wellness" design system uses 11 hand-curated color tokens, two display typefaces (Fraunces + Inter Tight), glassmorphic depth layers, and micro-animations for a premium feel that rivals consumer fintech apps. |
| **Multi-Platform Deployment** | One codebase, three deployment targets: Spring Boot REST API for enterprise backends, Next.js SSR for cloud-native web, and Java Swing for air-gapped clinic workstations. |
| **Real Clinical Data Modeling** | Medically consistent seed data with BCrypt-hashed credentials, relative date calculations, realistic diagnoses (Hypertension Stage 1, Iron-Deficiency Anemia), and proper medication dosage schedules. |

---

## 🏗️ Architecture Deep Dive

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              MediCore™ Platform Architecture                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────┐   ┌──────────────────────────┐   ┌─────────────────┐  │
│  │   🌐 Next.js 15 Web     │   │  🖥️ Java Swing Desktop    │   │ 🌐 Next.js 16   │  │
│  │   (Abyssal Wellness)    │   │  (Nimbus Dark Theme)      │   │ (Prisma ORM 7)  │  │
│  │                         │   │                            │   │                 │  │
│  │  React 19 + TypeScript  │   │  24 Java Classes           │   │ Server Actions  │  │
│  │  Tailwind v4 + Framer   │   │  10 Packages               │   │ jose JWT Auth   │  │
│  │  Axios HTTP Client      │   │  OpenPDF Generation        │   │ Zod Validation  │  │
│  │  Lucide React Icons     │   │  MySQL Connector/J         │   │ bcryptjs        │  │
│  └────────────┬────────────┘   └──────────────┬─────────────┘   └────────┬────────┘  │
│               │                                │                          │           │
│               ▼                                ▼                          ▼           │
│  ┌────────────────────────┐   ┌────────────────────────────────────────────────────┐  │
│  │  🔥 Spring Boot 3.3.0  │   │                                                    │  │
│  │   REST API Gateway     │   │              MySQL 8.0 Database Engine              │  │
│  │                        │   │                                                    │  │
│  │  Spring Security 6     │   │   ┌─────────┐ ┌──────────┐ ┌────────────────────┐ │  │
│  │  Spring Data JPA       │   │   │  users  │ │ patients │ │     doctors        │ │  │
│  │  Hibernate ORM         │   │   └────┬────┘ └────┬─────┘ └────────┬───────────┘ │  │
│  │  JJWT 0.11.5           │   │        │           │                │             │  │
│  │  BCrypt Password Hash  │   │   ┌────┴────┐ ┌────┴─────┐ ┌───────┴──────────┐  │  │
│  │  Bean Validation       │   │   │ records │ │   meds   │ │   documents      │  │  │
│  │  Jackson JSON          │   │   └─────────┘ └──────────┘ └──────────────────┘  │  │
│  │  dotenv-java           │   │                     │                             │  │
│  │  Lombok                │   │              ┌──────┴──────┐                      │  │
│  └────────────────────────┘   │              │   consents  │                      │  │
│                                │              └─────────────┘                      │  │
│                                └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Three Implementations, One Vision

<table>
<thead>
<tr>
<th width="25%">Implementation</th>
<th width="25%">Technology Stack</th>
<th width="30%">Primary Use Case</th>
<th width="20%">Directory</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<strong>🔥 MediCore Flagship</strong><br/>
<em>Spring + React</em>
</td>
<td>
Spring Boot 3.3.0<br/>
Next.js 15 (TypeScript)<br/>
Tailwind CSS v4<br/>
Framer Motion<br/>
Axios + Lucide React
</td>
<td>
Full-featured <strong>enterprise EHR web application</strong> with dual patient/doctor portals, JWT auth, consent-based record sharing, live search, prescription tracking, and document vault. The primary, actively maintained implementation.
</td>
<td><code>Med-Spring/</code></td>
</tr>
<tr>
<td>
<strong>🖥️ MediCore Desktop</strong><br/>
<em>Java Swing</em>
</td>
<td>
Java 17+ (JDK 25 supported)<br/>
Swing + Custom Nimbus Theme<br/>
MySQL Connector/J 9.6<br/>
OpenPDF 3.0.0<br/>
Segoe UI Font System
</td>
<td>
<strong>On-premise clinic desktop workstation</strong> for air-gapped facilities. Features admin dashboard with 6 module cards, patient/doctor CRUD, smart disease-to-specialization appointment mapping, billing with revenue aggregation, and direct PDF/print export via OpenPDF.
</td>
<td><code>src/medicore/</code></td>
</tr>
<tr>
<td>
<strong>🌐 MediCore Serverless</strong><br/>
<em>Next.js + Prisma</em>
</td>
<td>
Next.js 16.2 (App Router)<br/>
Prisma ORM 7.7<br/>
React 19.2<br/>
jose JWT + bcryptjs<br/>
Zod v4 Validation
</td>
<td>
<strong>Serverless-first deployment</strong> for Vercel/Neon edge networks. Lightweight prototype with server actions, Prisma migrations, and schema-driven data modeling. Supports MariaDB adapter for broader compatibility.
</td>
<td><code>medicore-nextjs/</code></td>
</tr>
</tbody>
</table>

---

## 🎨 The "Abyssal Wellness" Design System

The flagship web interface implements a bespoke clinical design language called **Abyssal Wellness** — a light-mode system built for trust, clarity, and visual authority in healthcare contexts.

### Color Palette & Token Architecture

| Token Name | Hex Code | CSS Variable | Semantic Role |
|---|---|---|---|
| **Alabaster Pearl** | `#F8F9FA` | `--color-alabaster` | Primary canvas background — surgical-grade white with warmth |
| **Frosted Glass** | `#F1F3F5` | `--color-frosted` | Card fills, input backgrounds, hover states |
| **Abyssal Night** | `#0B132B` | `--color-abyssal-night` | Hero gradients, deep contrast panels |
| **Surgical Sapphire** | `#1B3B6F` | `--color-sapphire` | Primary text, headings, trust authority color |
| **Abyssal Teal** | `#0F4C5C` | `--color-abyssal-teal` | Gradient midpoints, secondary depth |
| **Bioluminescent Cyan** | `#00B4D8` | `--color-cyan` | Interactive accents, focus rings, CTA glow, active nav indicators |
| **Soft Coral** | `#FF6B6B` | `--color-coral` | Danger, allergen flags, revoke buttons, warning alerts |
| **Eucalyptus Green** | `#2A9D8F` | `--color-eucalyptus` | Success, active status, confirmed consents |
| **Champagne Gold** | `#D4AF37` | `--color-gold` | Premium badges, upcoming appointments, starred items |
| **Slate Charcoal** | `#2C3E50` | `--color-slate-charcoal` | Body text, readable prose |
| **Clinical Mist** | `#8D99AE` | `--color-mist` | Labels, captions, secondary text, timestamps |

### Typography System

| Role | Typeface | Weight | Usage |
|---|---|---|---|
| **Display & Headings** | [Fraunces](https://fonts.google.com/specimen/Fraunces) (Variable Serif) | 600–700 | Page titles, hero greetings, stat numbers, card headers |
| **Body & Interface** | [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) (Sans-Serif) | 400–600 | Navigation labels, form inputs, table cells, button text |
| **Monospace Data** | System Mono | 400 | Phone numbers, license IDs, timestamps, code references |

### Component Library

Every UI element consumes the design token system through Tailwind v4 `@utility` directives:

| Component | File | Key Design Details |
|---|---|---|
| **Button** | `Button.tsx` | 4 variants (Primary, Secondary, Ghost, Danger). `rounded-2xl` corners, cyan elevation glow (`shadow-[0_10px_25px_-5px_rgba(0,180,216,0.35)]`), hover lift physics (`hover:-translate-y-0.5`), press scaling (`active:scale-[0.97]`), focus ring, disabled state, loading spinner. |
| **Card** | `Card.tsx` | `rounded-2xl`, frosted background, ambient shadow, hover border-cyan transition, `-translate-y-1` lift. |
| **Input** | `Input.tsx` | 52px height, `rounded-xl`, mist fill, expanding cyan focus ring with glow (`focus:shadow-[0_0_15px_rgba(0,180,216,0.3)]`). |
| **StatusBadge** | `StatusBadge.tsx` | Semantic color variants for ACTIVE (eucalyptus), EXPIRED (coral), REVOKED (mist), with pill shape and icon pairing. |
| **Glass Panel** | `globals.css` | `bg-white/70 backdrop-blur-md border-white/50` — frosted glassmorphism utility. |
| **Shimmer Skeleton** | `globals.css` | Gradient-sweep loading animation with `cubic-bezier(0.65, 0, 0.35, 1)` easing. |

---

## 🩺 Feature Encyclopedia

### I. Dual-Portal Authentication System

- **JWT-Based Authentication**: Stateless token auth using JJWT 0.11.5 with HS256 HMAC signing. Tokens carry user email as subject with configurable expiry (24h default).
- **BCrypt Password Hashing**: All passwords stored as BCrypt hashes (cost factor 10) — never plaintext.
- **Role-Based Routing**: Login response includes `role` field (`PATIENT` or `DOCTOR`). Frontend routes, sidebar menus, topbar labels, and API data scopes all switch based on role.
- **Persistent Session**: JWT stored in `localStorage` with automatic `Authorization: Bearer` header injection via Axios request interceptor. Auto-redirect to `/login` on 401 responses.
- **Patient Self-Registration**: `/register` page creates user + patient profile in a single transaction.

### II. Concierge Patient Health Portal

The patient dashboard is a rich, data-driven clinical command center:

- **Hero Greeting Card**: Gradient banner displaying patient first name, current date, and vault encryption status badge.
- **Live Health Snapshot**: Four stat cards showing Active Prescriptions, Total Encounters, Allergen Flags (with reactivity name), and Upcoming Follow-Up countdown.
- **Recent Encounters Stream**: Chronological list of medical records with type badges (CONSULTATION, LAB_REPORT, PRESCRIPTION), diagnosis summaries, doctor attribution, and date stamps.
- **Health Profile Manager**: Self-managed demographics with editable name, DOB, gender, phone, emergency contacts, and a chip-based allergen input system (add/remove with visual coral-colored reactivity tags).
- **Sticky Save Bar**: Unsaved profile changes trigger a floating save/reset action bar with dirty-state detection.

### III. Doctor Clinical Practice Portal

When a doctor (`f@f.in`) logs in, the entire application transforms:

- **Custom Navigation Menu**: Sidebar switches from "MY CARE" sections to "CLINICAL PRACTICE" (Patient Roster & Consents, Medical Encounters) and "DOCTOR VAULT" (Clinical Documents, Care Timeline).
- **Physician Hero Card**: Displays attending physician name, specialty, hospital affiliation, and active patient clearance count.
- **Authorized Patient Roster**: Card-based patient viewer showing demographics (name, age, phone, DOB), allergen warnings, consent scope categories, expiry countdown, and emergency contact — with a direct "Review Records" CTA.
- **Authorized Encounters Stream**: Displays only records belonging to patients who have granted active consent to the logged-in doctor.
- **Credential Profile Page**: Read-only display of professional credentials — qualifications (MBBS, MD, FACC), MCI License Number, hospital affiliation, and desk phone.

### IV. Time-Bound Consent Airlock & Record Sharing

The consent system is the philosophical heart of MediCore — patient data sovereignty:

- **Granular Category Scoping**: Patients specify exactly which record categories to share: `CONSULTATIONS`, `LAB_REPORTS`, `PRESCRIPTIONS`, `IMAGING`, `ALL`.
- **Time-Bound Expiry**: Consent windows of 24 hours, 7 days, 30 days, 90 days, or 365 days. The `ConsentService` runs `checkAndExpire()` on every read, automatically transitioning `ACTIVE` → `EXPIRED` when `expiryDate` passes.
- **Instant Revocation**: One-click revoke transitions status to `REVOKED` immediately, cutting off doctor access.
- **Tri-State Status System**: `ConsentStatus` enum with `ACTIVE` (eucalyptus), `EXPIRED` (mist), `REVOKED` (coral) — each rendered with semantic color badges.
- **Backend-Enforced Access Boundaries**: All four backend services (`MedicalRecordService`, `MedicationService`, `DocumentService`, `ConsentService`) check the authenticated user's role. Doctors only see data from patients with active consent — never all records.

### V. Medical Encounter & Diagnostic Record Engine

- **Full CRUD Operations**: Create, read, update, delete medical records with structured fields: date, type, diagnosis, description, doctor attribution.
- **Record Type Classification**: Encounters tagged as `CONSULTATION`, `LAB_REPORT`, `PRESCRIPTION`, `IMAGING`, `FOLLOW_UP`.
- **Doctor Attribution**: Each record links to the treating physician for accountability and audit trails.
- **Cross-Role Visibility**: Patients see their own records; doctors see only records from consented patients via active consent lookup.

### VI. Prescription Regimen Tracker

- **Active/Completed Filtering**: Medications rendered in two visual groups — active prescriptions (highlighted) and completed courses (dimmed).
- **Structured Medication Data**: Name, dosage strength, frequency schedule (e.g., "Once daily at bedtime"), start/end dates, special instructions, and follow-up reminders.
- **Jackson `@JsonProperty` Compatibility**: `isActive` boolean field annotated with `@JsonProperty("isActive")` to prevent Jackson serialization key mismatch between Java getter conventions and JavaScript camelCase.

### VII. Encrypted Digital Document Vault

- **Upload Clinical Document Modal**: Frosted-glass modal with file type selector (PDF, DICOM, X-Ray, Lab Report), description field, and file reference input.
- **Document Grid**: Card-based layout with document name, type badge, upload timestamp, and description preview.
- **Search Toolbar**: Inline search bar filtering documents by name, type, or description in real-time.
- **Cross-Role Access**: Doctors can view documents from consented patients.

### VIII. Live Sonar Global Clinical Search

- **Topbar Search Input**: Always-visible search field in the sticky header with expanding cyan glow on focus.
- **Real-Time Overlay**: Floating glass dropdown appears as the user types, simultaneously querying Medical Records, Medications, and Documents.
- **Category-Grouped Results**: Results organized under colored section headers (Medical Records in cyan, Medications in teal, Documents in gold) with direct navigation on click.
- **Click-Outside Dismissal**: Search overlay closes when clicking anywhere outside the container.

### IX. Care Timeline & Follow-Up Scheduler

- **Schedule Follow-Up Modal**: Interactive modal to create follow-up encounters with date picker, type selector, and notes field.
- **Timeline Display**: Chronological follow-up appointments with status indicators and countdown badges.

### X. Desktop Workstation (Java Swing)

The original MediCore implementation — a full-featured desktop HMS built for on-premise clinics:

- **Custom Nimbus Dark Theme**: 516-line `UIUtils.java` installs a professional dark color palette across every Swing component — buttons, tables, scroll bars, tabbed panes, combo boxes, option panes. Colors: `BG(9,14,28)`, `SURFACE(18,28,48)`, `CARD(24,35,58)`, `CYAN(8,184,208)`, `GREEN(16,185,129)`, `AMBER(245,158,11)`.
- **Admin Dashboard**: 6-module card grid (Patients, Doctors, Appointments, Medical Records, Billing, Logout) with live summary statistics strip and sidebar navigation.
- **Patient Dashboard**: Role-based patient view showing personal records, appointments, bills, and lab reports.
- **Smart Appointment Booking**: Disease-to-specialization mapping engine (`DISEASE_MAP`) that suggests the correct specialist when the patient describes symptoms — e.g., typing "chest" suggests "Cardiologist", "fracture" suggests "Orthopedic".
- **Billing & Revenue System**: Invoice generation, payment status tracking (Paid/Unpaid), payment method recording, revenue aggregation, and notes.
- **PDF Export Engine**: `ExportUtils.java` uses OpenPDF 3.0.0 to generate timestamped PDF documents from any JTable, with proper headers, page numbers, and formatted table cells.
- **Print Integration**: Direct system print dialog integration for any table or report view.
- **Async UI Layer**: `AsyncUI.java` provides background task execution to prevent EDT blocking during database operations.
- **Connection Pooling**: `DBConnection.java` configures MySQL with `cachePrepStmts`, `useServerPrepStmts`, `rewriteBatchedStatements`, and `cacheServerConfiguration` for production-grade performance.

---

## 🗄️ Database Architecture & Entity Relationships

### Spring Boot EHR Schema (7 Tables + Consent Layer)

```
                          ┌──────────────────────┐
                          │       users           │
                          │──────────────────────│
                          │ id (PK)              │
                          │ email (UNIQUE)       │
                          │ password (BCrypt)    │
                          │ name                 │
                          │ role (PATIENT|DOCTOR)│
                          │ created_at           │
                          │ updated_at           │
                          └──────────┬───────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │ (1:1)                           │ (1:1)
           ┌────────┴──────────┐            ┌────────┴──────────┐
           │     patients      │            │      doctors      │
           │──────────────────│            │──────────────────│
           │ id (PK)          │            │ id (PK)          │
           │ user_id (FK→users)│            │ user_id (FK→users)│
           │ name             │            │ name             │
           │ dob              │            │ specialty        │
           │ gender           │            │ phone            │
           │ phone            │            └────────┬─────────┘
           │ allergies        │                     │
           │ emergency_contact │                     │
           │ important_notes   │                     │
           └───┬──┬──┬────────┘                     │
               │  │  │                               │
    ┌──────────┘  │  └──────────┐                   │
    │ (1:N)       │ (1:N)       │ (1:N)             │
┌───┴────────┐ ┌──┴──────────┐ ┌┴───────────┐      │
│medical_    │ │medications  │ │ documents  │      │
│records     │ │             │ │            │      │
│────────────│ │─────────────│ │────────────│      │
│ id (PK)    │ │ id (PK)     │ │ id (PK)    │      │
│ patient_id │ │ patient_id  │ │ patient_id │      │
│ doctor_id  │ │ name        │ │ name       │      │
│ date       │ │ dosage      │ │ type       │      │
│ type       │ │ frequency   │ │ upload_date│      │
│ diagnosis  │ │ start_date  │ │ description│      │
│ description│ │ end_date    │ │ file_ref   │      │
└────────────┘ │ is_active   │ └────────────┘      │
               │ instructions│                      │
               │ follow_up   │                      │
               └─────────────┘                      │
                                                    │
                         ┌──────────────────────────┘
                         │
               ┌─────────┴──────────┐
               │     consents       │
               │───────────────────│
               │ id (PK)           │
               │ patient_id (FK)   │
               │ doctor_id (FK)    │
               │ records_category  │
               │ status (ENUM)     │
               │ expiry_date       │
               │ created_at        │
               └───────────────────┘
```

### Desktop App Schema (7 Tables)

```sql
users           → id, username, password, role, patient_id
patient         → patient_id, name, age, gender, phone
doctor          → doctor_id, name, specialization, availability
appointment     → appointment_id, patient_id, doctor_id, date, status
medical_record  → record_id, patient_id, diagnosis, prescription
billing         → bill_id, patient_id, amount, date, payment_status, payment_method, notes
patient_report  → report_id, patient_id, report_type, report_name, report_date, status, result_summary, attachment_path
```

---

## 🔒 Security Architecture

| Layer | Implementation | Details |
|---|---|---|
| **Authentication** | JWT (JJWT 0.11.5 / HS256) | Stateless token auth, 24h expiry, automatic refresh redirect |
| **Password Storage** | BCrypt (cost factor 10) | Spring Security `BCryptPasswordEncoder` — never plaintext |
| **Authorization** | Role-Based Access Control | `PATIENT` and `DOCTOR` roles enforced at controller + service layer |
| **Data Isolation** | Consent-Based Scoping | Doctors only access records from patients with `ConsentStatus.ACTIVE` |
| **API Security** | Spring Security 6 Filter Chain | `AuthTokenFilter` validates JWT on every request, `AuthEntryPointJwt` handles 401 |
| **Frontend Guards** | Axios Interceptors | Auto-inject `Bearer` token; auto-purge session and redirect on 401 |
| **CORS** | Cross-Origin Headers | `@CrossOrigin(origins = "*")` for development; lock down in production |
| **Input Validation** | Spring Boot Starter Validation | Bean validation on DTOs with `@Valid` annotations |
| **Secrets Management** | dotenv-java 3.0.0 | Environment-based configuration for JWT secret, DB credentials |

---

## 🚀 Quickstart & Installation

### Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| **Java JDK** | 17+ (JDK 25 supported) | Spring Boot backend & Desktop app compilation |
| **Node.js** | 18.0.0+ | Next.js frontend development server |
| **MySQL** | 8.0+ | Relational database engine |
| **Maven** | Bundled (mvnw wrapper) | Spring Boot dependency management |

### 1. Clone & Enter

```bash
git clone https://github.com/vkannantech/MediCore.git
cd MediCore
```

### 2. Database Setup & Seed Data

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS medicore;"

# Seed production-grade demo data (2 users, 5 records, 3 meds, 4 docs, 3 consents)
mysql -u root -padmin medicore < Med-Spring/backend-spring-based/src/main/resources/db/seed.sql
```

### 3. Launch Spring Boot REST API

```bash
cd Med-Spring/backend-spring-based
./mvnw clean spring-boot:run
# API running at → http://127.0.0.1:8080
```

### 4. Launch Next.js Web Application

```bash
cd Med-Spring/frontend-react-based
npm install          # First time only
npm run dev
# Web app running at → http://localhost:3000
```

### 5. Launch Desktop Workstation (Optional)

```bash
# From repository root
./compile.bat        # Compile Java sources
./run.bat            # Launch Swing GUI
```

### 6. Launch Serverless Stack (Optional)

```bash
cd medicore-nextjs
npm install
npx prisma db push   # Sync Prisma schema to MySQL
npm run db:seed       # Seed sample data
npm run dev
```

---

## 🔐 Demo Accounts & Credentials

The seed script creates two pre-configured accounts with BCrypt-hashed passwords:

| Role | Email | Password | Profile Details | Seeded Data |
|---|---|---|---|---|
| 🧑‍⚕️ **Patient** | `vkannantech@gmail.com` | `Kannan@2006` | **Kannan V** — Male, DOB 2006-03-15, Phone 6374088373, Allergy: Penicillin | 5 medical records, 3 medications (2 active), 4 documents, 3 active consents |
| 👨‍⚕️ **Doctor** | `f@f.in` | `qwerty123` | **Dr. Aris Thorne** — Cardiology Specialist, Apollo Heart Centre, MCI License TN-MCI-48213 | Access to consented patient records, medications, documents |

---

## 📁 Complete Project Directory Map

```
MediCore/
│
├── 🔥 Med-Spring/                                  # ━━ FLAGSHIP FULL-STACK SYSTEM ━━
│   │
│   ├── backend-spring-based/                       # Spring Boot 3.3.0 REST API
│   │   ├── src/main/java/com/medicore/
│   │   │   ├── MedicoreApplication.java            # @SpringBootApplication entry point
│   │   │   ├── controller/                         # REST API Endpoints
│   │   │   │   ├── AuthController.java             #   POST /api/auth/login, /api/auth/register
│   │   │   │   ├── PatientController.java          #   GET/PUT /api/patients/me, GET /api/health-snapshot
│   │   │   │   ├── DoctorController.java           #   GET /api/doctors/me
│   │   │   │   ├── MedicalRecordController.java    #   CRUD /api/records
│   │   │   │   ├── MedicationController.java       #   CRUD /api/medications
│   │   │   │   ├── DocumentController.java         #   CRUD /api/documents
│   │   │   │   └── ConsentController.java          #   POST/PUT /api/consents, /api/consents/:id/revoke
│   │   │   ├── entity/                             # JPA Hibernate Entities (9 classes)
│   │   │   │   ├── User.java                       #   id, email, password, name, role, timestamps
│   │   │   │   ├── Patient.java                    #   Demographics, allergies, emergency contact
│   │   │   │   ├── Doctor.java                     #   Name, specialty, phone
│   │   │   │   ├── MedicalRecord.java              #   Date, type, diagnosis, description
│   │   │   │   ├── Medication.java                 #   Dosage, frequency, active flag, instructions
│   │   │   │   ├── Document.java                   #   Name, type, upload date, file reference
│   │   │   │   ├── Consent.java                    #   Patient↔Doctor, category, status, expiry
│   │   │   │   ├── Role.java                       #   Enum: PATIENT, DOCTOR
│   │   │   │   └── ConsentStatus.java              #   Enum: ACTIVE, EXPIRED, REVOKED
│   │   │   ├── dto/                                # Data Transfer Objects (10 classes)
│   │   │   ├── repository/                         # Spring Data JPA Repositories (7 interfaces)
│   │   │   ├── service/                            # Business Logic Services (6 classes)
│   │   │   ├── security/                           # JWT Auth & Spring Security Config (6 classes)
│   │   │   │   ├── WebSecurityConfig.java          #   SecurityFilterChain, BCryptPasswordEncoder
│   │   │   │   ├── AuthTokenFilter.java            #   OncePerRequestFilter JWT validation
│   │   │   │   ├── JwtUtils.java                   #   Token generation, validation, subject extraction
│   │   │   │   ├── UserDetailsImpl.java            #   Spring Security UserDetails implementation
│   │   │   │   ├── UserDetailsServiceImpl.java     #   loadUserByUsername from DB
│   │   │   │   └── AuthEntryPointJwt.java          #   401 Unauthorized handler
│   │   │   └── exception/                          # Custom exception handlers
│   │   └── src/main/resources/
│   │       ├── application.properties              # DB URL, JWT secret, Hibernate DDL config
│   │       └── db/seed.sql                         # Idempotent BCrypt-hashed seed data
│   │
│   └── frontend-react-based/                       # Next.js 15 + React 19 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── globals.css                     # Abyssal Wellness token system (11 colors)
│       │   │   ├── layout.tsx                      # Root layout: Fraunces + Inter Tight fonts
│       │   │   ├── page.tsx                        # Landing/login redirect
│       │   │   ├── login/page.tsx                  # Authentication page
│       │   │   ├── register/page.tsx               # Patient self-registration
│       │   │   └── dashboard/
│       │   │       ├── layout.tsx                  # Sidebar + Topbar + Sonar Search
│       │   │       ├── page.tsx                    # Dual-mode dashboard (Patient/Doctor)
│       │   │       ├── profile/page.tsx            # Health profile / Doctor credentials
│       │   │       ├── records/page.tsx            # Medical encounters manager
│       │   │       ├── medications/page.tsx        # Prescription regimen tracker
│       │   │       ├── documents/page.tsx          # Document vault with upload modal
│       │   │       ├── follow-ups/page.tsx         # Care timeline scheduler
│       │   │       └── sharing/page.tsx            # Consent airlock manager
│       │   ├── components/
│       │   │   ├── ui/                             # Design system components
│       │   │   │   ├── Button.tsx                  #   4-variant button with glow/lift/press
│       │   │   │   ├── Card.tsx                    #   Ambient-shadow card container
│       │   │   │   ├── Input.tsx                   #   Labeled input with cyan focus glow
│       │   │   │   └── StatusBadge.tsx             #   Semantic tri-color status pill
│       │   │   └── layout/
│       │   │       └── Sidebar.tsx                 #   Role-aware navigation with active pill
│       │   ├── services/                           # Axios API service layer (8 modules)
│       │   │   ├── api.ts                          #   Axios instance + interceptors
│       │   │   ├── authService.ts                  #   login(), register(), logout(), getCurrentUser()
│       │   │   ├── patientService.ts               #   getPatientProfile(), updatePatientProfile()
│       │   │   ├── doctorService.ts                #   getDoctorProfile()
│       │   │   ├── recordService.ts                #   getRecords(), createRecord(), updateRecord()
│       │   │   ├── medicationService.ts            #   getMedications(), createMedication()
│       │   │   ├── documentService.ts              #   getDocuments(), createDocument()
│       │   │   └── consentService.ts               #   getConsents(), createConsent(), revokeConsent()
│       │   └── types/
│       │       └── index.ts                        # TypeScript interfaces for all entities
│       └── package.json                            # Dependencies: Next 16.3, React 19.2, Framer Motion
│
├── 🖥️ src/medicore/                                # ━━ DESKTOP JAVA SWING CLIENT ━━
│   ├── Main.java                                   # Entry point — Nimbus L&F + theme install
│   ├── auth/                                       # Authentication module
│   │   ├── LoginFrame.java                         #   Login window with role detection
│   │   ├── SignupFrame.java                        #   User registration window
│   │   ├── AuthDAO.java                            #   User CRUD + password verification (6KB)
│   │   └── AuthUser.java                           #   User POJO (id, username, role)
│   ├── dashboard/                                  # Dashboard module
│   │   ├── DashboardFrame.java                     #   Admin: 6-card grid + summary strip (11KB)
│   │   ├── UserDashboardFrame.java                 #   Patient: personal records view (12KB)
│   │   └── DashboardDAO.java                       #   Statistics queries
│   ├── patient/                                    # Patient management module
│   │   ├── PatientFrame.java                       #   CRUD + search table (21KB — largest frame)
│   │   ├── PatientProfileFrame.java                #   Full patient dossier view (8KB)
│   │   ├── PatientDAO.java                         #   Patient CRUD operations
│   │   └── PatientReportDAO.java                   #   Lab/scan report CRUD (4KB)
│   ├── doctor/                                     # Doctor management module
│   │   ├── DoctorFrame.java                        #   Add/edit/delete with specialization filter
│   │   └── DoctorDAO.java                          #   Doctor CRUD operations
│   ├── appointment/                                # Appointment module
│   │   ├── AppointmentFrame.java                   #   Smart booking with disease-to-specialist map
│   │   ├── UserAppointmentFrame.java               #   Patient appointment view
│   │   └── AppointmentDAO.java                     #   Appointment CRUD + status management
│   ├── medical/                                    # Medical records module
│   │   ├── MedicalRecordFrame.java                 #   Diagnosis & prescription manager (11KB)
│   │   └── MedicalRecordDAO.java                   #   Record CRUD operations
│   ├── billing/                                    # Billing & revenue module
│   │   ├── BillingFrame.java                       #   Invoice generation + payment tracking
│   │   └── BillingDAO.java                         #   Revenue aggregation queries (7KB)
│   ├── db/
│   │   └── DBConnection.java                       #   Connection pooling + perf-tuned JDBC URL
│   ├── ui/                                         # UI framework
│   │   ├── UIUtils.java                            #   516-line Nimbus dark theme + 40+ helpers
│   │   └── AsyncUI.java                            #   Background task executor for EDT safety
│   └── util/
│       └── ExportUtils.java                        #   OpenPDF table-to-PDF + system print (7KB)
│
├── 🌐 medicore-nextjs/                             # ━━ SERVERLESS PRISMA STACK ━━
│   ├── prisma/
│   │   ├── schema.prisma                           # 7-model data schema with indexes
│   │   ├── seed.js                                 # Sample data generator
│   │   └── migrations/                             # Auto-generated SQL migrations
│   ├── src/app/                                    # 10 page routes (App Router)
│   ├── src/components/                             # Login/Signup forms, stat cards
│   ├── src/lib/                                    # JWT auth (jose), Prisma singleton
│   └── src/server/actions.ts                       # Server actions (login, signup, logout)
│
├── 📄 medicore_setup.sql                           # Desktop schema DDL (7 tables + indexes)
├── 📄 medicore_upgrade.sql                         # Schema migration script
├── 🔨 compile.bat                                  # Desktop app Java compiler
├── 🚀 run.bat                                      # Desktop app launcher
└── 📋 .github/FUNDING.yml                          # GitHub Sponsors configuration
```

---

## 🛠️ Technology Stack Matrix

<table>
<thead>
<tr>
<th>Layer</th>
<th>Flagship (Med-Spring)</th>
<th>Desktop (Swing)</th>
<th>Serverless (Prisma)</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Language</strong></td><td>Java 17 + TypeScript 5</td><td>Java 17/25</td><td>TypeScript 5</td></tr>
<tr><td><strong>Backend</strong></td><td>Spring Boot 3.3.0</td><td>Direct JDBC</td><td>Next.js Server Actions</td></tr>
<tr><td><strong>Frontend</strong></td><td>Next.js 15 + React 19</td><td>Java Swing (Nimbus)</td><td>Next.js 16 + React 19</td></tr>
<tr><td><strong>ORM</strong></td><td>Hibernate / Spring Data JPA</td><td>Raw SQL (PreparedStatement)</td><td>Prisma ORM 7.7</td></tr>
<tr><td><strong>Database</strong></td><td>MySQL 8.0</td><td>MySQL 8.0</td><td>MySQL 8.0 / MariaDB</td></tr>
<tr><td><strong>Auth</strong></td><td>JWT (JJWT 0.11.5) + BCrypt</td><td>Role check (plaintext)</td><td>JWT (jose) + bcryptjs</td></tr>
<tr><td><strong>Styling</strong></td><td>Tailwind CSS v4 + Framer Motion</td><td>Custom Nimbus Theme (516 LOC)</td><td>Tailwind CSS v4</td></tr>
<tr><td><strong>Icons</strong></td><td>Lucide React</td><td>Unicode Emoji</td><td>—</td></tr>
<tr><td><strong>Fonts</strong></td><td>Fraunces + Inter Tight</td><td>Segoe UI</td><td>System Default</td></tr>
<tr><td><strong>PDF Export</strong></td><td>—</td><td>OpenPDF 3.0.0</td><td>—</td></tr>
<tr><td><strong>Validation</strong></td><td>Spring Starter Validation</td><td>Manual</td><td>Zod v4</td></tr>
<tr><td><strong>HTTP Client</strong></td><td>Axios 1.19</td><td>—</td><td>Fetch (native)</td></tr>
<tr><td><strong>Build Tool</strong></td><td>Maven (mvnw) + npm</td><td>javac (compile.bat)</td><td>npm</td></tr>
</tbody>
</table>

---

## 🗺️ Roadmap

- [ ] **RBAC Admin Portal** — Hospital administrator dashboard for user management, audit logs, and system configuration
- [ ] **DICOM Viewer Integration** — In-browser medical imaging viewer for X-ray, MRI, and CT scan files
- [ ] **Appointment Scheduling** — Migrate desktop smart booking engine to the web platform with calendar UI
- [ ] **Billing & Invoicing** — Payment gateway integration with invoice PDF generation
- [ ] **Real-Time Notifications** — WebSocket-based alerts for consent requests, appointment reminders, and lab results
- [ ] **Mobile Responsive PWA** — Progressive Web App support for tablet and mobile clinical workflows
- [ ] **Docker Compose** — One-command deployment with containerized MySQL, Spring Boot, and Next.js services
- [ ] **E2E Testing** — Playwright test suite for critical clinical workflows
- [ ] **FHIR R4 Compliance** — HL7 FHIR resource endpoints for healthcare interoperability

---

## ❤️ Support & Sponsoring

MediCore is built and maintained with care. If this project helps your clinic, research lab, academic work, or open-source health initiatives, please consider supporting its continued development:

<div align="center">

[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor_on_GitHub-%E2%9D%A4%EF%B8%8F-ff69b4?style=for-the-badge&logo=github)](https://github.com/sponsors/vkannantech)
[![Donate](https://img.shields.io/badge/Donate-kannantech.com-22C55E?style=for-the-badge)](https://www.kannantech.com/donate)

</div>

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full terms.

---

<div align="center">

**Built with 🫀 by [Kannan V](https://github.com/vkannantech)**

*MediCore™ — Where clinical precision meets digital elegance.*

</div>
