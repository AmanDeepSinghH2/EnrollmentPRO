# EnrollmentPRO

A modern, digital university enrollment system built for SRMIST. Simplifies and streamlines the enrollment process for students and faculty with a secure, efficient, and user-friendly platform.

## 🚀 Live Site

> Deploy with `firebase deploy` — see instructions below.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Authentication** | Firebase Auth (Email/Password) |
| **Database** | Cloud Firestore (NoSQL) |
| **Hosting** | Firebase Hosting (CDN + HTTPS) |
| **Fonts** | Google Fonts (Inter) |

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
│   │   ├── enrollment-status.html
│   │   └── my-courses.html
│   ├── faculty/                     ← Faculty portal
│   │   ├── dashboard.html
│   │   └── manage/
│   │       ├── students.html
│   │       ├── faculty-list.html
│   │       ├── courses.html
│   │       ├── course-faculty.html
│   │       ├── enrollments.html
│   │       ├── grades.html
│   │       └── student-parents.html
│   ├── css/styles.css               ← Design system
│   └── js/                          ← JavaScript modules
│       ├── firebase-config.js
│       ├── auth.js
│       ├── guards.js
│       ├── utils.js
│       └── components/
│           ├── header.js
│           ├── footer.js
│           └── toast.js
├── firestore.rules                  ← Security rules
├── firebase.json                    ← Firebase config
└── _legacy/                         ← Archived old codebase
```

## 🔧 Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`

### Step 1: Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., `enrollmentpro-srmist`)
3. Enable **Authentication** → Email/Password
4. Enable **Cloud Firestore** → Create database

### Step 2: Configure
1. Register a Web App in Firebase Console → Project Settings
2. Copy the config keys
3. Update `public/js/firebase-config.js` with your keys

### Step 3: Local Development
```bash
firebase login
firebase init          # Select Firestore + Hosting + Emulators
firebase emulators:start
# → http://localhost:5000
```

### Step 4: Deploy
```bash
firebase deploy
```

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | View dashboard, check enrollment status, view courses & grades |
| **Faculty** | Full dashboard, manage students/courses/enrollments/grades/parents |

## 🔒 Security

- Firebase Auth handles authentication (password hashing, JWT tokens)
- Firestore Security Rules enforce role-based access control
- No innerHTML with user data (XSS prevention)
- All data operations use authenticated Firestore SDK

## 📄 SEPM Course

Built as part of the **Software Engineering & Project Management** course at SRM Institute of Science and Technology.
