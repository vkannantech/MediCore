-- MediCore: Intelligent Hospital Management System
-- Run this script in MySQL before launching the application

CREATE DATABASE IF NOT EXISTS medicore;
USE medicore;

-- Users table (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Patient table
CREATE TABLE IF NOT EXISTS patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    phone VARCHAR(15)
);

-- Doctor table
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    availability VARCHAR(50)
);

-- Appointment table
CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    date DATE,
    status VARCHAR(50),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
);

-- Medical Record table
CREATE TABLE IF NOT EXISTS medical_record (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    diagnosis TEXT,
    prescription TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

-- Billing table
CREATE TABLE IF NOT EXISTS billing (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    amount DOUBLE,
    date DATE,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

-- Test Data
INSERT IGNORE INTO users (username, password) VALUES ('admin', '1234');
INSERT IGNORE INTO users (username, password) VALUES ('staff', 'staff123');

INSERT INTO doctor (name, specialization, availability) VALUES
('Dr. Ravi Kumar',  'General',        'Morning'),
('Dr. Priya Nair',  'Cardiologist',   'Evening'),
('Dr. Arun Mehta',  'Orthopedic',     'Morning'),
('Dr. Sunita Rao',  'Pediatrician',   'Afternoon'),
('Dr. Karan Shah',  'Dermatologist',  'Evening'),
('Dr. Meena Pillai','Ophthalmologist','Morning');

INSERT INTO patient (name, age, gender, phone) VALUES
('Kannan V',  20, 'Male',   '9876543210'),
('Priya S',   35, 'Female', '9123456789'),
('Raju M',    55, 'Male',   '9988776655');
