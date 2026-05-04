# EnrollmentPRO

A modern, digital university enrollment system built for SRMIST. Simplifies and streamlines the enrollment process for students and faculty with a secure, efficient, and user-friendly platform.

## 🚀 Live Site

**Production URL:** [https://enrollmentpro-e30fd.web.app](https://enrollmentpro-e30fd.web.app)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Authentication** | Firebase Auth (Email/Password) |
| **Database** | Cloud Firestore (NoSQL) |
| **Hosting** | Firebase Hosting (CDN + HTTPS) |
| **Fonts/Design** | Google Fonts (Inter), Glassmorphism UI |

## ✨ Core Features

1. **Course Enrollment (One-and-Done):** Students can browse available courses and enroll in them. Faculty adjust seat limits, semesters, and can instantly approve course enrollments.
2. **Semester Registration (3-Step Handshake):** Students apply for their upcoming semester. Faculty review and approve applications. Students must formally *Confirm* their enrollment once approved.
3. **Global Notice Board:** Faculty can issue university-wide or department-wide notices (with links/announcements), and students can read them instantly.
4. **Faculty Workload Management:** Faculty can "Take Up" or "Drop" courses to build their teaching profile.

## 📁 Project Structure

```
enrollmentpro/
├── public/                          ← Deployed to Firebase Hosting
│   ├── index.html                   ← Landing page
│   ├── about.html                   ← About us
│   ├── auth/                        ← Authentication
│   │   ├── signin.html
│   │   └── signup.html
│   ├── student/                     ← Student portal
│   │   ├── dashboard.html
│   │   ├── browse-courses.html      ← Course Catalog & Enrollment
│   │   ├── semester-registration.html ← 3-Step Semester Registration
│   │   ├── enrollment-status.html
│   │   ├── notice-board.html        ← View global notices
│   │   └── my-courses.html
│   ├── faculty/                     ← Faculty portal
│   │   ├── dashboard.html
│   │   └── manage/
│   │       ├── students.html
│   │       ├── courses.html         ← Course & Seat Limits Management
│   │       ├── semester-registrations.html ← Approve Semesters
│   │       ├── enrollments.html
│   │       ├── notices.html         ← Issue global notices
│   │       ├── grades.html
│   │       └── student-parents.html
│   ├── css/styles.css               ← Design system
│   └── js/                          ← JavaScript modules
│       ├── firebase-config.js
│       ├── auth.js
│       ├── guards.js
│       ├── utils.js
│       ├── services/                ← Backend DB logic
│       │   ├── user.service.js
│       │   ├── course.service.js
│       │   ├── enrollment.service.js
│       │   ├── semester.service.js
│       │   └── notice.service.js
│       └── components/
│           ├── header.js
│           ├── footer.js
│           └── toast.js
├── firestore.rules                  ← Security & RBAC rules
├── firestore.indexes.json           ← Database index configs
└── firebase.json                    ← Firebase config
```

## 🔧 Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`

### Step 1: Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., `enrollmentpro`)
3. Enable **Authentication** → Email/Password
4. Enable **Cloud Firestore** → Create database

### Step 2: Configure
1. Register a Web App in Firebase Console → Project Settings
2. Copy the config keys
3. Update `public/js/firebase-config.js` with your keys

### Step 3: Local Development
```bash
firebase login
firebase init          # Select Firestore + Hosting
firebase serve         # Start local testing server
```

### Step 4: Deploy
```bash
firebase deploy
```

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Browse courses, apply for semesters, view global notices, check enrollment status. |
| **Faculty** | Issue notices, approve semester registrations, adjust course seat limits, manage student enrollments, and self-assign courses. |

## 🔒 Security

- **Authentication:** Firebase Auth handles authentication (password hashing, JWT tokens).
- **Role-Based Access Control (RBAC):** Firestore Security Rules enforce strict data segregation. For example, students can only read notices, while faculty can write them.
- **Client-Side:** Guard scripts (`guards.js`) prevent unauthorized access to portal URLs.

## 📄 SEPM Course

Built as part of the **Software Engineering & Project Management** course at SRM Institute of Science and Technology.
