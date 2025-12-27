-- College Management System Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS college_management;
USE college_management;

-- Departments Table
CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    dept_code VARCHAR(10) NOT NULL UNIQUE
);

-- Students Table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    dept_id INT,
    year INT NOT NULL,
    backlogs INT DEFAULT 0,
    fee_paid DECIMAL(10, 2) DEFAULT 0.00,
    fee_pending DECIMAL(10, 2) DEFAULT 0.00,
    email VARCHAR(100),
    phone VARCHAR(15),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Faculty Table
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    dept_id INT,
    designation VARCHAR(50),
    experience INT,
    qualification VARCHAR(200),
    email VARCHAR(100),
    phone VARCHAR(15),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Placements Table
CREATE TABLE placements (
    placement_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_id INT,
    academic_year VARCHAR(10),
    students_placed INT DEFAULT 0,
    total_students INT DEFAULT 0,
    highest_package DECIMAL(10, 2),
    average_package DECIMAL(10, 2),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Job Notifications Table
CREATE TABLE job_notifications (
    job_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    description TEXT,
    eligibility TEXT,
    package DECIMAL(10, 2),
    location VARCHAR(100),
    last_date DATE,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Internships Table
CREATE TABLE internships (
    internship_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    stipend DECIMAL(10, 2),
    location VARCHAR(100),
    last_date DATE,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Examinations Table
CREATE TABLE examinations (
    exam_id INT PRIMARY KEY AUTO_INCREMENT,
    exam_name VARCHAR(100) NOT NULL,
    exam_type VARCHAR(50),
    dept_id INT,
    year INT,
    subject VARCHAR(100),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    room_number VARCHAR(20),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Alumni Table
CREATE TABLE alumni (
    alumni_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(20),
    dept_id INT,
    graduation_year INT,
    current_company VARCHAR(100),
    current_position VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Admin Table
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Data

-- Departments
INSERT INTO departments (dept_name, dept_code) VALUES
('Computer Science Engineering', 'CSE'),
('Electronics and Communication Engineering', 'ECE'),
('Mechanical Engineering', 'MECH'),
('Civil Engineering', 'CIVIL'),
('Electrical Engineering', 'EEE');

-- Students
INSERT INTO students (roll_number, name, dept_id, year, backlogs, fee_paid, fee_pending, email, phone) VALUES
('CS2021001', 'Rahul Sharma', 1, 4, 0, 80000.00, 20000.00, 'rahul@college.edu', '9876543210'),
('CS2021002', 'Priya Patel', 1, 4, 1, 75000.00, 25000.00, 'priya@college.edu', '9876543211'),
('EC2021001', 'Amit Kumar', 2, 4, 0, 80000.00, 20000.00, 'amit@college.edu', '9876543212'),
('ME2022001', 'Sneha Reddy', 3, 3, 2, 60000.00, 40000.00, 'sneha@college.edu', '9876543213'),
('CS2022001', 'Vijay Singh', 1, 3, 0, 70000.00, 30000.00, 'vijay@college.edu', '9876543214');

-- Faculty
INSERT INTO faculty (name, dept_id, designation, experience, qualification, email, phone) VALUES
('Dr. Rajesh Kumar', 1, 'Professor', 15, 'PhD in Computer Science, IIT Delhi', 'rajesh.kumar@college.edu', '9123456780'),
('Dr. Anita Desai', 1, 'Associate Professor', 10, 'PhD in AI/ML, IIT Bombay', 'anita.desai@college.edu', '9123456781'),
('Prof. Suresh Nair', 2, 'Assistant Professor', 7, 'M.Tech in VLSI, NIT Trichy', 'suresh.nair@college.edu', '9123456782'),
('Dr. Meena Gupta', 3, 'Professor', 20, 'PhD in Thermal Engineering, IISc', 'meena.gupta@college.edu', '9123456783'),
('Prof. Arun Joshi', 4, 'Associate Professor', 12, 'M.Tech in Structural Engineering', 'arun.joshi@college.edu', '9123456784');

-- Placements
INSERT INTO placements (dept_id, academic_year, students_placed, total_students, highest_package, average_package) VALUES
(1, '2023-24', 85, 120, 4500000.00, 800000.00),
(2, '2023-24', 70, 100, 3200000.00, 650000.00),
(3, '2023-24', 45, 80, 1800000.00, 500000.00),
(4, '2023-24', 40, 75, 1500000.00, 450000.00),
(5, '2023-24', 55, 90, 2000000.00, 550000.00);

-- Job Notifications
INSERT INTO job_notifications (company_name, position, description, eligibility, package, location, last_date, is_active) VALUES
('Google India', 'Software Engineer', 'Full-time position for backend development', 'B.Tech CSE, No backlogs, CGPA > 7.5', 2500000.00, 'Bangalore', '2025-01-15', TRUE),
('Amazon', 'Data Analyst', 'Analyze large datasets and create reports', 'Any Engineering branch, CGPA > 7.0', 1800000.00, 'Hyderabad', '2025-01-20', TRUE),
('Microsoft', 'Cloud Engineer', 'Work on Azure cloud infrastructure', 'CSE/ECE, CGPA > 8.0', 2200000.00, 'Pune', '2025-01-25', TRUE);

-- Internships
INSERT INTO internships (company_name, position, description, duration, stipend, location, last_date, is_active) VALUES
('Infosys', 'Software Development Intern', 'Summer internship program', '2 months', 15000.00, 'Bangalore', '2025-02-01', TRUE),
('TCS', 'Data Science Intern', 'Work on ML projects', '3 months', 20000.00, 'Mumbai', '2025-02-05', TRUE),
('Wipro', 'Web Development Intern', 'Frontend development', '2 months', 12000.00, 'Chennai', '2025-02-10', TRUE);

-- Examinations
INSERT INTO examinations (exam_name, exam_type, dept_id, year, subject, exam_date, start_time, end_time, room_number) VALUES
('Mid-Term Exam', 'Theory', 1, 4, 'Data Structures', '2025-01-15', '10:00:00', '13:00:00', 'A-101'),
('End-Term Exam', 'Theory', 1, 4, 'Database Management', '2025-02-20', '14:00:00', '17:00:00', 'A-102'),
('Mid-Term Exam', 'Theory', 2, 3, 'Digital Electronics', '2025-01-16', '10:00:00', '13:00:00', 'B-201'),
('Lab Exam', 'Practical', 3, 2, 'Manufacturing Lab', '2025-01-18', '09:00:00', '12:00:00', 'Workshop-1');

-- Alumni
INSERT INTO alumni (name, roll_number, dept_id, graduation_year, current_company, current_position, email, phone) VALUES
('Karthik Iyer', 'CS2019001', 1, 2023, 'Google', 'Software Engineer', 'karthik.iyer@gmail.com', '9988776655'),
('Divya Menon', 'EC2019001', 2, 2023, 'Intel', 'Hardware Engineer', 'divya.menon@gmail.com', '9988776656'),
('Ravi Verma', 'ME2019001', 3, 2023, 'Tata Motors', 'Design Engineer', 'ravi.verma@gmail.com', '9988776657');

-- Admin (password is 'admin123' - in production, use hashed passwords)
INSERT INTO admin (username, password, email) VALUES
('admin', 'admin123', 'admin@college.edu');