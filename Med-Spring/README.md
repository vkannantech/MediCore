# MediCore - Intelligent Healthcare Ecosystem

MediCore is a full-stack, patient-centered healthcare web application. It connects patients and doctors with secure, consent-based medical records sharing, medication tracking, and document organization.

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS (v4), Framer Motion, Axios.
- **Backend**: Java, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security (JWT).
- **Database**: MySQL.

## Local Development Setup

### Prerequisites
- Node.js (18+)
- JDK 17+
- MySQL 8+
- Maven

### Database Setup
1. Open your MySQL client and create the database:
   ```sql
   CREATE DATABASE medicore;
   ```
2. The backend will automatically create all tables on startup (`ddl-auto=update`).

### Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd backend-spring-based
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your MySQL `DB_PASSWORD`.
4. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will run on `http://localhost:8080`.*

### Frontend Setup (Next.js)
1. Navigate to the frontend directory:
   ```bash
   cd frontend-react-based
   ```
2. Install dependencies (already installed if you used the provided scripts):
   ```bash
   npm install
   ```
3. Create `.env` file for frontend (optional, defaults to localhost:8080):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```
4. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*

## Features
- **Deep Ocean Theme**: A serene, beautiful UI designed for modern healthcare.
- **Role-based Authentication**: Secure JWT login for Patients and Doctors.
- **Health Snapshot**: Quick overview of vitals, active meds, and upcoming follow-ups.
- **Consent-based Sharing**: Patients retain full control over who accesses their records.
