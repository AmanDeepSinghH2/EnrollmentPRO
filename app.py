from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configuration
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Change this in production
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'enrollmentpro'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # student, faculty
    name = data.get('name')

    if not all([username, email, password, role, name]):
        return jsonify({"error": "All fields are required"}), 400

    if role not in ['student', 'faculty']:
        return jsonify({"error": "Invalid role"}), 400

    cur = mysql.connection.cursor()
    
    # Check if user exists
    cur.execute("SELECT UserID FROM Users WHERE Username = %s OR Email = %s", (username, email))
    if cur.fetchone():
        cur.close()
        return jsonify({"error": "Username or Email already exists"}), 409

    # Hash password
    hashed_pw = generate_password_hash(password)

    try:
        # 1. Insert into Users table
        cur.execute("INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES (%s, %s, %s, %s)",
                    (username, email, hashed_pw, role))
        user_id = cur.lastrowid

        # 2. Insert into profile table
        if role == 'student':
            cur.execute("INSERT INTO Students (UserID, Name) VALUES (%s, %s)", (user_id, name))
        else:
            cur.execute("INSERT INTO Faculty (UserID, Name) VALUES (%s, %s)", (user_id, name))

        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        mysql.connection.rollback()
        cur.close()
        return jsonify({"error": str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    login_id = data.get('username')  # This can be username or email
    password = data.get('password')

    if not login_id or not password:
        return jsonify({"error": "Username/Email and password are required"}), 400

    cur = mysql.connection.cursor()
    # Check both Username and Email
    cur.execute("SELECT UserID, Username, PasswordHash, Role FROM Users WHERE Username = %s OR Email = %s", (login_id, login_id))
    user = cur.fetchone()
    cur.close()

    if user and check_password_hash(user['PasswordHash'], password):
        # Set session
        session['user_id'] = user['UserID']
        session['username'] = user['Username']
        session['role'] = user['Role']

        # Determine redirect path
        redirect_path = '/student/dashboard.html' if user['Role'] == 'student' else '/faculty/dashboard.html'
        if user['Role'] == 'admin':
            redirect_path = '/admin/dashboard.html'

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user['UserID'],
                "username": user['Username'],
                "role": user['Role']
            },
            "redirect": redirect_path
        }), 200
    
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/auth/me', methods=['GET'])
def get_me():
    if 'user_id' in session:
        cur = mysql.connection.cursor()
        user_id = session['user_id']
        role = session['role']
        
        if role == 'student':
            cur.execute("""
                SELECT u.UserID, u.Username, u.Email, u.Role, s.Name, s.Address, s.PhoneNumber, s.DOB, s.Semester 
                FROM Users u JOIN Students s ON u.UserID = s.UserID WHERE u.UserID = %s
            """, (user_id,))
        else:
            cur.execute("""
                SELECT u.UserID, u.Username, u.Email, u.Role, f.Name, f.PhoneNumber, f.DOB 
                FROM Users u JOIN Faculty f ON u.UserID = f.UserID WHERE u.UserID = %s
            """, (user_id,))
            
        user_data = cur.fetchone()
        cur.close()
        
        if user_data:
            return jsonify(user_data), 200
        return jsonify({"error": "User profile not found"}), 404
        
    return jsonify({"error": "Not authenticated"}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)
