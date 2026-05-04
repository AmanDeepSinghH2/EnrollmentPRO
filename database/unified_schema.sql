-- ==========================================================
-- EnrollmentPRO Unified Authentication Schema
-- ==========================================================

-- 1. Users Table (The source of truth for authentication)
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('student', 'faculty', 'admin') NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table (Profile info linked to Users)
CREATE TABLE Students (
    StudentID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255),
    PhoneNumber VARCHAR(15),
    DOB DATE,
    Semester INT DEFAULT 1,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 3. Faculty Table (Profile info linked to Users)
CREATE TABLE Faculty (
    FacultyID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15),
    DOB DATE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 4. StudentParents Table
CREATE TABLE StudentParents (
    ParentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    ParentType ENUM('Mother', 'Father'),
    PhoneNumber VARCHAR(15),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

-- 5. Courses Table
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Code VARCHAR(20) UNIQUE
);

-- 6. CourseFaculty Mapping
CREATE TABLE CourseFaculty (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    CourseID INT NOT NULL,
    FacultyID INT NOT NULL,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE,
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

-- 7. Enrollments Table
CREATE TABLE Enrollments (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    Status ENUM('Pending', 'Enrolled', 'Completed', 'Dropped') DEFAULT 'Pending',
    EnrollmentDate DATE,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

-- 8. Grades Table
CREATE TABLE Grades (
    GradeID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    CourseID INT NOT NULL,
    Grade VARCHAR(2) NOT NULL,
    GradeDate DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE,
    UNIQUE (StudentID, CourseID)
);
