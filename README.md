# MediCore — Intelligent Hospital Management System

[![Sponsor](https://img.shields.io/badge/Sponsor-❤️-ff69b4)](https://github.com/sponsors/vkannantech)

**MediCore** is a sophisticated, high-performance Java-based platform designed to streamline clinical operations and medical records management. Built with a focus on modern UX and robust data integrity, it provides a comprehensive suite for hospitals and private practices.

---

## ✨ Features

- 🏥 **Centralized Dashboard**: Real-time tracking of clinic activities and medical status.
- 🔐 **Secure Authentication**: Role-based access for Admins, Doctors, and Patients.
- 📂 **Patient Management**: Full lifecycle management of patient records and health history.
- 🦷 **Appointment Scheduling**: Interactive systems for booking and managing doctor consultations.
- 💳 **Billing & Invoicing**: Automated billing cycles with clear financial summaries.
- 🎨 **Modern Interface**: Custom-themed Java Swing UI with dark mode and smooth transitions.

---

## 🛠️ Technology Stack

- **Lanuage**: Java (JDK 17+)
- **UI Framework**: Java Swing (Customized Nimbus Look and Feel)
- **Database**: SQL-driven backend for reliable data persistence
- **Architecture**: Modular codebase optimized for scalability

---

## 🚀 Quick Start

### Prerequisites
- Java Development Kit (JDK) 17 or higher.
- A compatible SQL environment.

### Installation & Running
1. **Compile**: Run the provided batch script to build the project.
   ```bash
   ./compile.bat
   ```
2. **Launch**: Start the application using the run script.
   ```bash
   ./run.bat
   ```

---

## 🌱 Seed Demo Data

To populate the `medicore` database with a complete, medically consistent demo dataset:

### Prerequisites
1. Ensure MySQL server is active on `localhost:3306`.
2. Start the Spring Boot backend once to allow Hibernate to initialize/update table schemas.

### Seed Execution Command
Run the idempotent SQL seed script via PowerShell or MySQL CLI:
```powershell
Get-Content Med-Spring/backend-spring-based/src/main/resources/db/seed.sql | mysql -u root -padmin medicore
```

### Demo Credentials
| Role | Email | Password | Description |
|---|---|---|---|
| **Patient** | `vkannantech@gmail.com` | `Kannan@2006` | Full medical profile, 5 records, 3 meds, 4 documents, 3 consents |
| **Doctor** | `f@f.in` | `qwerty123` | Dr. Aris Thorne (Cardiology Specialist) |

---

## ❤️ Support the Developer

If you find this project useful, please consider sponsoring to support further development!

👉 **[Donate here](https://www.kannantech.com/donate)**
👉 **[Become a GitHub Sponsor](https://github.com/sponsors/vkannantech)**

---

## 📄 License
Check individual file headers for licensing information.
