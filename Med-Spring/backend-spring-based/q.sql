SHOW DATABASES;
USE medicore;
SHOW TABLES;
USE medicore;

CREATE TABLE IF NOT EXISTS consent (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    doctor_name VARCHAR(255),
    doctor_specialty VARCHAR(255),
    expiry_date VARCHAR(255),
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(255),
    records_category VARCHAR(255),
    status VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255),
    file_reference VARCHAR(255),
    name VARCHAR(255),
    patient_id BIGINT NOT NULL,
    type VARCHAR(255),
    upload_date VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS medication (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dosage VARCHAR(255),
    end_date VARCHAR(255),
    follow_up_date VARCHAR(255),
    frequency VARCHAR(255),
    instructions VARCHAR(255),
    is_active BIT NOT NULL,
    name VARCHAR(255),
    patient_id BIGINT NOT NULL,
    start_date VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);
ALTER TABLE users MODIFY username VARCHAR(255) NULL;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM doctors;
SELECT * FROM patients;